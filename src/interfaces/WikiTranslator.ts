export interface WikiTranslator {
  translate(): Promise<string>
}
