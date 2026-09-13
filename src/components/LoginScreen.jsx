import React, { useState } from "react";
import { Sprout } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function LoginScreen() {
  const [mode, setMode] = useState("signup"); // 'signup' | 'login'
  const [role, setRole] = useState("entrepreneur");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Enter an email and password.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Enter a name to sign up.");
      return;
    }

    setLoading(true);
    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { name: name.trim(), role } },
      });
      if (signUpError) setError(signUpError.message);
    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginError) setError(loginError.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
            <Sprout size={20} className="text-white" />
          </div>
          <span className="font-semibold text-[#1877F2] text-2xl">IdeaFeed</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#DADDE1] p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode("signup")}
              className={`py-2 rounded-md text-sm font-medium border ${mode === "signup" ? "bg-[#1877F2] text-white border-[#1877F2]" : "border-[#DADDE1] text-[#65676B]"}`}
            >
              Sign up
            </button>
            <button
              onClick={() => setMode("login")}
              className={`py-2 rounded-md text-sm font-medium border ${mode === "login" ? "bg-[#1877F2] text-white border-[#1877F2]" : "border-[#DADDE1] text-[#65676B]"}`}
            >
              Log in
            </button>
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-xs text-[#65676B] block mb-1.5">Your name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ada Chukwu"
                className="w-full border border-[#DADDE1] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1877F2]"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-[#65676B] block mb-1.5">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full border border-[#DADDE1] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1877F2]"
            />
          </div>

          <div>
            <label className="text-xs text-[#65676B] block mb-1.5">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="At least 6 characters"
              className="w-full border border-[#DADDE1] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1877F2]"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-xs text-[#65676B] block mb-1.5">I'm here to</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRole("entrepreneur")}
                  className={`py-2.5 rounded-md text-sm font-medium border ${role === "entrepreneur" ? "bg-[#1877F2] text-white border-[#1877F2]" : "border-[#DADDE1] text-[#65676B]"}`}
                >
                  Post an idea
                </button>
                <button
                  onClick={() => setRole("investor")}
                  className={`py-2.5 rounded-md text-sm font-medium border ${role === "investor" ? "bg-[#1877F2] text-white border-[#1877F2]" : "border-[#DADDE1] text-[#65676B]"}`}
                >
                  Fund ideas
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-[#E41E3F]">{error}</p>}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-md"
          >
            {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
          </button>

          {mode === "signup" && (
            <p className="text-xs text-[#65676B] text-center">
              If your project has email confirmation turned on, check your inbox after signing up.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
