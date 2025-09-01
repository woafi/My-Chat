import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import showToast from "../utils/toastify"

function Table({ userArray = [], handleRemoveUser }) {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  //Remove User
  async function removeUser(userId) {
    if (confirm("Are you sure you want to remove the user?")) {
      try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: 'include',
      })

      let result = await response.json();

      if (result.errors) {
        // deleteErrorToast
        showToast({
          text: "Could not delete the user!",
          duration: 3000,
        });
      } else {
        await handleRemoveUser(userId);
        // deleteToast
        showToast({
          text: "User was deleted successfully!",
          duration: 3000,
        });
      }

    } catch (error) {
      console.log(error);
    }
    }
  }

  return (
    <div className="flex-1">
      <div className="max-h-[65dvh] sm:max-h-[70dvh] overflow-y-auto overflow-x-hidden rounded-lg">
        <table className="table-fixed select-none w-full text-black transition-all duration-[1800ms] border-collapse">
          <thead className="bg-secondary transition-all duration-1800 sticky top-0 z-10">
            <tr>
              <th className="userName py-[12px] text-start pl-4">Name</th>
              <th className="py-[12px] hidden sm:table-cell text-start">Email</th>
              {currentUser.role === "Admin" && <th className="py-[12px] text-center">Manage</th>}
            </tr>
          </thead>
          <tbody>
            {userArray.map((user, index) => (
              <tr
                key={user._id || index}
                className="hover:scale-[1.01] [&:last-of-type]:border-b-[2px] [&:last-of-type]:border-hoverSecondary [&:nth-of-type(even)]:bg-tableNth"
              >
                <td
                  className="cursor-pointer userName py-[12px] text-start pl-5 flex items-center gap-1"
                  onClick={() => navigate("/inbox")}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center">
                    <img src={user.avatar ? user.avatar : "https://res.cloudinary.com/dxlliybl6/image/upload/v1754137890/nophoto_ezov6r.png"} alt="" />
                  </div>
                  <span>{user.name}</span>
                </td>
                <td className="py-[12px] hidden sm:table-cell text-start">{user.email}</td>
                {currentUser.role === "Admin" && <td className="py-[12px] cursor-pointer">
                  <div className="flex justify-center items-center">
                    <img className="w-7.5 hover:scale-105"
                      src="/images/trash.png"
                      onClick={() => removeUser(user._id)}
                      alt="" />
                  </div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;