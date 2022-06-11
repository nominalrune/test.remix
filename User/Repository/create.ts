import {db} from "lib/db"
import crypt from "lib/crypt";

type createParam = {
	username: string,
	password: string;
	email: string;
};

export default async function create({
	username,
	password,
	email
}: createParam) {
	const passwordHash = crypt(password);
	const user = await db.user.create({
		data: { email, username, passwordHash },
	});
	return { id: user.id, username: user.username, email: user.email};
}
