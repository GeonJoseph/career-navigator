import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am an AI assistant. How can I help you regarding your career?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = { id: Date.now() + 1, text: "As an AI model, I can provide information and assistance based on my training data. How else may I assist you?", sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
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
            </div>

            <div className="p-4 border-t border-slate-100">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about resume tips, interview prep..."
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
