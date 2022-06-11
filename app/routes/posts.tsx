import type {
	LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Link,
	Outlet,
	useLoaderData,
} from "@remix-run/react";

import { db } from "~/utils/server/db.server";

import { getUser } from "~/utils/server/session.server";


type LoaderData = {
	user: Awaited<ReturnType<typeof getUser>>;
	postListItems: Array<{ id: number; name: string; }>;
};

export const loader: LoaderFunction = async ({ request }) => {
	const postListItems = await db.post.findMany({
		take: 5,
		orderBy: { createdAt: "desc" },
		select: { id: true, name: true },
	});
	const user = await getUser(request);

	const data: LoaderData = {
		postListItems,
		user,
	};
	return json(data);
};

export default function PostsRoute() {
	const data = useLoaderData<LoaderData>();

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
							{data.postListItems.map((post) => (
								<li key={post.id}>
									<Link to={post.id.toString()}>{post.name}</Link>
								</li>
							))}
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
