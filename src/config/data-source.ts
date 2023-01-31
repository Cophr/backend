import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: "",
  port: 3306,
  username: "",
  password: "",
  database: "",
  entities: [__dirname + "/../**/*.entity.js"],
  extra: {
    charset: "utf8mb4_unicode_ci",
  },
  synchronize: false,
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
