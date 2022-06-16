import { db as _db } from "lib/db";

import { create } from "./methods/create";
import { update } from "./methods/update";
import { drop } from "./methods/drop";
import { get, getByEmail } from "./methods/get";

export class UserRepository{
	static get=get;
	static getByEmail=getByEmail;
	/**
	 * It creates a new user in the database and returns a User object
	 * @param {createParam} `{username: string, password: string, email: string}`
	 * @returns A new User object
	 * @throws {Error} If the email is already taken or any unexpected error occurs.
	 */
	static create=create;
	static update=update;
	static delete=drop;
};
