import BungieNewsArticle from './BungieNewsArticle.js';
import HtmlToWikiTranslator from './HtmlToWikiTranslator.js';
import { WikiTranslator } from './interfaces/WikiTranslator';

/**
 * The Destiny 2 Update Parser turns a D2 update into a mediawiki page
 */
export default class D2UpdateParser {
  /**
   * @param article
   * @returns article parsed as wikitext
   */
  public static async parse(article: BungieNewsArticle): Promise<string> {
    const html = article.getContent();
    const translator: WikiTranslator = new HtmlToWikiTranslator(html);
    const markup = await translator.translate();
    return markup;
  }
}
