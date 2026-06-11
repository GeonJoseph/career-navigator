export const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
        await fetch("http://127.0.0.1:8000/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken })
        });
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("profile_completed");
    localStorage.removeItem("careerResults");
    localStorage.removeItem("userRole");

    window.location.href = "/login";
};