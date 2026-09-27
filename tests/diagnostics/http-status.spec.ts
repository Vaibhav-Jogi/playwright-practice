import { test, expect } from '../fixtures/test-fixtures';

type HttpResponseRecord = {
  page: string;
  method: string;
  resourceType: string;
  endpoint: string;
  received: boolean;
  status: number;
  statusText: string;
  contentType: string;
  responseBody: string;
  bodyTruncated: boolean;
  bodyReadError?: string;
};

type HttpFailure = HttpResponseRecord;

const storefrontUrl = process.env.BASE_URL ?? 'https://sauce-demo.myshopify.com';
const responseBodyPreviewLimit = 3000;
const storefrontPages = [
  '/',
  '/collections/all',
  '/search?type=product&q=jacket',
  '/products/grey-jacket',
  '/products/brown-shades',
  '/cart',
  '/account/login',
  '/account/register',
  '/pages/about-us',
  '/blogs/news',
];
const trackedResourceTypes = new Set(['document', 'fetch', 'xhr']);

function escapeMarkdown(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function responseRows(responses: HttpResponseRecord[]) {
  return responses.map((response) => {
    const status = response.status >= 400 ? `**${response.status}**` : `${response.status}`;
    return `| ${escapeMarkdown(response.method)} | ${escapeMarkdown(response.resourceType)} | ${status} | ${escapeMarkdown(response.endpoint)} | ${escapeMarkdown(response.contentType)} |`;
  }).join('\n');
}

function responseBodySections(responses: HttpResponseRecord[]) {
  return responses.map((response, index) => {
    const body = response.bodyReadError
      ? `Body could not be read: ${response.bodyReadError}`
      : response.responseBody || '[empty response body]';

    return `### Response ${index + 1}: ${escapeMarkdown(response.method)} ${escapeMarkdown(response.endpoint)}

- **Page:** ${escapeMarkdown(response.page)}
- **Resource type:** ${escapeMarkdown(response.resourceType)}
- **Status:** ${response.status} ${escapeMarkdown(response.statusText)}
- **Content type:** ${escapeMarkdown(response.contentType)}
- **Body preview:** ${response.bodyTruncated ? `truncated to ${responseBodyPreviewLimit} characters` : 'complete'}

<pre>${escapeHtml(body)}</pre>`;
  }).join('\n\n');
}

function createHumanReadableReport(
  responses: HttpResponseRecord[],
  failures: HttpFailure[],
) {
  const successfulResponses = responses.filter((response) => response.status < 400).length;
  const apiResponses = responses.filter((response) => response.resourceType === 'fetch' || response.resourceType === 'xhr');
  const jsonResponses = responses.filter((response) => response.contentType.toLowerCase().includes('application/json'));
  const pageResponses = responses.filter((response) => response.resourceType === 'document');
  const sections = storefrontPages.map((route) => {
    const routeResponses = responses.filter((response) => response.page === route);
    const routeApiResponses = routeResponses.filter((response) => response.resourceType === 'fetch' || response.resourceType === 'xhr');
    const routePageResponses = routeResponses.filter((response) => response.resourceType === 'document');
    const pageTable = routePageResponses.length > 0
      ? `| Method | Type | Status | Endpoint | Content type |\n| --- | --- | ---: | --- | --- |\n${responseRows(routePageResponses)}`
      : '_No document response recorded._';
    const apiTable = routeApiResponses.length > 0
      ? `| Method | Type | Status | Endpoint | Content type |\n| --- | --- | ---: | --- | --- |\n${responseRows(routeApiResponses)}`
      : '_No fetch/XHR response recorded._';

    return `### ${route}\n\n**Page responses**\n\n${pageTable}\n\n**API and background responses**\n\n${apiTable}`;
  }).join('\n\n');
  const failureSection = failures.length > 0
    ? failures.map((failure) => `- **${failure.status}** ${failure.method} ${failure.endpoint} while loading ${failure.page}`).join('\n')
    : 'None. All tracked same-origin responses were below HTTP 400.';
  const jsonSection = jsonResponses.length > 0
    ? `| Method | Type | Status | Endpoint | Page |\n| --- | --- | ---: | --- | --- |\n${jsonResponses.map((response) => {
      const status = response.status >= 400 ? `**${response.status}**` : `${response.status}`;
      return `| ${escapeMarkdown(response.method)} | ${escapeMarkdown(response.resourceType)} | ${status} | ${escapeMarkdown(response.endpoint)} | ${escapeMarkdown(response.page)} |`;
    }).join('\n')}`
    : '_No application/json responses were received during this run._';

  return `# Storefront HTTP Health Report

**Generated:** ${new Date().toISOString()}  \n**Threshold:** responses with status code **400 or higher** are failures  \n**Scope:** same-origin document, fetch, and XHR responses only

## Executive Summary

| Measure | Result |
| --- | ---: |
| Pages checked | ${storefrontPages.length} |
| Responses received | ${responses.length} |
| Successful responses | ${successfulResponses} |
| Responses at or above 400 | ${failures.length} |
| API/background responses | ${apiResponses.length} |
| JSON/API responses | ${jsonResponses.length} |
| Page/document responses | ${pageResponses.length} |

**Overall result:** ${failures.length === 0 ? 'PASS' : 'FAIL'}

## Failures

${failureSection}

## JSON/API Responses

This section includes only responses whose content type contains application/json. HTML page responses and non-JSON analytics responses are excluded.

${jsonSection}

## Response Bodies

Response bodies are shown as escaped previews to keep the report readable and safe to render. Each preview is limited to ${responseBodyPreviewLimit} characters.

${responseBodySections(responses)}

## Detailed Results

${sections}

## Reporting Notes

- Document records represent page navigation and same-origin document requests.
- Fetch and XHR records represent API or background browser requests.
- JSON/API responses are identified from the response content type, not only the request resource type.
- Response bodies are captured after each response is received and included as bounded previews.
- Third-party origins are intentionally excluded from the health decision.
`;
}

test.describe('HTTP status diagnostics', () => {
  test('TC10: Storefront pages and same-origin APIs do not return HTTP 400 or higher', { tag: ['@diagnostics', '@network'] }, async ({ page }, testInfo) => {
    const origin = new URL(storefrontUrl).origin;
    const responses: HttpResponseRecord[] = [];
    const failures: HttpFailure[] = [];
    const bodyReads: Promise<void>[] = [];
    let currentRoute = 'not started';

    page.on('response', (response) => {
      const request = response.request();
      const responseUrl = new URL(response.url());

      if (!trackedResourceTypes.has(request.resourceType()) || responseUrl.origin !== origin) {
        return;
      }

      const record: HttpResponseRecord = {
        page: currentRoute,
        method: request.method(),
        resourceType: request.resourceType(),
        endpoint: response.url(),
        received: true,
        status: response.status(),
        statusText: response.statusText(),
        contentType: response.headers()['content-type'] ?? 'not provided',
        responseBody: '',
        bodyTruncated: false,
      };

      responses.push(record);
      bodyReads.push(
        response.body()
          .then((body) => {
            const bodyText = body.toString('utf8');
            record.bodyTruncated = bodyText.length > responseBodyPreviewLimit;
            record.responseBody = bodyText.slice(0, responseBodyPreviewLimit);
          })
          .catch((error: Error) => {
            record.bodyReadError = error.message;
          }),
      );

      if (record.status >= 400) {
        failures.push(record);
      }
    });

    for (const route of storefrontPages) {
      currentRoute = route;
      const response = await page.goto(`${storefrontUrl}${route}`);
      expect(response, `Expected a document response for ${route}`).not.toBeNull();
      expect(response?.status(), `Initial document request failed for ${route}`).toBeLessThan(400);
    }

    await Promise.all(bodyReads);

    const jsonResponses = responses.filter((response) => response.contentType.toLowerCase().includes('application/json'));

    await testInfo.attach('http-status-report.md', {
      body: createHumanReadableReport(responses, failures),
      contentType: 'text/markdown',
    });

    await testInfo.attach('http-status-summary.json', {
      body: JSON.stringify({
        checkedPages: storefrontPages,
        trackedResourceTypes: [...trackedResourceTypes],
        responseBodyPreviewLimit,
        totalResponsesVerified: responses.length,
        totalJsonResponses: jsonResponses.length,
        jsonResponses,
        responses,
        failures,
      }, null, 2),
      contentType: 'application/json',
    });

    console.info(
      `HTTP health: ${responses.length} responses verified, `
      + `${jsonResponses.length} JSON/API responses, `
      + `${failures.length} response(s) with status 400 or higher`,
    );

    expect(
      failures,
      'Unexpected same-origin HTTP responses with status 400 or higher',
    ).toEqual([]);
  });
});
