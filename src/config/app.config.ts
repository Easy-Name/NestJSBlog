export const appConfig = () => ({
  environment: process.env.NODE_ENV || 'production',
  database: {
    connectionString: process.env.CONNECTION_STRING || 'localhost',
    synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
    autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
  },
});

//instructor said to only use process.env in config module files, in the rest of app, should use config service