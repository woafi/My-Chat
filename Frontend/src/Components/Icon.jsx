//Style
import '../Styles/ilast.css';

function Icon() {
  return (
    <div className="chat-container">
        <div className="pulse-ring"></div>
        
        <div className="chat-bubble bubble-1">
            <div className="glow text-center content-center text-2xl"></div>
            <div className="message-lines">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line line-3"></div>
            </div>
        </div>

        <div className="chat-bubble bubble-2">
            <div className="glow text-center content-center text-3xl font-bold text-primary">MyChat</div>
            <div className="dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    </div>
  )
}

export default Icon
