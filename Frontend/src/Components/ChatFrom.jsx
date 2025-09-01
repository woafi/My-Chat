function ChatFrom({chatFrom, message, handleInputChange, handleOnSubmit, fileSend}) {

  return (
        <form onSubmit={handleOnSubmit} ref={chatFrom} className="invisible h-[80px] w-full border-gray-500/40 border-t flex justify-between items-center px-2 sm:px-6">
          <label htmlFor="attachment" className="hover:scale-110 cursor-pointer">
            <img src="/images/attachment.png" alt="attachment" />
            <input type="file" id="attachment" name="attachment" className="hidden" accept="image/*" />
          </label>
          <input 
            className="w-full mr-2 rounded-xl py-2 px-3 focus:outline-secondary hover:border-secondary border-2 border-secondary/40 hover:border-2 bg-middleColor shadow-sm" 
            type="text" 
            name="message"
            value={message}
            onChange={handleInputChange}
            placeholder="Message"
            autoComplete="off"
          />
          <button 
            type="submit" 
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300
              ${message.trim() ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}
            disabled={!message.trim()}
          >
            Send
          </button>
        </form>
  )
}

export default ChatFrom
