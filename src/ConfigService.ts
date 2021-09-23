import fs from 'fs-extra';

interface Config {
  bungieApiKey: string;
}

export default class ConfigService {
  static CONFIG_FP: string = 'config.json';

  private static config: Config;

  static getConfig(): Config {
    if (!ConfigService.config) {
      this.config = fs.readJSONSync(this.CONFIG_FP) as Config;
    }
    return ConfigService.config;
  }
}
