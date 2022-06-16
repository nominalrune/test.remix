import {compare} from "lib/crypt";
import { Controller as Ctrl } from "User/Controller";
import {UserSessionService as USS} from "User";
type Submitted = {
	password: string;
	email: string;
	redirectTo: string;
};

export async function login({
	password,
	email,
	redirectTo="/"
}: Submitted) {
	console.log("@login, email: ", email);
	const user = await Ctrl.get(email);
	console.log("@login, user: ", user);
	if (user === null||!user?.id||!user?.passwordHash) {return null};
	const isCorrectPassword = compare(password, user.passwordHash);
	if (!isCorrectPassword) return null;
	// const session = await USS.create(user.id, redirectTo);
	return { id: user.id, username: user.username, email: user.email };
}
