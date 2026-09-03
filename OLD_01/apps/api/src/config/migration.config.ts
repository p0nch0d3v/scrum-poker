import { DataSource } from "typeorm";
import { getOrmConfig } from "./orm.config";

const datasource = new DataSource(getOrmConfig(true)); 
datasource.initialize();
export default datasource;
