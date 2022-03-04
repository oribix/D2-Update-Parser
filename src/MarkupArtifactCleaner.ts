export default class MarkupArtifactCleaner {
  private markup: string;

  private deletionRegexList: RegExp[] = [
    // single nuisance characters
    /\xa0/g,

    // nuisance tags
    /<\/?u\s*>/g,
    /<\/?div.*?>/g,

    // Large Structures
    /<br\s*\/?>\n----/g,
    /----/g,
    /<br\s*\/?>(?=\n={2,})/g,
    /(?<=={2,}\n)\n/g,
    /<small><\/small>/g,
    /<bog><\/big>/g,
    /'''<br \/>'''/g,
  ];

  constructor(markup: string) {
    this.markup = markup;
  }

  fixArtifacts(): void {
    this.fixBreakTags();
    // this.fixBulletIndentation();
    this.collapseNewlines();
    this.deleteArtifacts();
    // this.boldToHeader3();
  }

  private fixBreakTags(): void {
    const breakTag = '<div><br /></div>';
    const escapedBreakTag = MarkupArtifactCleaner.escapeRegExp(breakTag);
    const breakTagRE = new RegExp(escapedBreakTag, 'g');
    const result = this.getMarkup().replace(breakTagRE, '<br />');
    this.setMarkup(result);
  }

  /** TODO */
  // private fixBulletIndentation(): void {
  //   const markup = this.getMarkup();
  //   // implement me
  // }

  private collapseNewlines(): void {
    const result = this.getMarkup().replace(/\n+/g, '\n');
    this.setMarkup(result);
  }

  /**
   * Some bolded string should instead be interpreted as Header 3 titles
   */
  private boldToHeader3(): void {
    const boldTitleRE = /'''(.*)'''(?=\n+\*)/g;
    const result = this.getMarkup().replace(boldTitleRE, '=== $1 ===');
    this.setMarkup(result);
  }

  private deleteArtifacts(): void {
    this.deletionRegexList.forEach((re) => {
      const result = this.getMarkup().replace(re, '');
      this.setMarkup(result);
    });
  }

  private static escapeRegExp(reString: string) {
    // $& means the whole matched string
    return reString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  public getMarkup() {
    return this.markup;
  }

  private setMarkup(markup: string): void {
    this.markup = markup;
  }
}
