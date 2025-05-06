
import getUsers from "@/src/app/actions/getUsers"
import UserCard from "@/src/components/UserCard"

export default async function Users() {
  const users = await getUsers()

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
  )
}
