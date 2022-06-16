import { IUser } from "User";
// import get from "./get";
import {db as _db} from "lib/db";

export async function update(id:number, altValue:Partial<Omit<IUser,"id">>,{db}={db:_db as typeof _db}): Promise<IUser> {
	// const user =  await get(id); TODO 反映をチェックできるようにする
	const updatedUser = await db.user.update({where:{id},data:{...altValue}});
	return updatedUser;
};
