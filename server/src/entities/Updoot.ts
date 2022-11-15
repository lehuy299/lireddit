import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from "type-graphql";
import { User } from './User';
import { Post } from './Post';

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {

    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    postId: number;

    @ManyToOne(() => User, (user) => user.updoots)
    user: User;

    @ManyToOne(() => Post, (post) => post.updoots)
    post: Post;
}
