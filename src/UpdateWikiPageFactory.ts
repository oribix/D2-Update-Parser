import fs from 'fs-extra';
import Mustache from 'mustache';
import BungieNewsArticle from './BungieNewsArticle';
import D2UpdateParser from './D2UpdateParser.js';
import VersionInfoBoxFactory from './VersionInfoBoxFactory.js';

export default class UpdateWikiPageFactory {
  private static TEMPLATE_FP = './templates/wikipage.txt';

  private static pageTemplate: string;

  private article: BungieNewsArticle;

  constructor(article: BungieNewsArticle) {
    this.article = article;
  }

  public async create(): Promise<string> {
    const article = this.getArticle();
    const template = UpdateWikiPageFactory.getTemplate();

    const vboxFactory = new VersionInfoBoxFactory(article);
    const page = {
      content: await D2UpdateParser.parse(article),
      versionInfoBox: vboxFactory.create(),
    };

    return Mustache.render(template.toString(), page);
  }

  private static getTemplate(): string {
    if (!UpdateWikiPageFactory.pageTemplate) {
      const templateFP = UpdateWikiPageFactory.TEMPLATE_FP;
      UpdateWikiPageFactory.pageTemplate = fs.readFileSync(templateFP).toString();
    }

    return UpdateWikiPageFactory.pageTemplate;
  }

  private getArticle(): BungieNewsArticle {
    return this.article;
  }
}
