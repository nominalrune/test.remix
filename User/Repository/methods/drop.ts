import { db as _db } from "lib/db";
import {User} from "User";

export async function drop(id: number, {db}={db:_db as typeof _db}): Promise<IUser> {
	const user = await db.user.delete({ where: { id: id } });
	return new User(user);
};
