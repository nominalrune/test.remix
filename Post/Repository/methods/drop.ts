import { db as _db } from "lib/db";
import {IPost} from "Post";

export async function drop(id: number, {db}={db:_db as typeof _db}): Promise<IPost> {
	return await db.post.delete({ where: { id: id } });
};
