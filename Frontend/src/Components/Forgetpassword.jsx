import { useState } from "react";
import showToast from "../utils/toastify"

function Forgetpassword() {
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // For opening/closing Modal
  const toggleOpenModal = () => {
    setOpenModal(!openModal);
    // Reset states when modal closes
    if (openModal) {
      setError("");
      setEmail("");
    }
  };

  // Handle Submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic email validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await fetch(`/api/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.errors.common.msg || "Failed to send reset link");
      } else {
        // Success - show message to user
        showToast({
          text: "Password reset link sent to your email",
          duration: 5000,
          position: "center",
        });
      }
      setEmail(""); // Clear the email field

    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute">
      <div
        className="text-secondary hover:text-hoverSecondary transition-color duration-300 ease-in-out cursor-pointer"
        onClick={toggleOpenModal}
      >
        Forgot Password?
      </div>
      <div className={`wrapper fixed left-0 right-0 top-0 bottom-0 z-100 transition-all duration-300 ease-in-out backdrop-blur-md ${openModal ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        <div className="modal-box relative w-[325px] mx-auto top-[30%] md:top-[25%] transform translate-y-1/2 sm:mx-0 sm:left-[60%] md:left-[58%] lg:left-[54%] border-3 border-secondary rounded-2xl bg-background z-99">
          <button
            className="rounded-full w-[24px] h-[24px] bg-secondary text-background text-[2rem] absolute -right-[8px] -top-[8px] cursor-pointer flex justify-center items-center no-underline rotate-45 hover:bg-primary hover:scale-95"
            onClick={toggleOpenModal}
          >
            +
          </button>
          <div className="px-5 py-5">
            <div className="text-xl font-semibold mb-5">Reset Password</div>
            <div className="">
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="text-start px-1 mb-1 text-gray-700">Your Email</div>
                  <input
                    className="bg-middleColor rounded-lg px-5 py-2 text-[#000000] focus:outline-none focus:placeholder-transparent w-full border-2 border-secondary/50 focus:border-secondary hover:border-secondary"
                    placeholder="name@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="text-start px-2 text-sm mx-auto w-65 h-5 my-1">
                  {error && <div className="text-red-500">{error}</div>}
                </div>
                <button
                  type="submit"
                  className="bg-secondary px-5 py-2 rounded-xl text-[#ffffff] cursor-pointer font-semibold hover:bg-[#ffffff] hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgetpassword;