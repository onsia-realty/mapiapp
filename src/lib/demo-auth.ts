"use client";

import { useSyncExternalStore } from "react";

export type DemoRole = "broker" | "sales" | "general";

export interface DemoAccount {
  role: DemoRole;
  email: string;
  password: string;
  name: string;
  roleLabel: string;
  company: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "broker",
    email: "jooong@google.com",
    password: "1",
    name: "김중개",
    roleLabel: "공인중개사",
    company: "마피공인중개사사무소",
  },
  {
    role: "sales",
    email: "bys@google.com",
    password: "1",
    name: "박분양",
    roleLabel: "분양사",
    company: "온시아 분양사업부",
  },
  {
    role: "general",
    email: "test@mapi.com",
    password: "1",
    name: "마피회원",
    roleLabel: "일반회원",
    company: "개인회원",
  },
];

export const DEMO_SESSION_KEY = "mapi-demo-session";

export function findDemoAccount(email: string, password: string) {
  return DEMO_ACCOUNTS.find(
    (account) => account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password,
  );
}

export function readDemoSession(): DemoAccount | null {
  if (typeof window === "undefined") return null;

  try {
    const role = window.localStorage.getItem(DEMO_SESSION_KEY) as DemoRole | null;
    return DEMO_ACCOUNTS.find((account) => account.role === role) ?? null;
  } catch {
    return null;
  }
}

export function saveDemoSession(role: DemoRole) {
  window.localStorage.setItem(DEMO_SESSION_KEY, role);
  window.dispatchEvent(new Event("mapi-demo-auth"));
}

export function clearDemoSession() {
  window.localStorage.removeItem(DEMO_SESSION_KEY);
  window.dispatchEvent(new Event("mapi-demo-auth"));
}

function subscribeDemoSession(callback: () => void) {
  window.addEventListener("mapi-demo-auth", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("mapi-demo-auth", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useDemoSession() {
  return useSyncExternalStore(subscribeDemoSession, readDemoSession, () => null);
}
