import {db as _db} from "lib/db"

import type {IPost} from "Post";

type createParam = {
	title:string,
	content:string,
	authorId:number
};

/**
 * It creates a new user in the database and returns a User object
 * @param {createParam}  `{username: string, password: string, email: string}`
 * @returns A new User object
 */
export async function create({
	title,
content,
authorId
}: createParam,{db}={db:_db}): Promise<IPost> {
	const post = await db.post.create({
		data: {title,
			content,
			authorId },
	});
	if(post === null) {console.warn("post not created")};
	return post;
}
