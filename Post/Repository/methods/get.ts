import { IPost } from "Post";
import { db as _db } from "lib/db";

export async function get(id:number,{db}={db:_db}): Promise<IPost|null> {
	
	const post = await db.post.findUnique({ where: { id } });
	if (post === null) {console.warn("post not found")};
	return post;
};
