import { ServerConfigDTO } from "models/index";
import { getServerConfig } from "../services/api.service";

export default class Config {
  private static MODE: string | null | undefined = null;

  private static serverConfig: ServerConfigDTO | null | undefined = null;
  public static SOCKET_SERVER: string = ""
  public static IS_PRODUCTION: boolean | null | undefined = null;
  public static isInitialized: boolean = false;
  public static GIT_BRANCH: string = "";

  public static async initialize() {
    Config.serverConfig = await getServerConfig();
    sessionStorage.setItem("serverConfig", JSON.stringify(Config.serverConfig));

    Config.MODE = Config.serverConfig?.environment;
    Config.IS_PRODUCTION = Config.serverConfig?.isProduction;
    Config.SOCKET_SERVER = Config.serverConfig?.socketServer;
    Config.GIT_BRANCH = Config.serverConfig?.gitBranch;
    Config.isInitialized = true;
  }
}
