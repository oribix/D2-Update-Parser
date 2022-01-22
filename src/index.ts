import fs from 'fs-extra';
import Mustache from 'mustache';
import BungieNewsArticle from './BungieNewsArticle.js';
import UpdateArticleFetcher from './UpdateArticleFetcher.js';
import UpdateWikiPageFactory from './UpdateWikiPageFactory.js';
import VersionInfoBoxFactory from './VersionInfoBoxFactory.js';

class App {
  public static async main() {
    this.init();

    const updateFetcher = UpdateArticleFetcher.getInstance();
    const depth = Number.parseInt(process.argv[2], 10) || 5;
    const articles = await updateFetcher.getByPageRange(1, depth);
    this.convertArticlesToWikiPages(articles);
  }

  public static convertArticlesToWikiPages(articles: BungieNewsArticle[]) {
    articles.reverse().forEach((article, i) => {
      const fp = this.getFilePath(article);

      const vboxFactory = new VersionInfoBoxFactory(article);
      vboxFactory.setPrevUpdate(articles[i - 1]);
      vboxFactory.setNextUpdate(articles[i + 1]);

      const pageFactory = new UpdateWikiPageFactory(article);
      pageFactory.setVersionInfoBoxFactory(vboxFactory);
      fs.ensureFile(fp)
        .then(() => pageFactory.create())
        .then((page) => fs.writeFile(fp, page))
        .then(() => console.log(fp));
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
    const fp = `./bin/${folderName} - ${filename}.txt`;
    return fp;
  }
}

App.main();
