import fs from 'fs-extra';
import BungieNewsArticle from './BungieNewsArticle.js';
import D2UpdateParser from './D2UpdateParser.js';
import PatchArticleFetcher from './PatchArticleFetcher.js';

class App {
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
}

App.main();
