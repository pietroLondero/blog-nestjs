import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { User } from '@pietro/auth'; // Import the User entity from the correct path
import { Post } from './post.entity';

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToMany(() => Post, post => post.categories)
  posts: Post[];
}