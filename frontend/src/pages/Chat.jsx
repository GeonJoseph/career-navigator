import { useState } from "react";
import { sendMessage } from "../services/chatService";
import { getUserId } from "../utils/userId";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = getUserId();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const data = await sendMessage(userId, input);

      const botMessage = {
        role: "bot",
        text: data.response,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error contacting server." },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="h-[80vh] flex flex-col bg-[#0f172a] text-white p-4">

      <h2 className="text-xl font-semibold mb-3">Career Chatbot</h2>

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto border border-gray-700 rounded-lg p-4 space-y-4">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400">Bot is typing...</div>
        )}

      </div>

      {/* INPUT */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>

    </div>
  );
}