import type {IPost} from "Post";
import {Post} from "Post";
import {Repository} from "Post/Repository";


export class PostController {
	static repository=Repository
	/**
	 * It creates a Post with the given Postname, email, and password
	 * @returns The Post object
	 */
	 static async create(title: string, content:string, authorId:number): Promise<IPost> {
		const post = await PostController.repository.create({ title, content, authorId });
		return new Post(post);
	}

	/**
	 * "Get a post by id, and return it as a Post object."
	 * 
	 * The first line of the function is the function signature. It's a function named get that takes a
	 * single parameter named id, which is a number. The function returns a Promise of type IPost
	 * @param {number} id - number - The id of the post we want to get.
	 * @returns A Post object
	 */
	 static async get(id: number): Promise<IPost> {
		 const post=await PostController.repository.get(id);
		 if(!post){throw new Error("post not found")};
		return post;
	}
	 static async getAllTitle(authorId:number,limit:number=10): Promise<IPost[]> {
		const posts=await PostController.repository.where({limit,parameter:["id","title"],whereQuery:{authorId}});
		if(!posts||posts.length==0){throw new Error("post not found")};
		return posts;
	}
	
	/**
	 * It updates a post with the given id, and returns the updated post
	 * @param {number} id - number - the id of the post to update
	 * @param {number} authorId - the id of the author who is updating the post
	 * @param altValue - Partial<Omit<IPost, "id">>
	 * @returns The updated post
	 */
	 static async update(id: number, authorId:number, altValue: Partial<Omit<IPost, "id">>): Promise<IPost> {
		const post = await PostController.repository.update(id,authorId, altValue);
		return post;
	}
}
