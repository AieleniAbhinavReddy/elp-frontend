import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiSendChatMessage } from '../services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

// --- START: Import new libraries ---
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
// --- END: Import new libraries ---


const ChatMessage = ({ message, user }) => {
    const isUser = message.sender === 'user';
    
    if (message.typing) {
        return (
            <div className="message-row ai">
                <div className="avatar" title="AI Assistant"><i className="bi bi-robot"></i></div>
                <div className="message-content">
                    <div className="message-sender">AI Assistant</div>
                    <div className="message-bubble">
                        {/* You can add a CSS typing indicator here if you have one */}
                        ...
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`message-row ${isUser ? 'user' : 'ai'}`}>
            {!isUser && (
                <div className="avatar" title="AI Assistant"><i className="bi bi-robot"></i></div>
            )}
            <div className="message-content">
                <div className="message-sender">
                    {isUser ? `You (${user?.firstName})` : 'AI Assistant'}
                </div>
                <div className="message-bubble">
                    {/* --- THIS IS THE FIX --- */}
                    {/* We now use ReactMarkdown to render the content. */}
                    {/* It will automatically find and format code blocks. */}
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {message.content}
                    </ReactMarkdown>
                </div>
            </div>
            {isUser && (
                <div className="avatar" title="You"><i className="bi bi-person-fill"></i></div>
            )}
        </div>
    );
};

const ChatComponent = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        setMessages([{
            sender: 'ai',
            content: `Hello ${user?.firstName || 'there'}! I am your personal AI Learning Assistant. You can ask me for code examples, and I will format them for you.`
        }]);
    }, [user]);

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { sender: 'user', content: input };
        setMessages(prev => [...prev, userMessage, { sender: 'ai', typing: true }]);
        
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('prompt', currentInput);
            const response = await apiSendChatMessage(formData);
            const aiMessage = { sender: 'ai', content: response.data };
            setMessages(prev => prev.slice(0, -1).concat(aiMessage));
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { sender: 'ai', content: "Sorry, I'm having trouble connecting. Please check your connection and try again." };
            setMessages(prev => prev.slice(0, -1).concat(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h4 className="mb-0">AI Learning Assistant</h4>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <ChatMessage message={msg} user={user} key={index} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <div className="input-group">
                    <input
    type="text"
    className="form-control form-control-lg"
    value={input}
    disabled={loading}
    // FIX: Changed e.targe to e.target
    onChange={(e) => setInput(e.target.value)}
    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
    placeholder="Ask me anything about your courses..."
    aria-label="Type your message"
/>
                    <button className="btn btn-primary" onClick={handleSendMessage} disabled={loading} style={{borderRadius: '50px'}}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            <i className="bi bi-send-fill"></i>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;