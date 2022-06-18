import type {
	ActionFunction,
	LoaderFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { UserSessionService } from 'User';

export const action: ActionFunction = async ({
	request,
}) => {
	return UserSessionService.logout(request);
};

export const loader: LoaderFunction = async () => {
	return redirect("/");
};
