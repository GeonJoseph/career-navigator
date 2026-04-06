export function getUserId() {
  let userId = localStorage.getItem("chat_user_id");

  if (!userId) {
    userId = "user_" + Math.random().toString(36).substring(2);
    localStorage.setItem("chat_user_id", userId);
  }

  return userId;
}