import {db as _db} from "lib/db"
import {crypt} from "lib/crypt";

import type {IUser} from "User";

type createParam = {
	username: string,
	password: string;
	email: string;
};

/**
 * It creates a new user in the database and returns a User object
 * @param {createParam}  `{username: string, password: string, email: string}`
 * @returns A new User object
 */
export async function create({
	username,
	password,
	email
}: createParam,{db}={db:_db}): Promise<IUser> {
	const passwordHash = crypt(password);
	const user = await db.user.create({
		data: { email, username, passwordHash },
	});
	if(user === null) throw new Error("user not created");
	return user;
}
