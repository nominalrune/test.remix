import type {
	LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Link,
	Outlet,
	useLoaderData,
} from "@remix-run/react";

import { db } from "lib/db";
import {PostRepository as PR} from "Post"
import { UserSessionService as USS } from "User";


type LoaderData = {
	user: Awaited<ReturnType<typeof USS.get>>;
	postListItems: Array<{ id: number; title: string; }>;
};

export const loader: LoaderFunction = async ({ request }) => {
	const user = await USS.get(request);
	console.log("@posts.tsx, loader, user:",user);
	const postListItems = await PR.where({limit:10,parameter:["id","title"],whereQuery:{authorId:user?.id}})||[];

	const data: LoaderData = {
		postListItems,
		user,
	};
	return json(data);
};

export default function PostsRoute() {
	const data = useLoaderData<LoaderData>();

	console.log("@posts.tsx, PostRoute, data:",data);
	return (
		<div className="jokes-layout">
			<header className="jokes-header">
				<div className="container">
					<span className="logo">Posts</span>
					{data.user ? (
						<div className="user-info">
							<span>{`Hi ${data.user.username}`}</span>
							<form action="/logout" method="post">
								<button type="submit" className="button">
									Logout
								</button>
							</form>
						</div>
					) : (
						<Link to="/login">Login</Link>
					)}
				</div>
			</header>
			<main className="jokes-main">
				<div className="container">
					<div className="jokes-list">
						<p>Here are a few more posts to check out:</p>
						<ul>
							{data.user ?data.postListItems.map((post) => (
								<li key={post.id}>
									<Link to={post.id.toString()}>{post.title}</Link>
								</li>
							)): (
								<Link to="/login">Login</Link>
							)}
						</ul>
						<Link to="new" className="button">
							<button>add new</button>
						</Link>
						<Link to=".">Get a random joke</Link>
					</div>
					<div className="jokes-outlet">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
}
