import PhotoSection from "../PhotoSection"
import { useAuth } from "../../contexts/AuthContext";
import Box from "../Box";
import { Helmet } from "@dr.pogodin/react-helmet";


function Profile() {
    const { currentUser } = useAuth();

    return (
        <>
            <Helmet>
                <title>User Profile - MyChat</title>
            </Helmet>
            <div className="w-full flex flex-col items-center bg-background text-black transition-colors duration-1800 rounded-2xl md:rounded-none">
                <div className="h-30 text-center content-center text-2xl">Hi, {currentUser.username}</div>
                <div className="flex-1 flex flex-col sm:w-[80%] w-[90%] my-5">
                    <span className="text-2xl font-bold  mb-3 flex items-center">
                        <i className="bx bxs-user"></i>
                        <span>Edit Profile</span>
                    </span>
                    <div className="sm:px-6 px-3 rounded-xl bg-tableNth transition-colors duration-1800 min-h-100 h-[85%] overflow-hidden overflow-y-auto">
                        <PhotoSection currentUser={currentUser} />
                        <Box fieldName="Username" fieldText={currentUser.username} />
                        <div className="border-3 transition-colors duration-1800 px-[5px] inline-block rounded-lg mb-5 mt-[-4px] font-semibold text-secondary select-none"><i className="bx bxs-pen"></i>{currentUser.role}</div>
                        <Box fieldName="Email address" fieldText={currentUser.email} />
                        <Box fieldName="Mobile number" fieldText={currentUser.phoneNumber} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
