import Table from "../Table"
import useUsers from "../../hooks/useUsers"
import { Helmet } from "@dr.pogodin/react-helmet";

function Users() {
  const { loading, error, users, handleRemoveUser } = useUsers();

  if (loading) {
    return (
      <>
        <Helmet>
          <title>List of Users - MyChat</title>
        </Helmet>
        <div className='bg-background rounded-2xl md:rounded-l-none md:rounded-r-2xl w-full h-full transition-all duration-1800 px-6 md:px-10 py-1 shadow-2xl md:shadow-none'>
          <h1 className='text-2xl font-bold mx-auto text-black transition-all duration-1800 text-center my-8 select-none'>Manage Users</h1>
          <div className="text-center py-8 text-black">Loading users...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>List of Users - MyChat</title>
        </Helmet>
        <div className='bg-background rounded-2xl md:rounded-l-none md:rounded-r-2xl w-full h-full transition-all duration-1800 px-6 md:px-10 py-1 shadow-2xl md:shadow-none'>
          <h1 className='text-2xl font-bold mx-auto text-black transition-all duration-1800 text-center my-8 select-none'>Manage Users</h1>
          <div className="text-center py-8 text-red-500">Error loading users!</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>List of Users - MyChat</title>
      </Helmet>
      <div className='bg-background rounded-2xl md:rounded-l-none md:rounded-r-2xl w-full h-full transition-all duration-1800 px-6 md:px-10 py-1 shadow-2xl md:shadow-none flex flex-col'>
        <h1 className='text-2xl font-bold mx-auto text-black transition-all duration-1800 text-center my-8 select-none'>Manage Users</h1>
        {users.length === 0 ? (
          <div className="text-center py-8 flex-1 content-center text-black">No users found!</div>
        ) : (
          <Table userArray={users} handleRemoveUser={handleRemoveUser} />
        )}
      </div>
    </>
  )
}

export default Users
