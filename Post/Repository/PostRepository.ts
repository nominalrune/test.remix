import { db as _db } from "lib/db";

import {create} from "./methods/create";
import {update} from "./methods/update";
import {drop} from "./methods/drop";
import {get} from "./methods/get";
import {where} from "./methods/where";

export class PostRepository{
	static get=get;
	static create=create;
	static update=update;
	static delete=drop;
	static where=where;
}
