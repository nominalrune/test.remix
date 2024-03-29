import { PrismaClient } from "@prisma/client";
import singleton from "util/singleton";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if(!prisma){
	prisma = new PrismaClient();
}
}

export { prisma };
