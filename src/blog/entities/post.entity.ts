import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { User } from '@pietro/auth'; // Import the User entity from the correct path
import { PostCategory } from './category.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    author: User;

    @ManyToMany(() => PostCategory, category => category.posts)
    @JoinTable({ name: 'post_categories' })
    categories: PostCategory[];
}