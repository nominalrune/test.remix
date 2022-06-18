import { login } from "User/Session/login";
import { logout } from "User/Session/logout";
import { register } from "User/Session/register";
import { createUserSession, getUser, requireUserId } from './session';
export class UserSessionService {
	static login=login;
	static logout=logout;
	static register=register;
	static create=createUserSession;
	static get=getUser;
	static needsUserIdToDoThis=requireUserId;
};
