import UserSearch from "@/src/components/UserSearch"
import getUsers from "@/src/app/actions/getUsers"

export default async function Users() {
  const users = await getUsers();

  return (
    <div className="fixed inset-0 top-16">
      <div className="h-full">
        {/* Main content area - independently scrollable */}
        <div className="h-full overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <UserSearch initialUsers={users} />
          </div>
        </div>
      </div>
    </div>
  )
}
 