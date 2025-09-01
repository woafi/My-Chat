import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

//Components
import PasswordInput from './PasswordInput';

function Register() {
  //useState
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //useAuth
  const { signup } = useAuth();

  const navigate = useNavigate();

  //react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch the password value for comparison
  const password = watch("password");

  //Form Submit - Fixed version
  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      const result = await signup(data);
      // console.log('Signup successful:', result);
      //redirect
      if (result.message) {
        navigate("/user");
      }
    } catch (err) {
      // console.error('Signup error:', err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="form-box register">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className='font-bold w-[100%] whitespace-nowrap sm:my-2'>Create an Account</h1>

          {/* Username */}
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              {...register("name", {
                required: "The field is required",
                minLength: { value: 3, message: "Minimum length is 3" },
                maxLength: { value: 8, message: "Maximum length is 8" },
              })}
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="text-red-500 text-start pl-4 text-[12px] sm:text-base h-4 sm:h-6">
            {errors.name?.message}
          </div>

          {/* Phone Number */}
          <div className="input-box">
            <input
              type="tel"
              placeholder="Phone Number"
              {...register("mobile", {
                required: "Phone number is required",
                pattern: {
                  value: /^01[0-9]{9}$/,
                  message: "Bangladeshi number (e.g. 01XXXXXXXXX)",
                },
              })}
            />
            <i className="bx bxs-phone"></i>
          </div>
          <div className="text-red-500 text-start pl-4 text-[12px] sm:text-base h-4 sm:h-6">
            {errors.mobile?.message}
          </div>

          {/* Email */}
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "The field is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <div className="text-red-500 text-start pl-4 text-[12px] sm:text-base h-4 sm:h-6">
            {errors.email?.message}
          </div>

          {/* Password */}
          <PasswordInput
            placeholder="Password"
            {...register("password", {
              required: "The field is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
          />
            <div className="text-red-500 text-start pl-4 text-[12px] sm:text-base h-4 sm:h-6">
              {errors.password?.message}
            </div>

          {/* Confirm Password */}
          <PasswordInput
            icon="bx bxs-lock-alt"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
            <div className="text-red-500  text-start pl-4 text-[12px] sm:text-base h-4 sm:h-6">
              {errors.confirmPassword?.message}
            </div>

          <button
            disabled={isSubmitting || loading}
            type="submit"
            className="btn text-black mt-1 "
          >
            {loading || isSubmitting ? 'Registering...' : 'Register'}
          </button>
          <div className="error h-5 text-red-500 my-1 text-[12px] sm:text-base">{error}</div>
        </form>
      </div>
    </div>
  );
}

export default Register;