import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const navigate = useNavigate();

    useEffect(() => {
        const initChat = async () => {
            const token = localStorage.getItem("access_token");
            let greeting = "Hello! I am your career guidance assistant.";
            
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const name = data.first_name || data.name || "friend";
                    const target = data.target_title ? ` your goal to become a ${data.target_title}` : "your career path";
                    greeting = `Hi ${name}! ✨ I'm ready to help you with ${target}. Let's start by discussing your background. How can I assist you today?`;
                }
            } catch (e) { console.error(e); }
            
            setMessages([{ id: 1, text: greeting, sender: 'bot', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        };
        initChat();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const currentInput = input;
        setInput('');

        const userMessage = {
            id: Date.now(),
            text: currentInput,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const loadingId = Date.now() + 1;
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

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
            setIsTyping(false);

            const botMessage = {
                id: Date.now() + 5,
                text: data.response || "I've analyzed your input. Let's look at the results.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMessage]);

            if (data.recommendations) {
                localStorage.setItem("careerResults", JSON.stringify(data.recommendations));
                setTimeout(() => navigate("/results"), 2000);
            }

        } catch (error) {
            console.error(error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 2,
                text: "I encountered an error. Please try again.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-140px)] glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Ambient Backglows */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>

            {/* Header */}
            <div className="relative z-10 px-8 py-6 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                        <Bot className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                            Career AI <Sparkles size={16} className="text-yellow-400" />
                        </h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Assistant</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="relative z-10 flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-message-in`} style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className={`flex items-end max-w-[85%] md:max-w-[70%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300 backdrop-blur-md border border-white/10'
                            }`}>
                                {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className={`px-5 py-4 rounded-3xl chat-bubble-shadow text-sm leading-relaxed ${
                                    msg.sender === 'user' 
                                        ? 'user-gradient text-white rounded-br-none font-medium' 
                                        : 'bot-gradient text-slate-100 backdrop-blur-md border border-white/10 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className={`text-[10px] font-bold tracking-wider text-slate-500 uppercase px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.timestamp}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start animate-message-in">
                        <div className="flex items-end gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                                <Bot size={20} className="text-slate-300" />
                            </div>
                            <div className="px-5 py-4 rounded-3xl bot-gradient backdrop-blur-md border border-white/10 rounded-bl-none flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="relative z-10 p-8 pt-0">
                <div className="relative group">
                    <form onSubmit={handleSend} className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your career path..."
                            className="w-full pl-6 pr-20 py-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:bg-white/10 shadow-inner group-focus-within:border-white/20"
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim()}
                            className="absolute right-3 p-3.5 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-blue-600/20 group-hover:rotate-12"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                    <div className="absolute -bottom-6 left-6 flex gap-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Shift + Enter for New Line</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
