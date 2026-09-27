import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string = process.env.BASE_URL ?? 'https://sauce-demo.myshopify.com',
  ) {}

  async getDocument(path: string) {
    const endpoint = path.startsWith('http') ? path : `${this.baseURL}${path.startsWith('/') ? path : `/${path}`}`;
    return this.request.get(endpoint);
  }

  async getCollectionPage() {
    return this.getDocument('/collections/all');
  }

  async getSearchPage(query: string) {
    return this.getDocument(`/search?type=product&q=${encodeURIComponent(query)}`);
  }
}
