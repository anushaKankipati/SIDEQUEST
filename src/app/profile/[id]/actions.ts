// src/app/profile/[id]/actions.ts
import prisma from "@/libs/prismadb";

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      Quest: {
        select: {
          id: true,
          title: true,
          price: true,
          category: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      certifications: true,
    },
  });
  if (!user) return null;
  return {
    ...user,
    createdAt: new Date(user.createdAt.toISOString()),
    updatedAt: new Date(user.updatedAt.toISOString()),
  };
}
