import bcrypt from "bcrypt";
import { db } from "../db.server";
type LoginForm = {
	password: string;
	email: string;
};

export async function login({
	password,
	email
}: LoginForm) {
	const user = await db.user.findUnique({
		where: { email },
	});
	if (!user) return null;

	const isCorrectPassword = await bcrypt.compare(
		password,
		user.passwordHash
	);
	if (!isCorrectPassword) return null;

	return { id: user.id, username: user.username, email: user.email };
}
