import React from 'react'
import { Helmet } from "@dr.pogodin/react-helmet";
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function Notifications() {
    const { notifications, markAllAsRead, markAsRead } = useNotification();
    const navigate = useNavigate();
    return (
        <>
            <Helmet>
                <title>Notifications - MyChat</title>
            </Helmet>
            <div className='bg-background rounded-2xl md:rounded-l-none md:rounded-r-2xl w-full h-full transition-all duration-1800 px-6 md:px-10 py-1 shadow-2xl md:shadow-none flex flex-col'>
                <h1 className='text-2xl font-bold mx-auto text-black transition-all duration-1800 text-center my-8 select-none'>Notifications</h1>
                <div className='flex flex-col'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-bold text-black'>New Messages</h2>
                        {notifications.length > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className='text-sm font-bold text-black hover:text-indigo-600 transition-colors duration-300'
                            >
                                Mark All as Read
                            </button>
                        )}
                    </div>
                    
                    {notifications.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-10'>
                            <div className='text-gray-500 text-lg mb-2'>No new notifications</div>
                            <div className='text-gray-400'>You're all caught up!</div>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2'>
                            {notifications.map((notification) => (
                                <div 
                                    key={notification._id} 
                                    className='bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer'
                                    onClick={() => {
                                        markAsRead(notification._id);
                                        navigate('/inbox');
                                    }}
                                >
                                    <div className='flex items-start gap-3'>
                                        <div className='w-10 h-10 rounded-full bg-secondary overflow-hidden flex-shrink-0'>
                                            <img 
                                                src={notification.sender.avatar || "https://res.cloudinary.com/dxlliybl6/image/upload/v1754137890/nophoto_ezov6r.png"} 
                                                alt="" 
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <div className='flex justify-between items-start'>
                                                <h3 className='font-semibold text-black'>{notification.sender.name}</h3>
                                                <span className='text-xs text-gray-500'>{moment(notification.date_time).fromNow()}</span>
                                            </div>
                                            <p className='text-gray-700 text-sm line-clamp-2 mt-1'>
                                                {notification.text}
                                            </p>
                                            {notification.attachment && (
                                                <div className='mt-2'>
                                                    <span className='text-xs text-indigo-600'>📎 Attachment</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Notifications
