import * as dotenv from "dotenv";
import { UserEntity } from "src/user/entities/user.entity";
import { type DataSourceOptions, DataSource } from "typeorm";

dotenv.config();
export const dataSourceOptions: DataSourceOptions = {
  database: process.env.DB_DATABASE,
  entities: [`${__dirname}/../**/*.entity.js`],
  extra: {
    charset: "utf8mb4_unicode_ci",
  },
  host: process.env.DB_HOST,
  logging: false,
  migrations: [`${__dirname}/../database/migrations/*.js`],
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? "", 10),
  synchronize: false,
  timezone: process.env.DB_TIMEZONE,
  type: "mysql",
  username: process.env.DB_USERNAME,
};

export const dataSourceJest: DataSourceOptions = {
  database: ":memory:",
  entities: [UserEntity],
  synchronize: true,
  type: "sqlite",
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
