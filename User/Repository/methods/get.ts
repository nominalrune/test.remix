import { IUser } from "User";
import { db as _db } from "lib/db";

export async function get(id:number,{db}={db:_db}): Promise<IUser|null> {
	const user =  await getById(id,{db});
	return user;
};

async function getById(id: number,{db}:{db:typeof _db}) {
	const user = await db.user.findUnique({ where: { id } });
	// if (user === null) throw new Error(`user (id:${id}) not found`);
	return user;
}
export async function getByEmail(email: string,{db}={db: _db}) {
	const user = await db.user.findUnique({ where: { email } });
	// if (user === null) throw new Error("user not found");
	return user;
}
