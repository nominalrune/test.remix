import bcrypt from "bcrypt";
const salts = <string[]>[];
export function crypt(target:string|Buffer, rounds=7) {
	if(!salts?.[rounds]) {
		salts[rounds] = bcrypt.genSaltSync(rounds);
	}
	return bcrypt.hashSync(target, salts[rounds]);
};
export function compare(plain:string|Buffer, hash:string) {
	return bcrypt.compareSync(plain, hash);
}
