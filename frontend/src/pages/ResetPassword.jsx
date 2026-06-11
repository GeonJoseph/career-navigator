import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        new_password: password,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Password reset successful");
                navigate("/login");
            } else {
                alert(data.detail || "Reset failed");
            }
        } catch (err) {
            alert("Network error");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <form
                onSubmit={handleReset}
                className="bg-slate-900 p-8 rounded-xl w-96"
            >
                <h2 className="text-white text-2xl mb-6">
                    Reset Password
                </h2>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded bg-slate-800 text-white mb-4"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}