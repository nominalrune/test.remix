import {db as _db} from "lib/db";
import {IUser} from 'User';
import create from './create';
import get from './get';

class UserRepositoryService {
	#db: typeof _db; // TODO should be framework agonistic-ish... 
	constructor(db=_db) {
		this.#db=db;
	}
	get=get;
	create=create;
	
}
