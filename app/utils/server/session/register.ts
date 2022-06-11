import bcrypt from "bcrypt";
import { db } from "../db.server";
type RegisterForm = {
	username: string,
	password: string;
	email: string;
};
export async function register({
	username,
	password,
	email
  }: RegisterForm) {
	const passwordHash = bcrypt.hashSync(password, 7);
	const user = await db.user.create({
	  data: { email,username, passwordHash },
	});
	return { id: user.id, username,email };
  }
