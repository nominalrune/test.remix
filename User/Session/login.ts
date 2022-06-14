import {crypt} from "lib/crypt";
import { Controller as Ctrl } from "User/Controller";
type Submitted = {
	password: string;
	email: string;
};

export async function login({
	password,
	email
}: Submitted) {
	const user = await Ctrl.get(email);
	const isCorrectPassword = user.passwordHash===crypt(password);
	if (!isCorrectPassword) return null;
	return { id: user.id, username: user.username, email: user.email };
}
