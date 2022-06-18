import {
	useParams,
	useResolvedPath
} from "@remix-run/react";
import { json } from "@remix-run/node";

import {Post, PostController as PC} from "Post"
import type {IPost}from "Post";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

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
		<Card elevation={4}>
			<CardContent>
				<h1>{data.post.title}</h1>
				<p>{data.post.content}</p>
				</CardContent>
				<CardActions>
        <IconButton size="small" >
			<FavoriteIcon/>
			</IconButton>
		<IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
		</Card>
	);
}
export function ErrorBoundary() {
	const { postId } = useParams();
	return (
		<div className="error-container">{`There was an error loading post by the id ${postId}. Sorry.`}</div>
	);
}
