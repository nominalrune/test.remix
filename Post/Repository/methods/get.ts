import { IPost } from "Post";
import { db as _db } from "lib/db";

export async function get(id:number,{db}={db:_db}): Promise<IPost> {
	
	const post = await db.post.findUnique({ where: { id } });
	if (post === null) throw new Error("post not found");
	return post;
};
