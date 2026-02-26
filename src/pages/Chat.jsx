import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am your career guidance assistant.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const navigate = useNavigate();


    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const currentInput = input;
        setInput('');

        const userMessage = {
            id: Date.now(),
            text: currentInput,
            sender: 'user'
        };

        const loadingId = Date.now() + 1;

        const loadingMessage = {
            id: loadingId,
            text: "Generating response...",
            sender: 'bot',
            loading: true
        };

        // Add user + loading together
        setMessages(prev => [...prev, userMessage, loadingMessage]);

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message: currentInput })
            });

            if (response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
                return;
            }

            const data = await response.json();

            // Remove loading message
            setMessages(prev =>
                prev.filter(msg => msg.id !== loadingId)
            );

            // Save to localStorage
            localStorage.setItem(
                "careerResults",
                JSON.stringify(data.recommendations)
            );

            // Navigate to results page
            navigate("/results");

        } catch (error) {
            console.error(error);

            setMessages(prev =>
                prev.map(msg =>
                    msg.loading
                        ? {
                            id: Date.now() + 2,
                            text: "Error generating response.",
                            sender: 'bot'
                        }
                        : msg
                )
            );
        }
    };




    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Bot className="text-blue-600" /> Career Assistant
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start max-w-[80%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-2 rounded-full ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-slate-600" />}
                            </div>
                            <div className={`p-3 rounded-lg ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    />
                    <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
