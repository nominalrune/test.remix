import { prisma } from "lib/db/prisma";

export default async function deleteUser(id: number, _prisma=prisma) {
	return _prisma.user.delete({ where: { id: id } });
};
