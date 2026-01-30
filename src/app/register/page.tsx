"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [email, setEmail] = useState("");

  return (
    <div className="auth-page">
      <section className="auth-card">
        <header>
          <span className="inline-tag">Create Account</span>
          <h1>Register for Access</h1>
          <p>Set up your role to access the console.</p>
        </header>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!name) return;
            register({ name, role: role as "ADMIN" | "OPERATOR" | "CONTRACTOR" });
            router.push("/live-map");
          }}
        >
          <label>
            <span>Name</span>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
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
          <label>
            <span>Confirm Password</span>
            <input type="password" placeholder="••••••••" required />
          </label>

          <button className="primary-btn" type="submit">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have access? <Link href="/login">Login here</Link>
        </p>
      </section>
    </div>
  );
}
