import fs from 'fs-extra';
import Mustache from 'mustache';
import BungieNewsArticle from './BungieNewsArticle.js';

export default class VersionInfoBoxFactory {
  private static TEMPLATE_FP = './templates/VersionInfoBox.txt';

  private static template: string;

  private article: BungieNewsArticle;

  constructor(article: BungieNewsArticle) {
    this.article = article;
  }

  public create(opt?: {
    prev: BungieNewsArticle,
    next: BungieNewsArticle,
  }): string {
    const template = VersionInfoBoxFactory.getTemplate();
    return Mustache.render(template, {
      Image: this.getImage(),
      UpdateType: this.getVersionType(),
      Version: this.getVersion(),
      ReleaseDate: this.getFormattedDate(),
      Description: this.getArticle().getSubtitle(),
      Highlights: '',
      Link: this.getArticle().getArticleLink(),
      Prev: opt ? this.getVersion(opt.prev) : '',
      Next: opt ? this.getVersion(opt.next) : '',
    });
  }

  /**
   * @returns version info box image
   */
  private getImage(): string {
    const type = this.getVersionType();
    if (type === 'Hotfix') return 'Update Hotfix Thumbnail.jpg';
    if (type === 'Patch') return 'Update Patch Thumbnail.jpg';
    return '';
  }

  /**
   * @param {BungieNewsArticle} [article] if omitted, uses internal article
   * @returns article version
   */
  private getVersion(article: BungieNewsArticle = this.getArticle()): string {
    const fieldsToSearch = [
      article.getTitle(),
      article.getSubtitle(),
      article.getSummary(),
      article.getMobileTitle(),
      article.getContent(),
    ];

    // search for a version number
    for (let i = 0; i < fieldsToSearch.length; i += 1) {
      const field = fieldsToSearch[i];
      const searchResult = field.match(/\d(?:\.\d){2,3}/);
      if (searchResult !== null) return searchResult[0];
    }

    // could not find version number, return empty string
    return '';
  }

  private getVersionType(): '' | 'Hotfix' | 'Patch' {
    const article = this.getArticle();
    const banner = article.getArticleBanner().toLowerCase();
    if (banner.includes('patch')) return 'Patch';
    if (banner.includes('hotfix')) return 'Hotfix';
    return '';
  }

  private getFormattedDate() {
    const article = this.getArticle();
    const isoDateTime: string = article.getCreationDate();
    const date = new Date(isoDateTime);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private getArticle(): BungieNewsArticle {
    return this.article;
  }

  private static getTemplate(): string {
    if (VersionInfoBoxFactory.template === undefined) {
      const templateFP = VersionInfoBoxFactory.TEMPLATE_FP;
      VersionInfoBoxFactory.template = fs.readFileSync(templateFP).toString();
    }

    return VersionInfoBoxFactory.template;
  }
}
