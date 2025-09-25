import moment from "moment";
import { useState } from "react";
import Searchcontainer from "./Search-container";
import Modal from "./Modal";

function Conversation({ conversion = [], currentUser, handleGetMessage, current_conversation_id }) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter conversations based on participant/creator name
    const filteredConversion = conversion.filter((item) => {
        const isCreator = item.creator?.id === currentUser?.userid;
        const user = isCreator ? item.participant : item.creator;
        return user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className='sm:w-[40%] h-full bg-background rounded-l-2xl md:rounded-none flex flex-col justify-between border-gray-500/40 border-r transition-all duration-1800'>
            <div className="flex flex-col items-center md:items-start">
                <Searchcontainer searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                <div className="scrollbar-hidden flex-1 overflow-y-auto overflow-x-hidden max-h-[66dvh] sm:max-h-[75dvh] w-full">
                    {filteredConversion.map((item) => {
                        const isCreator = item.creator?.id === currentUser?.userid;
                        const user = isCreator ? item.participant : item.creator;
                        const isSelected = current_conversation_id === item._id;

                        return (
                            <div
                                key={item._id}
                                onClick={() => handleGetMessage(item._id, user)}
                                className={`px-2 py-3 flex items-center hover:bg-gray-100 hover:text-[#000000] cursor-pointer transition-all mb-1 ${isSelected ? 'bg-gray-100 text-[#000000]' : 'text-black'} flex flex-col sm:flex-row rounded-lg text-[12px] sm:text-base`}
                            >
                                <div className="rounded-full w-12 h-12 mx-2 bg-secondary overflow-hidden flex justify-center items-center">
                                    <img
                                        src={user.avatar || "https://res.cloudinary.com/dxlliybl6/image/upload/v1754137890/nophoto_ezov6r.png"}
                                        alt={user.name || "User Avatar"}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-col flex">
                                    <span className="font-medium select-none">{user.name}</span>
                                    <span className="text-[12px] text-gray-500 whitespace-nowrap hidden sm:inline w-28">
                                        {moment(item.last_updated).fromNow()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal />
        </div>
    );
}

export default Conversation;
