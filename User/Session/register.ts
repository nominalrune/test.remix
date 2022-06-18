import {Controller as Ctrl} from "User/Controller";
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
	const user = await Ctrl.create({username,email, password});
	return user;
  }
