import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { getUserId } from "../utils/userId";

function extractCareerFromText(text) {
  if (!text) return "Unknown Career";

  const match = text.match(/^(.*?) looks like/i);
  if (match && match[1]) return match[1].trim();

  return text.split("\n")[0];
}

const Chat = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
      const id = getUserId();
      setUserId(id);
    }, []);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const navigate = useNavigate();

    // 🔥 ADD THIS RIGHT BELOW
    const startNewChat = () => {
      localStorage.removeItem("chatMessages");
      localStorage.removeItem("user_id");

      // Optional: also clear results
      localStorage.removeItem("careerResults");

      window.location.reload();
    };
    
    useEffect(() => {
      const savedMessages = localStorage.getItem("chatMessages");

      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch {
          localStorage.removeItem("chatMessages");
        }
      } else {
        const initial = [
          {
            id: 1,
            text: "Hi! 👋 Tell me about your interests and I’ll help you find the right career path.",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          }
        ];

        setMessages(initial);
        localStorage.setItem("chatMessages", JSON.stringify(initial));
      }
    }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        if (!userId) return;

        const currentInput = input;
        setInput('');

        const userMessage = {
            id: Date.now(),
            text: currentInput,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    message: currentInput
                })
            });

            if (response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
                return;
            }

            const data = await response.json();
            setIsTyping(false);


            // ✅ SAFE TEXT EXTRACTION
            const botText =
              typeof data === "string"
                ? data
                : typeof data?.response === "string"
                ? data.response
                : typeof data?.response?.response === "string"
                ? data.response.response
                : "Let's continue.";

            // ✅ FINAL DETECTION (FIXED)
            // 🔥 HANDLE BOTH RESPONSE FORMATS
            const finalData = data?.final_result || data?.response?.final_result;

            const responseText =
              typeof data?.response === "string"
                ? data.response
                : data?.response?.response || botText;

            // ✅ FINAL DETECTION (ROBUST)
            const isFinal = !!finalData;

            // ✅ CAREER NAME (SAFE)
            const careerName =
              finalData?.name || extractCareerFromText(responseText);

            const botMessage = {
                id: Date.now(),
                text: botText,
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };


            // ✅ UPDATE UI FIRST
            if (isFinal) {
              setIsTyping(false); // 🔥 ADD THIS

              localStorage.setItem(
                "careerResults",
                JSON.stringify([careerName])
              );

              navigate("/results");
              return;
            }

            // Only show message if NOT final
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error(error);
            setIsTyping(false);

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now(),
                    text: "I encountered an error. Please try again.",
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }
            ]);
        }
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-140px)] glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>

            {/* HEADER */}
            <div className="relative z-10 px-8 py-6 border-b border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-between">

              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl">
                  <Bot className="text-white w-6 h-6" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Career AI <Sparkles size={16} className="inline text-yellow-400" />
                  </h2>
                </div>
              </div>

              {/* 🔥 NEW BUTTON */}
              <button
                onClick={startNewChat}
                className="px-4 py-2 text-sm bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl hover:bg-red-500/30 transition"
              >
                New Chat
              </button>

            </div>

            {/* CHAT */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[70%]">
                            <div className="px-5 py-4 rounded-3xl text-sm bg-white/10 text-white">
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && <div className="text-slate-400">Typing...</div>}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-8">
                <form onSubmit={handleSend} className="flex">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your career path..."
                        className="flex-1 px-6 py-4 bg-white/5 text-white rounded-full"
                    />
                    <button type="submit" className="ml-3 p-4 bg-blue-600 rounded-full">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;