import fs from 'fs-extra';
import Mustache from 'mustache';
import BungieNewsArticle from './BungieNewsArticle.js';

export default class VersionInfoBoxFactory {
  private static TEMPLATE_FP = './templates/VersionInfoBox.txt';

  private static template: string;

  private article: BungieNewsArticle;

  private prevUpdate: BungieNewsArticle | undefined;

  private nextUpdate: BungieNewsArticle | undefined;

  constructor(article: BungieNewsArticle) {
    this.article = article;
  }

  public create(): string {
    const template = VersionInfoBoxFactory.getTemplate();
    const prev = this.getPrevUpdate();
    const next = this.getNextUpdate();
    return Mustache.render(template, {
      Image: this.getImage(),
      UpdateType: this.getVersionType(),
      Version: this.getVersion(),
      ReleaseDate: this.getFormattedDate(),
      Description: this.getArticle().getSubtitle(),
      Highlights: '',
      Link: this.getArticle().getArticleLink(),
      Prev: prev ? this.getVersion(prev) : '',
      Next: next ? this.getVersion(next) : '',
      Title: this.getArticle().getTitle(),
      Author: this.getArticle().getAuthorDisplayName(),
      DateMLA: this.getMLAFormattedDate(),
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

  private getFormattedDate(): string {
    const article = this.getArticle();
    const isoDateTime: string = article.getCreationDate();
    const date = new Date(isoDateTime);

    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private getMLAFormattedDate(): string {
    const article = this.getArticle();
    const isoDateTime: string = article.getCreationDate();
    const date = new Date(isoDateTime);

    const longMonth = date.toLocaleString('en-US', { month: 'long' });
    const shortMonth = date.toLocaleString('en-US', { month: 'short' });
    const isAbbreviatedMonth = shortMonth.length < longMonth.length;
    const month = isAbbreviatedMonth ? `${shortMonth}.` : shortMonth;
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const year = date.toLocaleString('en-US', { year: 'numeric' });

    return `${day} ${month} ${year}`;
  }

  private getArticle(): BungieNewsArticle {
    return this.article;
  }

  private getPrevUpdate(): BungieNewsArticle | undefined {
    return this.prevUpdate;
  }

  public setPrevUpdate(update: BungieNewsArticle) {
    this.prevUpdate = update;
  }

  private getNextUpdate(): BungieNewsArticle | undefined {
    return this.nextUpdate;
  }

  public setNextUpdate(update: BungieNewsArticle) {
    this.nextUpdate = update;
  }

  private static getTemplate(): string {
    if (VersionInfoBoxFactory.template === undefined) {
      const templateFP = VersionInfoBoxFactory.TEMPLATE_FP;
      VersionInfoBoxFactory.template = fs.readFileSync(templateFP).toString();
    }

    return VersionInfoBoxFactory.template;
  }
}
