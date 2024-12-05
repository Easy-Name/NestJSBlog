import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  connectionString: process.env.CONNECTION_STRING || 'localhost',
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
}));
