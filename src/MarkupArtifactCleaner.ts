export default class MarkupArtifactCleaner {
  private markup: string;

  constructor(markup: string) {
    this.markup = markup;
  }

  fixArtifacts(): void {
    this.fixBreakTags();
    this.fixBulletIndentation();
    this.collapseNewlines();
  }

  private fixBreakTags(): void {
    const breakTag = '<div><br /></div>';
    const escapedBreakTag = MarkupArtifactCleaner.escapeRegExp(breakTag);
    const breakTagRE = new RegExp(escapedBreakTag, 'g');
    const result = this.getMarkup().replace(breakTagRE, '<br />');
    this.setMarkup(result);
  }

  private fixBulletIndentation(): void {
    const markup = this.getMarkup();
    // implement me
  }

  private static escapeRegExp(reString: string) {
    // $& means the whole matched string
    return reString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private collapseNewlines(): void {
    const result = this.getMarkup().replace(/\n+/g, '\n');
    this.setMarkup(result);
  }

  public getMarkup() {
    return this.markup;
  }

  private setMarkup(markup: string): void {
    this.markup = markup;
  }
}