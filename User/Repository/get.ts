import type { IUser } from "User";
import { db } from "lib/db";

export default async function get(id:number): Promise<IUser> {
	const user =  await getById(id);
	return user;
};

async function getById(id: number) {
	const user = await db.user.findUnique({ where: { id } });
	if (user === null) throw new Error("user not found");
	return user;
}
// function getByEmail(email: string) {
// 	return db.user.findUnique({ where: { email } });
// }
