import type {
	ActionFunction,
} from "@remix-run/node";

import {
	UserSessionService as USS,
	UserController as UC
} from "User";
import { json } from "@remix-run/node";
import {
	useActionData,
	Link,
	useSearchParams,
} from "@remix-run/react";




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
		username: string | undefined;
	};
	fields?: {
		loginType: string;
		password: string;
		email: string;
		username: string;
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
		console.log("Form not submitted correctly")
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fields = { loginType, password, email ,username};
	const fieldErrors = {
		password:password&&'',// password: validatePassword(password),
		email:email&&'',// email: validateEmail(email)
		username:username&&''
	};
	if (Object.values(fieldErrors).some(Boolean)){
		console.log("field error")
		return badRequest({ fieldErrors, fields });}

	switch (loginType) {
		case "login": {
			const user = await USS.login({ password, email, redirectTo });
			console.log({ user });
			if (!user||!user?.id) {
				return badRequest({
					fields,
					formError: `something is incorrect in login try @login.tsx`,
				});
			}
			return USS.create(user.id, redirectTo);
		}
		case "register": {
			const userExists = await UC.get(email);
			if (userExists) {
				return badRequest({
					fields,
					formError: `User with email ${email} already exists`,
				});
			}
			const user = await UC.create({username,email,password})
			console.log({ user });
			if (!user||!user?.id) {
				return badRequest({
					fields,
					formError: `Email/Password combination is incorrect`,
				});
			}
			return USS.create(user.id, redirectTo);
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
