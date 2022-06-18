import type {IUser} from "User";
import {Repository} from "User/Repository";

export class UserController {
	static repository=Repository;
	/**
	 * It creates a user with the given username, email, and password
	 * @param {string} username - string - The username of the user
	 * @param {string} email - string - This is the email of the user.
	 * @param {string} password - string - The password that the user will use to login.
	 * @returns The user object
	 */
	static async create({username, email, password}:{username: string, email: string, password: string}): Promise<IUser> {
		const user = await UserController.repository.create({ username, email, password });
		return user;
	}
	/**
	 * "If the idOrEmail parameter is a number, then get the user by its's id,
	 *  otherwise if it's a string, then get the user by email.
	 * 
	 * @param {number|string} idOrEmail - The id or emailaddress of the user we want to get.
	 * @returns {Promise<IUser>} The user object
	 */
	static async get(idOrEmail: number|string): Promise<IUser|null> {
		if(typeof idOrEmail === "number") {
		return await UserController.repository.get(idOrEmail);
		} else if(typeof idOrEmail === "string") {
		return await UserController.repository.getByEmail(idOrEmail);
		} else {
		throw new Error("Invalid user id/email");
		}
	}
	
	/**
	 * It takes an id and an altValue, and returns a Promise of an IUser
	 * @param {number} id - The id of the user you want to update
	 * @param altValue - Partial<Omit<IUser, "id">>
	 * @returns The user that was updated.
	 */
	static async update(id: number, altValue: Partial<Omit<IUser, "id">>): Promise<IUser> {
		const user = await UserController.repository.update(id, altValue);
		return user;
	}
}
