import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.withCredentials = true;

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setErrors] = useState(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/api/auth/check');
            if (response.data.isAuthenticated) {
                setCurrentUser(response.data.user);
            }
        } catch (error) {
            // Silently handle 401 errors (user not logged in)
            if (error.response && error.response.status === 401) {
                setCurrentUser(null);
            } else {
                // Log other unexpected errors
                console.error('Auth check error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    //signup function 
    async function signup(data) {
        try {
            //Setting for bangladeshi phone number
            data.mobile = "+88" + data.mobile;
            const response = await fetch(`/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                if (result.errors?.name) {
                    throw new Error(result.errors.name.msg || "Failed to sign up");
                }
                if (result.errors?.mobile) {
                    throw new Error(result.errors.mobile.msg || "Failed to sign up");
                }
                if (result.errors?.email) {
                    throw new Error(result.errors.email.msg || "Failed to sign up");
                }
                if (result.errors?.password) {
                    throw new Error(result.errors.password.msg || "Failed to sign up");
                }
                throw new Error(result.message || "Failed to sign up");
            }

            // Check auth status after successful signup
            await checkAuthStatus();
            return result;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    }

    // login function
    async function login(data) {
        try {
            const phoneRegex = /^01[0-9]{9}$/;

            if (phoneRegex.test(data.username)) {
                data.username = "+88" + data.username;
            }

            const response = await fetch(`/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.errors.common.msg);
            }

            // Check auth status after successful login
            await checkAuthStatus();
            return result;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // logout function
    async function logout() {
        try {
            const response = await fetch(`/api/logout`, {
                method: "DELETE",
                credentials: 'include'
            });
            // const result = await response.json();
            // console.log(result)
            setCurrentUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear user even if logout request fails
            setCurrentUser(null);
        }
    }

    const value = {
        currentUser,
        signup,
        login,
        logout,
        loading,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}