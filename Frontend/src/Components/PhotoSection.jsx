import { useState } from "react"
import axios from "axios";

function PhotoSection({ currentUser }) {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        setLoading(true);
        const selectedImage = e.target.files[0];
        if (!selectedImage) {
            setError("Invalid Image!");
            return;
        }
        
        // Check if file size exceeds 1MB
        if (selectedImage.size > 1048576) {
            setError("File size must be less than or equal to 1MB!");
            setLoading(false);
            return;
        }

        setError(""); // clear any previous error

        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "testing");


        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_KEY}/image/upload`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            const imageUrl = data.secure_url;
            // console.log(imageUrl);
            const imageObj = {
                avatarUrl: imageUrl,
            };

            //for saving in Database 
            try {
                await axios.put(`/api/users/update/${currentUser.userid}`,
                    imageObj,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                )
                setLoading(false);
                setTimeout(() => {
                    location.reload();
                }, 1000);

            } catch (error) {
                console.error("cloudinary error:", error);
            }


        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    return (
        <div className="flex justify-center items-center flex-col">
            <div className="relative">
                <label htmlFor="attachment">
                    <i className="hover:scale-110 cursor-pointer editing-box absolute bottom-6 right-0 text-[#000] bg-[#ffff] w-7 h-7 rounded-full text-xl text-center content-center bx bxs-edit"></i>
                    <input
                        type="file"
                        id="attachment"
                        name="attachment"
                        accept="image/*"
                        disabled={loading}
                        onChange={handleUpload}
                        className="hidden" />
                </label>
                {loading && <div className="absolute left-9 top-14.5 animate-spin rounded-full h-12 w-12 border-b-5 border-secondary">+</div>}
                
                <div className="sm:w-30 sm:h-30 w-23 h-23 rounded-full my-6 overflow-hidden flex justify-center items-center">
                    <img src={currentUser.avatar ? currentUser.avatar : "https://res.cloudinary.com/dxlliybl6/image/upload/v1754137890/nophoto_ezov6r.png"} alt="" />
                </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    )
}

export default PhotoSection
