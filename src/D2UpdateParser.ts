import fs from 'fs-extra';
import BungieNewsArticle from './BungieNewsArticle.js';
import HtmlToWikiTranslator from './HtmlToWikiTranslator.js';
import { WikiTranslator } from './interfaces/WikiTranslator';
import PatchArticleFetcher from './PatchArticleFetcher.js';

/**
 * The Destiny 2 Update Parser turns a D2 update into a mediawiki page
 */
export default class D2UpdateParser {
  public static async main() {
    const patchArticleFetcher = PatchArticleFetcher.getInstance();
    const articles = await patchArticleFetcher.getByPageRange(1, 5);
    articles.forEach((article) => {
      this.buildWikiArticle(article);
    });
  }

  public static async buildWikiArticle(article: BungieNewsArticle): Promise<void> {
    const content = await D2UpdateParser.parse(article);
    const title: string = article.getTitle();
    const date = article.getCreationDate();

    const fp = this.getFilePath(article);
    await fs.ensureFile(fp);
    await fs.writeFile(fp, content);
  }

  private static getFilePath(article: BungieNewsArticle): string {
    const title: string = article.getTitle();
    const date = article.getCreationDate();

    const filename = title.replace(/\//g, '-');
    const folderName = date.replace(/:/g, '-');
    const fp = `./bin/${folderName}/${filename}.txt`;
    return fp;
  }

  /**
   * @param article
   * @returns article parsed as wikitext
   */
  private static async parse(article: BungieNewsArticle): Promise<string> {
    const html = article.getContent();
    const translator: WikiTranslator = new HtmlToWikiTranslator(html);
    const markup = await translator.translate();
    return markup;
  }
}

D2UpdateParser.main();
