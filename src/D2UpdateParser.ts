import BungieNewsArticle from './BungieNewsArticle.js';
import HtmlToWikiTranslator from './HtmlToWikiTranslator.js';
import { WikiTranslator } from './interfaces/WikiTranslator';
import MarkupArtifactCleaner from './MarkupArtifactCleaner.js';

/**
 * The Destiny 2 Update Parser turns a D2 update into a mediawiki page
 */
export default class D2UpdateParser {
  private article: BungieNewsArticle;

  constructor(article: BungieNewsArticle) {
    this.article = article;
  }

  /**
   * @param article
   * @returns article parsed as wikitext
   */
  public async parse(): Promise<string> {
    const article: BungieNewsArticle = this.getArticle();
    const html = article.getContent();
    const translator: WikiTranslator = new HtmlToWikiTranslator(html);
    const markup = await translator.translate();
    const artifactCleaner = new MarkupArtifactCleaner(markup);
    artifactCleaner.fixArtifacts();
    return artifactCleaner.getMarkup();
  }

  private getArticle(): BungieNewsArticle {
    return this.article;
  }
}
