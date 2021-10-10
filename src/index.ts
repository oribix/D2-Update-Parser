import fs from 'fs-extra';
import Mustache from 'mustache';
import BungieNewsArticle from './BungieNewsArticle.js';
import UpdateArticleFetcher from './UpdateArticleFetcher.js';
import UpdateWikiPageFactory from './UpdateWikiPageFactory.js';

class App {
  public static async main() {
    this.init();

    const patchArticleFetcher = UpdateArticleFetcher.getInstance();
    const articles = await patchArticleFetcher.getByPageRange(1, 5);
    articles.forEach((article) => {
      const fp = this.getFilePath(article);
      const pageFactory = new UpdateWikiPageFactory(article);
      fs.ensureFile(fp)
        .then(() => pageFactory.create())
        .then((page) => fs.writeFile(fp, page));
    });
  }

  public static init(): void {
    Mustache.escape = (text) => text;
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
