import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export async function dropDatabase(config: ConfigService): Promise<void> {
  //create connection with datasource
  const AppDataSource = await new DataSource({
    type: 'postgres',
    synchronize: config.get('database.synchronize'),
    url: config.get('database.connectionString'),
  }).initialize();
  //drop all tables

  await AppDataSource.dropDatabase();

  //close the connection

  await AppDataSource.destroy();
}
