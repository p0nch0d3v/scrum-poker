import { ServerConfigDTO } from "models/index";
import { getServerConfig } from "../services/api.service";
import { reverseString } from "../helpers/helpers";
import { AppConstants } from "models/index";

export default class Config {
  private static MODE: string | null | undefined = null;

  private static serverConfig: ServerConfigDTO | null | undefined = null;
  public static ApplicationTitle: string = "";
  public static SOCKET_SERVER: string = "";
  public static IS_PRODUCTION: boolean | null | undefined = null;
  public static GOOGLE_AUTH_CLIENT_ID: string = "";
  public static isInitialized: boolean = false;

  public static async initialize() {
    Config.serverConfig = await getServerConfig();
    sessionStorage.setItem("serverConfig", JSON.stringify(Config.serverConfig));

    Config.MODE = Config.serverConfig?.environment;
    Config.IS_PRODUCTION = Config.serverConfig?.isProduction;
    Config.SOCKET_SERVER = Config.serverConfig?.socketServer;
    Config.ApplicationTitle = Config.serverConfig?.isProduction === false ? reverseString(AppConstants.APP_TITLE) : AppConstants.APP_TITLE;
    Config.GOOGLE_AUTH_CLIENT_ID = Config.serverConfig.googleAuthClientId;
    Config.isInitialized = true;
  }
}
