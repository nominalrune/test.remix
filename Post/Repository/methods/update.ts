import { IPost } from "Post";
// import get from "./get";
import {db as _db} from "lib/db";

export async function update(id:number,authorId:number, altValue:Partial<Omit<IPost,"id"|"authorId"|"author">>,{db}={db:_db as typeof _db}): Promise<IPost> {
	// const post =  await get(id); TODO 反映をチェックできるようにする
	const updatedPost = await db.post.update({where:{id},data:{...altValue}});
	return updatedPost;
};
