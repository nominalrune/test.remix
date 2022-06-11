import {
	useParams,
	useResolvedPath
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { db } from "~/utils/server/db.server";


import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { Post } from "@prisma/client";


type LoaderData = { post: Post; };

export const loader: LoaderFunction = async ({ params }) => {
	if (!params.postId) throw new Error("postId not found");
	const post = await db.post.findUnique({
		where: { id: parseInt(params.postId) },
	});
	if (!post) throw new Error("post not found");
	const data: LoaderData = { post };
	return json(data);
};

export default function PostRoute() {
	const data = useLoaderData<LoaderData>();

	return (
		<div>
			<p>Here's your hilarious post:</p>
			<p>
				<p>{data.post.content}</p>
				<Link to=".">{data.post.name} Permalink</Link>
			</p>
		</div>
	);
}
export function ErrorBoundary() {
	const { postId } = useParams();
	return (
		<div className="error-container">{`There was an error loading post by the id ${postId}. Sorry.`}</div>
	);
}
