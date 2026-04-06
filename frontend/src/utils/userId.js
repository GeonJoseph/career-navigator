export function getUserId() {
  let userId = localStorage.getItem("user_id");

  if (!userId) {
    userId = "user_" + Date.now() + "_" + Math.random();
    localStorage.setItem("user_id", userId);
  }

  return userId;
}