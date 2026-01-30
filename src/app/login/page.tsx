"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState("ADMIN");
  const [email, setEmail] = useState("");

  return (
    <div className="auth-page">
      <section className="auth-card">
        <header>
          <span className="inline-tag">Welcome Back</span>
          <h1>Login to Control Console</h1>
          <p>Select your role and continue.</p>
        </header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const displayName = email.split("@")[0] || "User";
            login({
              name: displayName,
              role: role as "ADMIN" | "OPERATOR" | "CONTRACTOR",
            });
            router.push("/live-map");
          }}
        >
          <label>
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Role</span>
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="ADMIN">Admin</option>
              <option value="OPERATOR">Operator</option>
              <option value="CONTRACTOR">Contractor</option>
            </select>
          </label>
          <label>
            <span>Password</span>
            <input type="password" placeholder="••••••••" required />
          </label>

          <button className="primary-btn" type="submit">
            Login
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link href="/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
}
