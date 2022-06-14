import { IPost } from "Post";
import { db as _db } from "lib/db";
import { Post, Prisma } from "@prisma/client";
type ParamType={
	limit?:number,
	parameter:Readonly<Partial<(keyof Post)>[]>,
	whereQuery?:object,
}
declare class Object {
	static fromEntries<K extends string,V>(entries: [K,V][]):{ [k in K] : V };
};

export async function where({limit,parameter,whereQuery}:ParamType ={limit:100,parameter:["id"],whereQuery:{}},db=_db ) {
	if(parameter.length==0){return};
	const post = await db.post.findMany({ take:limit,select:Object.fromEntries(parameter.map(item=>[item,true])),where:whereQuery });
	if (post === null || post.length === 0) throw new Error("post not found");
	return post;
};
