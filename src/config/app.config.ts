export const appConfig = () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  database: {
    connectionString: process.env.CONNECTION_STRING || 'localhost',
    synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
    autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
  },
  mailHost: process.env.MAIL_HOST,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
  smtpPort: process.env.SMTP_PORT,
  
});
//instructor said to only use process.env in config module files, in the rest of app, should use config service
