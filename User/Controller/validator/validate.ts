export function validateEmail(email: unknown) {
	if (typeof email !== "string" || email.length < 3) {
		return `emails must be at least 3 characters long`;
	}
}

export function validatePassword(password: unknown) {
	if (typeof password !== "string" || password.length < 6) {
		return `Passwords must be at least 6 characters long`;
	}
}
function validateUrl(url: any) {
	console.log(url);
	let urls = ["/posts", "/"];
	if (urls.includes(url)) {
		return url;
	}
	return "/posts";
}
