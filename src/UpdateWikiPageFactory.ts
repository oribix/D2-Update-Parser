import fs from 'fs-extra';
import Mustache from 'mustache';
import BungieNewsArticle from './BungieNewsArticle';
import D2UpdateParser from './D2UpdateParser.js';
import VersionInfoBoxFactory from './VersionInfoBoxFactory.js';

export default class UpdateWikiPageFactory {
  private static TEMPLATE_FP = './templates/wikipage.txt';

  private static pageTemplate: string;

  private article: BungieNewsArticle;

  private vboxFactory: VersionInfoBoxFactory | undefined;

  constructor(article: BungieNewsArticle) {
    this.article = article;
  }

  public async create(): Promise<string> {
    const template = UpdateWikiPageFactory.getTemplate();

    const page = {
      content: await this.getParsedArticleContent(),
      versionInfoBox: this.getVersionInfoBoxContent(),
    };

    return Mustache.render(template, page);
  }

  private async getParsedArticleContent(): Promise<string> {
    const article = this.getArticle();
    const updateParser = new D2UpdateParser(article);
    let content: string;
    try {
      content = await updateParser.parse();
    } catch (error) {
      content = '';
    }
    return content;
  }

  private getVersionInfoBoxContent(): string {
    const vboxFactory = this.getVersionInfoBoxFactory();
    return vboxFactory.create();
  }

  private static getTemplate(): string {
    if (!UpdateWikiPageFactory.pageTemplate) {
      const templateFP = UpdateWikiPageFactory.TEMPLATE_FP;
      UpdateWikiPageFactory.pageTemplate = fs.readFileSync(templateFP).toString();
    }

    return UpdateWikiPageFactory.pageTemplate;
  }

  private getVersionInfoBoxFactory(): VersionInfoBoxFactory {
    if (!this.vboxFactory) {
      this.vboxFactory = new VersionInfoBoxFactory(this.getArticle());
    }

    return this.vboxFactory;
  }

  public setVersionInfoBoxFactory(vboxFactory: VersionInfoBoxFactory): void {
    this.vboxFactory = vboxFactory;
  }

  private getArticle(): BungieNewsArticle {
    return this.article;
  }
}
