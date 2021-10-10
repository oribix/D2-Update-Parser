import BungieContentAPIController from './BungieContentAPIController.js';
import BungieNewsArticle from './BungieNewsArticle.js';
import { NewsArticleFetcher } from './interfaces/ArticleFetcher';
import { BungieContentAPI } from './interfaces/BungieContentAPI';

export default class UpdateArticleFetcher implements NewsArticleFetcher {
  private static instance: UpdateArticleFetcher;

  private contentAPI: BungieContentAPI;

  private constructor() {
    this.contentAPI = BungieContentAPIController.getInstance();
  }

  public static getInstance(): UpdateArticleFetcher {
    if (!this.instance) {
      this.instance = new UpdateArticleFetcher();
    }
    return this.instance;
  }

  async getAll(): Promise<BungieNewsArticle[]> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<BungieNewsArticle> {
    const response = await this.contentAPI.getContentById({ id, locale: 'en' });
    if (response.ErrorCode !== 1) throw new Error('Bad Response');
    return new BungieNewsArticle(response.Response);
  }

  async getByPage(pageNumber: number): Promise<BungieNewsArticle[]> {
    const articles: BungieNewsArticle[] = [];
    try {
      const searchResult = await this.searchNewsContentPage(pageNumber);
      const results = BungieNewsArticle.createAll(searchResult.results);
      articles.push(...results);
    } catch (e) { /** do nothing */ }

    return UpdateArticleFetcher.filter(articles);
  }

  async getByPageRange(startPage: number, endPage: number): Promise<BungieNewsArticle[]> {
    const articles: BungieNewsArticle[] = [];
    try {
      for (let i = startPage; i <= endPage; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const searchResult = await this.searchNewsContentPage(i);
        const results = BungieNewsArticle.createAll(searchResult.results);
        articles.push(...results);
        if (!searchResult.hasMore) break;
      }
    } catch (e) { /** do nothing */ }

    return UpdateArticleFetcher.filter(articles);
  }

  private async searchNewsContentPage(pageNumber: number) {
    // eslint-disable-next-line no-await-in-loop
    const serverResponse = await this.contentAPI.searchContentWithText({
      locale: 'en',
      ctype: 'News',
      currentpage: pageNumber,
    });
    const searchResults = serverResponse.Response;
    return searchResults;
  }

  private static filter(articles: BungieNewsArticle[]) {
    return articles.filter(UpdateArticleFetcher.isDestiny2Patch);
  }

  /**
   * @param article
   * @returns true if article is a D2 Patch Article
   */
  private static isDestiny2Patch(article: BungieNewsArticle) {
    return article.getArticleBanner().includes('Update');
  }
}
