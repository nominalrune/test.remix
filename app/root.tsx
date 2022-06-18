import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

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

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "typical web app",
  viewport: "width=device-width,initial-scale=1",
});

function Document({
  children,
  title = `typical web app`,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  
  const data = useLoaderData<LoaderData>();
	const [anchorEl, setAnchorEl] = useState(null);


  const handleMenu = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Document>
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
            account system
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
            <MenuItem><Link to="/login">Login</Link></MenuItem>
					)}
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    </Box>
    
    <Outlet />
    </Document>
  );
}
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document
      title={`${caught.status} ${caught.statusText}`}
    >
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="something went wrong">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
