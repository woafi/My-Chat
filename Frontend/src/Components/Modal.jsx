import "../Styles/modal.css";
import useConversion from "../hooks/useConversion";
import { useEffect, useRef, useState } from "react";


function modal() {
    const [users, setUsers] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [tooltip, setTooltip] = useState(false);


    const { handleCreateConversation } = useConversion();

    const modal = useRef(null);
    const users_placeholder = useRef(null);
    const input = useRef(null);
    const errorplaceholder = useRef(null);
    const tooltipRef = useRef();

    useEffect(() => {
        // typing detector
        let typingTimer;
        const doneTypingInterval = 500;

        //on keyup, start the countdown
        input.current.addEventListener("keyup", function () {
            clearTimeout(typingTimer);
            // reset
            users_placeholder.current.style.display = "none";
            errorplaceholder.current.style.visibility = "hidden";

            if (input.current.value) {
                typingTimer = setTimeout(searchUsers, doneTypingInterval); //user is "finished typing," send search request
            }
        });

        //on keydown, clear the countdown
        input.current.addEventListener("keydown", function () {
            clearTimeout(typingTimer);
        });
    }, [])

    //For opening/closing Modal
    const toggleOpenModal = () => {
        setOpenModal(!openModal);
        input.current.value = "";
        users_placeholder.current.style.display = "none";
    };

    //for toggleTooltip
    function toggleTooltip() {
        if (tooltip) {
            setTooltip(false);
            tooltipRef.current.style.display = "none";
        } else {
            setTooltip(true);
            tooltipRef.current.style.display = "block";
        }
    }

    // send request for search
    async function searchUsers() {
        let response = await fetch(`/api/inbox/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({
                user: input.current.value
            }),
        })

        // get response
        let result = await response.json();

        if (result.errors) {
            errorplaceholder.current.textContent = result.errors.common.msg;
            errorplaceholder.current.style.visibility = "visible";
            setUsers([]);
        } else {
            setUsers(result);
            errorplaceholder.current.style.visibility = "hidden";
            users_placeholder.current.style.display = "block";
        }
    }

    //create Conversation
    async function createConversation(participant_id, name, avatar) {
        const result = await handleCreateConversation(participant_id, name, avatar);

        if (!result.errors) {
            // reset
            users_placeholder.current.style.display = "none";
            input.current.value = name;
            // reload the page after 1 second
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            console.log(result.errors.common.msg);
        }
    }

    return (
        <div>
            <div className="flex justify-center sm:justify-start relative">
                <div ref={tooltipRef} className="hidden absolute bg-indigo-100
                top-[-15px] z-99 left-[-5px] px-1 rounded-lg sm:text-wrap text-nowrap tooltip">
                    Add People
                </div>
                <button onClick={toggleOpenModal}
                    className="w-12 h-12 rounded-full text-center content-center m-4 cursor-pointer text-background bg-secondary text-3xl hover:scale-105"
                    onMouseOver={toggleTooltip}
                    onMouseOut={toggleTooltip}
                >
                    +
                </button>
            </div>
            <div ref={modal} className={` modal-wrapper transition-all duration-300 ease-in-out ${openModal ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                <div className={`modal`}>
                    <a onClick={toggleOpenModal} className="modal-close">+</a>
                    <div className="modal-title">
                        <h2 >Create New Conversation</h2>
                    </div>
                    <div className="modal-body">
                        <form id="add-conversation-form">
                            <input
                                type="text"
                                placeholder="search user by name or email or mobile"
                                name="user"
                                id="user"
                                autoComplete="off"
                                ref={input}

                            />
                            <p ref={errorplaceholder} className="error invisible">error</p>
                            <div className="search_users" ref={users_placeholder}>
                                <ul>
                                    {users.map((user, index) => (
                                        <li
                                            key={user._id}
                                            onClick={() => createConversation(user._id, user.name, user.avatar)}
                                        >
                                            <div className="user">
                                                <div className="overflow-hidden w-[24px] h-[24px] rounded-full bg-secondary">
                                                    <img src={user.avatar ? user.avatar : "https://res.cloudinary.com/dxlliybl6/image/upload/v1754137890/nophoto_ezov6r.png"} alt="" />
                                                </div>
                                                <div className="username">{user.name}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <input type="submit" value="Submit" className="hidden" />
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default modal
