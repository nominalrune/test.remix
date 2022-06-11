import bcrypt from "bcrypt";
export default function crypt(target:string|Buffer, rounds=7) {
	return bcrypt.hashSync(target, rounds);
};
