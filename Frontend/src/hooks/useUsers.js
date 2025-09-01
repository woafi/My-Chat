import { useEffect, useState } from "react";

export default function useUsers() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch(`/api/users`);
                const result = await response.json();
                const Users = result.users;
                if (Users) {
                    setUsers(Users);
                } else {
                    setUsers("No user is found!")
                }
            } catch (error) {
                console.log(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const handleRemoveUser = (userId) => {
        setUsers(prev => prev.filter(user => user._id !== userId));
    };

    return {
        loading,
        error,
        users,
        handleRemoveUser
    };
}