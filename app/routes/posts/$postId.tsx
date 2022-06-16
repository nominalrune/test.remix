import {
	useParams,
	useResolvedPath
} from "@remix-run/react";
import { json } from "@remix-run/node";

import {Post, PostController as PC} from "Post"
import type {IPost}from "Post";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";



type LoaderData = { post: IPost; };

export const loader: LoaderFunction = async ({ params }) => {
	if (!params.postId) throw new Error("postId not found");
	const post = await PC.get(parseInt(params.postId) );
	if (!post) throw new Error("post not found");
	console.log({params,post},post.id)
	const data: LoaderData = { post };
	return json(data);
};

export default function PostRoute() {
	const data = useLoaderData<LoaderData>();
	console.log({data},data.post.id);
	return (
		<div>
			<p>Here's your post:</p>
			<p>
				<p>{data.post.content}</p>
				<Link to=".">{data.post.title} Permalink</Link>
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
