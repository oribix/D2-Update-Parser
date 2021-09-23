import BungieNewsArticle from '../BungieNewsArticle';

export interface NewsArticleFetcher {

  /**
   * get all Articles
   */
  getAll(): Promise<BungieNewsArticle[]>

  /**
   * get Article by ID
   * @param id
   */
  getById(id: string): Promise<BungieNewsArticle>

  /**
   * get Articles on a particular page
   * @param pageNumber
   */
  getByPage(pageNumber: number): Promise<BungieNewsArticle[]>

  /**
   * get Articles from startPage to endPage
   * @param startPage
   * @param endPage
   */
  getByPageRange(startPage: number, endPage: number): Promise<BungieNewsArticle[]>
}
