import prisma from "@/libs/prismadb";
import UserCard from "@/src/components/UserCard";

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        about: true,
        skills: true,
        createdAt: true,
      },
    });

    // Sort users based on profile completeness
    return users.sort((a, b) => {
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
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export default async function Users() {
  const users = await getUsers();

  return (
    <div className="fixed inset-0 top-16">
      <div className="h-full">
        {/* Main content area - independently scrollable */}
        <div className="h-full overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold mb-6">Discover Questers</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}