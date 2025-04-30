import Sidebar from "@/src/components/sidebar/Sidebar";
import getUsers from "../actions/getUsers";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return(
  <Sidebar>
    <div className="h-screen">
      <UserList items={users}/>
      {children}
    </div>;
  </Sidebar>);
}
