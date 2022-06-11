interface IUser {
	id: number;
	username: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
}

class User implements IUser {
	#id?: number;
	#username: string;
	#createdAt?: Date;
	#updatedAt?: Date;
	#email: string;
	constructor(arg: {
		username: string,
		email: string,
		id?: number;
		createdAt?: Date,
		updatedAt?: Date,
	}) {
		this.#username = arg.username;
		this.#email = arg.email;
		this.#id = arg.id;
		this.#createdAt = arg.createdAt;
		this.#updatedAt = arg.updatedAt;
	}
	get id(): number {
		if(this.#id===undefined) throw new Error("id is undefined");
		return this.#id;
	}
	get username(): string {
		return this.#username;
	}
	get email(): string {
		return this.#email;
	}
	get createdAt(): Date {
		if(this.#createdAt===undefined) throw new Error("createdAt is undefined");
		return this.#createdAt;
	}
	get updatedAt(): Date {
		if(this.#updatedAt===undefined) throw new Error("updatedAt is undefined");
		return this.#updatedAt;
	}
}

export  type { IUser };
export { User };
