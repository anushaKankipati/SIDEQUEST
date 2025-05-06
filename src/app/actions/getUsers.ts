import prisma from "@/libs/prismadb"

import getSession from "./getSession"

export default async function getUsers() {
  const session = await getSession(); 
  if (!session?.user?.email) {
    return []; 
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc"
      }, 
      where: { // all but yourself
        NOT: { 
          email: session.user.email
        }
      }
    }); 
    const activeUsers = users.filter((user) => user.activeStatus); // filter out inactive users
    return activeUsers.sort((a, b) => {
      // Calculate completeness score for each user
      const getScore = (user: any) => {
        let score = 0;
        if (user.about) score += 2;
        if (user.skills && user.skills.length > 0) score += user.skills.length;
        return score;
      };

      const scoreA = getScore(a);
      const scoreB = getScore(b);

      // Sort by score in descending order
      return scoreB - scoreA;
    }); 
  } catch(error: any) {
    return []; 
  }

}