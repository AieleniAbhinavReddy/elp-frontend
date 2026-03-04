import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { apiSendChatMessage } from "../services/api";
import "bootstrap-icons/font/bootstrap-icons.css";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

// --- NEW: Typing Indicator Component (Aggressive Whitespace Removal) ---
const TypingIndicator = () => (
  <div className="typing-indicator">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);
// --- END: Typing Indicator Component ---

const ChatMessage = ({ message, user }) => {
  const isUser = message.sender === "user";
  
  // Typing message
  if (message.typing) {
    return (
      <div className="message-row ai">
        <div className="avatar" title="AI Assistant">
          <i className="bi bi-robot"></i>
        </div>
        <div className="message-content">
          <div className="message-sender">AI Assistant</div>
          <div className="message-bubble">
            <TypingIndicator />
          </div>
        </div>
      </div>
    );
  }
  
  // Regular message
  return (
    <div className={`message-row ${isUser ? "user" : "ai"}`}>
      {!isUser && (
        <div className="avatar" title="AI Assistant">
          <i className="bi bi-robot"></i>
        </div>
      )}
      <div className="message-content">
        <div className="message-sender">
          {isUser ? `You (${user?.firstName})` : "AI Assistant"}
        </div>
        <div className="message-bubble">
          {/* CRITICAL FIX: Ensure no spaces/tabs/newlines exist between <ReactMarkdown> tags */}
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{message.content}</ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <div className="avatar" title="You">
          <i className="bi bi-person-fill"></i>
        </div>
      )}
    </div>
  );
};

const ChatComponent = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        content: `Hello ${
          user?.firstName || "there"
        }! I am your personal AI Learning Assistant. Ask me about your courses or for code examples. Let's learn together!`,
      },
    ]);
  }, [user]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", content: input }; // Add user message and AI typing indicator
    setMessages((prev) => [
      ...prev,
      userMessage,
      { sender: "ai", typing: true },
    ]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("prompt", currentInput);
      const response = await apiSendChatMessage(formData);
      const aiMessage = { sender: "ai", content: response.data }; // Remove typing indicator and add final message
      setMessages((prev) => prev.slice(0, -1).concat(aiMessage));
    } catch (error) {
      console.error("Error sending message:", error);
      // *** START OF REFACTORING CATCH BLOCK CHANGE ***
      const errorMessage = {
        sender: "ai",
        content:
          "Sorry, I'm having trouble connecting to the Groq API. Please check your network connection and API keys in the .env file.",
      };
      // *** END OF REFACTORING CATCH BLOCK CHANGE ***
      setMessages((prev) => prev.slice(0, -1).concat(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h4 className="mb-0">🤖 AI Learning Assistant</h4>
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
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask me anything about your courses..."
            aria-label="Type your message"
          />
          <button
            className="btn btn-primary send-btn"
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
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