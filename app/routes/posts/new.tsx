import type { ActionFunction } from "@remix-run/node";

import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { db } from "lib/db";

import { UserSessionService as USS} from "User";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

function validateContent(content: string) {
	if (content.length < 5) {
		return `That is too short`;
	}
}
function validateTitle(title: string) {
	if (title.length < 1) {
		return `That title is too short`;
	}
}
type ActionData = {
	formError?: string;
	fieldErrors?: {
		title: string | undefined;
		content: string | undefined;
	};
	fields?: {
		title: string;
		content: string;
		authorId:number;
	};
};

const badRequest = (data: ActionData) =>
	json(data, { status: 400 });
export const action: ActionFunction = async ({
	request,
}) => {
	const userId = (await USS.get(request))?.id;
	const form = await request.formData();
	const title= form.get("title");
	const content = form.get("content");
	console.log({userId,title,content})
	if (
		typeof title!== "string" ||
		typeof content !== "string" ||
		!userId
	) {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}
	const fieldErrors = {
		title: validateTitle(title),
		content: validateContent(content)
	};
	const fields = { title, content, authorId:userId };
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
						<TextField
							label="Title"
							defaultValue={actionData?.fields?.title}
							name="title"
							helperText={actionData?.fieldErrors?.title}
							aria-invalid={
								Boolean(actionData?.fieldErrors?.title) ||
								undefined
							}
							aria-errormessage={
								actionData?.fieldErrors?.title
									? "title-error"
									: undefined
							}
						/>
					</label>
				</div>
				<div>
					<label>
						<TextField
							multiline
							label="content"
							defaultValue={actionData?.fields?.content}
							helperText={actionData?.fieldErrors?.content}
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
					<Button variant="contained" type="submit" endIcon={<SendIcon/>}>
						Add
					</Button>
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
