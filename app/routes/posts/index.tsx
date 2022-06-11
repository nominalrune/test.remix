import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { Post } from "@prisma/client";

import { db } from "~/utils/server/db.server";

type LoaderData = { randomPost: Post; };

export const loader: LoaderFunction = async () => {
	const count = await db.post.count();
	const randomRowNumber = Math.floor(Math.random() * count);
	const [randomPost] = await db.post.findMany({
		take: 1,
		skip: randomRowNumber,
	});
	const data: LoaderData = { randomPost };
	return json(data);
};
export default function PostsIndexRoute() {
	const data = useLoaderData<LoaderData>();
	return (
		<div>
			<p>Here's a random joke:</p>
			<p>{data.randomPost.content}</p>
			<Link to={data.randomPost.id.toString()}>
				"{data.randomPost.name}" Permalink
			</Link>
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
