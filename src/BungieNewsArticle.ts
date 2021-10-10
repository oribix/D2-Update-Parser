import { ContentItemPublicContract } from 'bungie-api-ts/content';

export default class BungieNewsArticle {
  private article: ContentItemPublicContract;

  constructor(article: ContentItemPublicContract) {
    this.article = article;
  }

  public static create(article: ContentItemPublicContract): BungieNewsArticle {
    return new BungieNewsArticle(article);
  }

  public static createAll(articles: ContentItemPublicContract[]): BungieNewsArticle[] {
    return articles.map(BungieNewsArticle.create);
  }

  /**
   * @returns Title
   */
  getTitle(): string {
    return this.getProperty('Title');
  }

  /**
   * @returns Article Subtitle
   */
  getSubtitle(): string {
    return this.getProperty('Subtitle');
  }

  /**
   * @returns Article Summary
   */
  getSummary(): string {
    return this.getProperty('Summary');
  }

  /**
   * @param article
   * @returns article html content
   */
  getContent(): string {
    return this.getProperty('Content');
  }

  /**
   * @returns big banner path
   */
  getFrontPageBanner(): string {
    return this.getProperty('FrontPageBanner');
  }

  /**
   * @returns small banner path
   */
  getArticleBanner(): string {
    return this.getProperty('ArticleBanner');
  }

  /**
   * @example "Destiny 2 Hotfix 3.2.1.1"
   * @returns Mobile Title
   */
  getMobileTitle(): string {
    return this.getProperty('MobileTitle');
  }

  getCreationDate(): string {
    return this.getArticle().creationDate;
  }

  getContentID(): string {
    return this.getArticle().contentId;
  }

  getArticleLink(): string {
    const contentID = this.getContentID();
    const link = `https://www.bungie.net/en/Explore/Detail/News/${contentID}`;
    return link;
  }

  /**
   * @param propertyName property name
   * @returns Property value
   */
  private getProperty(propertyName: string): string {
    const value: Object = this.getArticle().properties[propertyName];
    return value ? value.toString() : '';
  }

  /**
   * @returns author's name
   */
  getAuthorDisplayName(): string {
    return this.getArticle().author.displayName;
  }

  private getArticle(): ContentItemPublicContract {
    return this.article;
  }
}
