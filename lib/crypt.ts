import bcrypt from "bcrypt";
export function crypt(target:string|Buffer, rounds=7) {
	return bcrypt.hashSync(target, rounds);
};
