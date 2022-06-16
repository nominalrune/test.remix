import { IPost } from "Post";
import { db as _db } from "lib/db";
import { Post } from "@prisma/client";
import type { Prisma } from "@prisma/client";
type ParamType={
	limit?:number,
	parameter:Readonly<Partial<(keyof Post)>[]>,
	whereQuery?:Prisma.PostWhereInput,
}
declare class Object {
	static fromEntries<K extends string,V>(entries: [K,V][]):{ [k in K] : V };
};
type Select=Prisma.PostSelect;
export async function where({limit,parameter,whereQuery}:ParamType ={limit:100,parameter:["id"],whereQuery:{}},db=_db ) {
	if(parameter.length==0){return};
	const post = await db.post.findMany({ take:limit,select:Object.fromEntries(parameter.map(item=>[item,true])),where:whereQuery });
	if (post === null || post.length === 0) {console.warn("post not found")};
	return post;
};
