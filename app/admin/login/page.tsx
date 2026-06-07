"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="border p-8 rounded-xl w-96"
      >
        <h1 className="text-2xl font-bold mb-6">
          Admin Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white w-full py-2 rounded"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}