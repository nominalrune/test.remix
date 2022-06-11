import type {
	ActionFunction,
} from "@remix-run/node";

import {
	login,
	register,
	createUserSession
} from "~/utils/server/session.server";
import { json } from "@remix-run/node";
import {
	useActionData,
	Link,
	useSearchParams,
} from "@remix-run/react";

import { db } from "~/utils/server/db.server";


function validateEmail(email: unknown) {
	if (typeof email !== "string" || email.length < 3) {
		return `emails must be at least 3 characters long`;
	}
}

function validatePassword(password: unknown) {
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

type ActionData = {
	formError?: string;
	fieldErrors?: {
		password: string | undefined;
		email: string | undefined;
	};
	fields?: {
		loginType: string;
		password: string;
		email: string;
	};
};

const badRequest = (data: ActionData) =>
	json(data, { status: 400 });

export const action: ActionFunction = async ({
	request,
}) => {
	const form = await request.formData();
	const loginType = form.get("loginType");
	const password = form.get("password");
	const username = form.get("username");
	const email = form.get("email");
	const redirectTo = validateUrl(
		form.get("redirectTo") || "/posts"
	);
	if (
		typeof loginType !== "string" ||
		typeof password !== "string" ||
		typeof email !== "string" ||
		typeof username !== "string" ||
		typeof redirectTo !== "string"
	) {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fields = { loginType, password, email };
	const fieldErrors = {
		password: validatePassword(password),
		email: validateEmail(email)
	};
	if (Object.values(fieldErrors).some(Boolean))
		return badRequest({ fieldErrors, fields });

	switch (loginType) {
		case "login": {
			const user = await login({ password, email });
			console.log({ user });
			if (!user) {
				return badRequest({
					fields,
					formError: `Email/Password combination is incorrect`,
				});
			}
			return createUserSession(user.id, redirectTo);
		}
		case "register": {
			const userExists = await db.user.findFirst({
				where: { email },
			});
			if (userExists) {
				return badRequest({
					fields,
					formError: `User with email ${email} already exists`,
				});
			}
			const user = await register({email,username,password})
			console.log({ user });
			if (!user) {
				return badRequest({
					fields,
					formError: `Email/Password combination is incorrect`,
				});
			}
			return createUserSession(user.id, redirectTo);
		}
		default: {
			return badRequest({
				fields,
				formError: `Login type invalid`,
			});
		}
	}
};

export default function Login() {
	const actionData = useActionData<ActionData>();
	const [searchParams] = useSearchParams();
	return (
		<div className="container">
			<div className="content" data-light="">
				<h1>Login</h1>
				<form method="post">
					<input
						type="hidden"
						name="redirectTo"
						value={
							searchParams.get("redirectTo") ?? undefined
						}
					/>
					<fieldset>
						<legend className="sr-only">
							Login or Register?
						</legend>
						<label>
							<input
								type="radio"
								name="loginType"
								value="login"
								defaultChecked={
									!actionData?.fields?.loginType ||
									actionData?.fields?.loginType === "login"
								}
							/>{" "}
							Login
						</label>
						<label>
							<input
								type="radio"
								name="loginType"
								value="register"
								defaultChecked={
									actionData?.fields?.loginType ===
									"register"
								}
							/>{" "}
							Register
						</label>
					</fieldset>
					<div>
						<label htmlFor="username-input">name</label>
						<input
							type="text"
							id="username-input"
							name="username"
							defaultValue={actionData?.fields?.username}
							aria-invalid={Boolean(
								actionData?.fieldErrors?.username
							)}
							aria-errormessage={
								actionData?.fieldErrors?.username
									? "username-error"
									: undefined
							}
						/>
						{actionData?.fieldErrors?.username ? (
							<p
								className="form-validation-error"
								role="alert"
								id="username-error"
							>
								{actionData.fieldErrors.username}
							</p>
						) : null}
					</div>
					<div>
						<label htmlFor="email-input">email</label>
						<input
							type="text"
							id="email-input"
							name="email"
							defaultValue={actionData?.fields?.email}
							aria-invalid={Boolean(
								actionData?.fieldErrors?.email
							)}
							aria-errormessage={
								actionData?.fieldErrors?.email
									? "email-error"
									: undefined
							}
						/>
						{actionData?.fieldErrors?.email ? (
							<p
								className="form-validation-error"
								role="alert"
								id="email-error"
							>
								{actionData.fieldErrors.email}
							</p>
						) : null}
					</div>
					<div>
						<label htmlFor="password-input">Password</label>
						<input
							id="password-input"
							name="password"
							defaultValue={actionData?.fields?.password}
							type="password"
							aria-invalid={
								Boolean(
									actionData?.fieldErrors?.password
								) || undefined
							}
							aria-errormessage={
								actionData?.fieldErrors?.password
									? "password-error"
									: undefined
							}
						/>
						{actionData?.fieldErrors?.password ? (
							<p
								className="form-validation-error"
								role="alert"
								id="password-error"
							>
								{actionData.fieldErrors.password}
							</p>
						) : null}
					</div>
					<div id="form-error-message">
						{actionData?.formError ? (
							<p
								className="form-validation-error"
								role="alert"
							>
								{actionData.formError}
							</p>
						) : null}
					</div>
					<button type="submit" className="button">
						Submit
					</button>
				</form>
			</div>
			<div className="links">
				<ul>
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/posts">posts</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
