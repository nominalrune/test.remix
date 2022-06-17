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

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

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


  const handleMenu = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

	console.log("@posts.tsx, PostRoute, data:",data);
	return (
		<div>
					<Box sx={{ flexGrow: 1 }}>
      
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photos
          </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    </Box>
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
