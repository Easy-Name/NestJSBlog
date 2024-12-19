import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/posts.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 96, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 96, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 96, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 96, nullable: true })
  @Exclude() //from ClassSerializerInterceptor
  password?: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude() //from ClassSerializerInterceptor
  googleId?: string;

  @OneToMany(() => Post, (posts) => posts.author)
  posts?: Post[];
}
