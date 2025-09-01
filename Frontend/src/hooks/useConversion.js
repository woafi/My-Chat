import { useEffect, useState } from "react";
import showToast from "../utils/toastify"

function useConversion() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [conversion, setConversion] = useState([]);

    useEffect(() => {
        //fetch all conversation
        async function fetchConversion() {
            try {
                const response = await fetch(`/api/inbox`, {
                    credentials: 'include',
                });
                const result = await response.json();
                if (result) {
                    setConversion(result);
                } else {
                    setConversion("No user is found!");
                }
            } catch (error) {
                console.log(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchConversion();
    }, []);

    //create Conversation
    async function handleCreateConversation(participant_id, name, avatar) {
        try {
            const response = await fetch(`/api/inbox/conversation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    participant: name,
                    id: participant_id,
                    avatar: avatar != "undefined" ? avatar : null,
                }),
            });

            const result = response.json();
            return result;
        } catch (err) {
            console.log(err);
        }
    }

    //Delete Conversation
    async function deleteConversation(conversationId) {
        try {
            const response = await fetch(`/api/inbox/conversation/${conversationId}`, {
                method: "DELETE",
                credentials: 'include',
            })
            let result = await response.json();

            if (result.errors) {
                showToast({
                    text: "Could not delete the conversation!",
                    duration: 3000,
                });
            } else {
                setConversion(prev => prev.filter(conversation => conversation._id !== conversationId))
                showToast({
                    text: "Conversation was deleted successfully!",
                    duration: 3000,
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    return {
        loading,
        error,
        conversion,
        handleCreateConversation,
        deleteConversation
    };
}

export default useConversion
