import type {
	LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Link,
	Outlet,
	useLoaderData,
} from "@remix-run/react";
import {useState} from "react";

import {PostRepository as PR} from "Post"
import { UserSessionService as USS } from "User";

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

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
	const [anchorEl, setAnchorEl] = useState(null);

	console.log("@posts.tsx, PostRoute, data:",data);
	return (
		<div>
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
