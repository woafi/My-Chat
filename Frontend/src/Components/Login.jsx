import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import Forgetpassword from "./Forgetpassword"

//Components
import PasswordInput from './PasswordInput';

function Login() {
  //useState
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //useAuth
  const { login } = useAuth();

  const navigate = useNavigate();


  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      const result = await login(data);
      // Handle successful signup here
      // console.log('login successful:', result.message);
      //redirect
      navigate("/user");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="form-box login" style={{ alignItems: 'center' }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
            Sign in to your account
          </p>

          {/* Email or Phone */}
          <div className="input-box">
            <input
              type="text"
              placeholder="Email or phone number"
              {...register("username", {
                required: "Email or phone number is required",
                minLength: {
                  value: 5,
                  message: "Minimum length is 5 characters",
                },
              })}
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="text-red-500 text-start pl-4 text-[12px] sm:text-base h-5 sm:h-7">
            {errors.username?.message}
          </div>


          {/* Password */}
          <PasswordInput
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
            })}
          />

          <div className="text-red-500 text-start pl-4 text-[12px] sm:text-base h-5 sm:h-7">
            {errors.password?.message}
          </div>


          {/* Remember */}
          <div className="flex justify-between mb-5 pl-2">
            <label
              className='select-none'
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <input
                name="agreement"
                {...register("agreement")}
                className='accent-secondary'
                type="checkbox"
                style={{
                  marginRight: '8px',
                }}
              />
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button disabled={isSubmitting || loading} type="submit" className="btn">
            {loading || isSubmitting ? 'logging in...' : 'Login'}
          </button>
          <div className="w-full h-6.5 error text-red-500 my-1 text-[12px] sm:text-base overflow-hidden">{error}</div>
        </form>
        {/* Forgot Password */}
        <div className="flex justify-end mt-22 sm:mt-26 mb-3">
          <Forgetpassword />
        </div>
      </div>
    </div>
  );
}

export default Login;
