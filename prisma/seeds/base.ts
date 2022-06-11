import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
	const takeo = await createUser({name:"takeo",pass:"taketake",email:"takeo@dot.com"})
	await Promise.all(
		getPosts().map((post) => {
			const data={authorId:takeo.id, ...post}
			return db.post.create({ data });
		})
	);
}

seed();
async function createUser(param: { name: string, pass: string, email:string }) {
	return db.user.create({
		data: {
			username: param.name,
			passwordHash:
				bcrypt.hashSync(param.pass, 7),
			email:param.email
		},
	});
}
function getPosts() {
	return [
		{
			name: "Road worker",
			content: `aaaaaaaam`,
		},
		{
			name: "Frisbee",
			content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
		},
		{
			name: "Trees",
			content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
		},
		{
			name: "Skeletons",
			content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
		},
		{
			name: "Hippos",
			content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
		},
		{
			name: "Dinner",
			content: `What did one plate say to the other plate? Dinner is on me!`,
		},
		{
			name: "Elevator",
			content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
		},
	];
}
