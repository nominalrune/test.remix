export function validateUserName(username: string): string {
	if (/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
		return username;
	} else {
		throw new Error("username is invalid");
	}
};
