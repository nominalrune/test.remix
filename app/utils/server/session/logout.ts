import {
	redirect,
} from "@remix-run/node";
import {getUserSession,storage}from "./session";

export async function logout(request: Request) {
	const session = await getUserSession(request);
	return redirect("/login", {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
}
