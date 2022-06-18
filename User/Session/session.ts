import { Repository } from "User/Repository";
import {
	createCookieSessionStorage,
	redirect,
} from "@remix-run/node";

const getSessionSecret = () => {
	const sessionSecret = process.env.SESSION_SECRET;
	if (!sessionSecret) {
		throw new Error("SESSION_SECRET must be set");
	}
	return sessionSecret;
};

export function getUserSession(request: Request) {
	return storage.getSession(request.headers.get("Cookie"));
}
export const storage = createCookieSessionStorage({
	cookie: {
		name: "_session",
		// `secure: true`but that doesn't work on localhost for Safari
		// https://web.dev/when-to-use-local-https/
		secure: process.env.NODE_ENV === "production",
		secrets: [getSessionSecret()],
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
});
export async function getUserId(request: Request) {
	const session = await getUserSession(request);
	const userId = parseInt(session.get("userId"));
	if (!userId || typeof userId !== "number") return null;
	return userId;
}

export async function requireUserId(
	request: Request,
	redirectTo: string = new URL(request.url).pathname
) {
	const session = await getUserSession(request);
	const userId = parseInt(session.get("userId"));
	if (!userId || userId < 0) {
		const searchParams = new URLSearchParams([
			["redirectTo", redirectTo],
		]);
		throw redirect(`/login?${searchParams}`);
	}
	return userId;
}
export async function getUser(request: Request) {
	const userId = await getUserId(request);
	if (typeof userId !== "number") {
		return null;
	}

	const _user = await Repository.get(userId);
	if(!_user) {return null};
	const { id, username } = _user;
	return { id, username };
	//} catch {
	//throw logout(request); // NOTE is this valid? we'd better make `confirmUser` or something like that
	//}
}
export async function createUserSession(
	userId: number,
	redirectTo: string
) {
	const session = await storage.getSession();
	session.set("userId", userId);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await storage.commitSession(session),
		},
	});
}
