const API_URL = "http://localhost:8000/chat";

export async function sendMessage(userId, message) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      message: message,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to get response");
  }

  return await res.json();
}