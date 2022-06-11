import {IUser } from "User";
import get from "./get";
import {db} from "lib/db";

export default async function update(id:number, altValue:Partial<Omit<IUser,"id">>): Promise<IUser> {
	const user =  await get(id);
	const updatedUser =db.user.update({where:{id},data:{...altValue}});
	return user;
};
