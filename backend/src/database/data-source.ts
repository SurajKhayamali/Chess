import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import serverConfig from '../config';

// type DatabaseType =
//   | 'mysql'
//   | 'mariadb'
//   | 'postgres'
//   | 'cockroachdb'
//   | 'sqlite'
//   | 'mssql'
//   | 'sap'
//   | 'oracle'
//   | 'cordova'
//   | 'nativescript'
//   | 'react-native'
//   | 'sqljs'
//   | 'mongodb'
//   | 'aurora-mysql'
//   | 'aurora-postgres'
//   | 'expo'
//   | 'better-sqlite3'
//   | 'capacitor'
//   | 'spanner';

const { database, isProduction } = serverConfig;
const { type, host, port, user, password, database: databaseName } = database;

export const AppDataSource = new DataSource({
  type: type,
  host: host,
  port: port,
  username: user,
  password: password,
  database: databaseName,
  synchronize: !isProduction,
  logging: !isProduction,
  entities: [User],
  subscribers: [],
  migrations: [],
} as DataSourceOptions);

// // to initialize the initial connection with the database, register all entities
// // and "synchronize" database schema, call "initialize()" method of a newly created database
// // once in your application bootstrap
// AppDataSource.initialize()
//   .then(() => {
//     // here you can start to work with your database
//     console.log('datasource initialized successfully');
//   })
//   .catch((error) => console.log(error));

export const initializeDatabase = async () => {
  await AppDataSource.initialize();
};
