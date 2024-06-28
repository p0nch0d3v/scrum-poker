import { ServerConfigDTO } from "models";
import Constants from "models/constants";
import { getServerConfig } from "../services/api.service";

export default class Config {
  private static MODE: string | null | undefined = null;

  private static serverConfig: ServerConfigDTO | null | undefined = null;
  public static SOCKET_SERVER: string = ""
  public static IS_PRODUCTION: boolean | null | undefined = null;
  public static isInitialized: boolean = false;

  public static async initialize() {
    Config.serverConfig = await getServerConfig();

    Config.MODE = Config.serverConfig?.environment;
    Config.IS_PRODUCTION = Config.MODE === Constants.Environments.production;
    Config.SOCKET_SERVER = Config.serverConfig?.socketServer;
    Config.isInitialized = true;
  }
}
