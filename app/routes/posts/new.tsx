import type { ActionFunction } from "@remix-run/node";

import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";

import { requireUserId } from "~/utils/server/session.server";


function validateContent(content: string) {
	if (content.length < 5) {
		return `That is too short`;
	}
}
function validateName(name: string) {
	if (name.length < 1) {
		return `That name is too short`;
	}
}
type ActionData = {
	formError?: string;
	fieldErrors?: {
		name: string | undefined;
		content: string | undefined;
	};
	fields?: {
		name: string;
		content: string;
		authorId:number;
	};
};

const badRequest = (data: ActionData) =>
	json(data, { status: 400 });
export const action: ActionFunction = async ({
	request,
}) => {
	const userId = await requireUserId(request);
	const form = await request.formData();
	const name = form.get("name");
	const content = form.get("content");
	if (
		typeof name !== "string" ||
		typeof content !== "string"
	) {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}
	const fieldErrors = {
		name: validateName(name),
		content: validateContent(content)
	};
	const fields = { name, content, authorId:userId };
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}
	const post = await db.post.create({ data: fields });
	return redirect(`/posts/${post.id}`);
};

export default function NewPostsRoute() {
	const actionData = useActionData<ActionData>();

	return (
		<div>
			<p>Add your own hilarious joke</p>
			<form method="post">
				<div>
					<label>
						Name:{" "}
						<input
							type="text"
							defaultValue={actionData?.fields?.name}
							name="name"
							aria-invalid={
								Boolean(actionData?.fieldErrors?.name) ||
								undefined
							}
							aria-errormessage={
								actionData?.fieldErrors?.name
									? "name-error"
									: undefined
							}
						/>
					</label>
					{actionData?.fieldErrors?.name ? (
						<p
							className="form-validation-error"
							role="alert"
							id="name-error"
						>
							{actionData.fieldErrors.name}
						</p>
					) : null}
				</div>
				<div>
					<label>
						Content:{" "}
						<textarea
							defaultValue={actionData?.fields?.content}
							name="content"
							aria-invalid={
								Boolean(actionData?.fieldErrors?.content) ||
								undefined
							}
							aria-errormessage={
								actionData?.fieldErrors?.content
									? "content-error"
									: undefined
							}
						/>
					</label>
					{actionData?.fieldErrors?.content ? (
						<p
							className="form-validation-error"
							role="alert"
							id="content-error"
						>
							{actionData.fieldErrors.content}
						</p>
					) : null}
				</div>
				<div>
					{actionData?.formError ? (
						<p
							className="form-validation-error"
							role="alert"
						>
							{actionData.formError}
						</p>
					) : null}
					<button type="submit" className="button">
						Add
					</button>
				</div>
			</form>
		</div>
	);
}
export function ErrorBoundary() {
	return (
	  <div className="error-container">
		Something unexpected went wrong. Sorry about that.
	  </div>
	);
  }
