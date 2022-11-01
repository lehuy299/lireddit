import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return Post.find();
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg('id') id: number,
    ): Promise<Post | null> {
        return Post.findOneBy({ _id: id});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string,
    ): Promise<Post> {
        return Post.create({ title }).save();
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOneBy({ _id: id});
        
        if (!post) {
            return null;
        }
        if (typeof title !== 'undefined') {
            await Post.update({ _id: id }, { title })
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number,
    ): Promise<boolean> {
        await Post.delete(id);
        return true;
    }
}