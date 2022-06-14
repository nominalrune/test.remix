// import type { LoaderFunction } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { useLoaderData, Link } from "@remix-run/react";

import {Post, PostController as PC} from "Post"
import type {IPost}from "Post";


export default function PostsIndexRoute() {
	return (
		<div>
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
