"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useAppSelector} from "@/store/hooks";

type ChatMessage = {
  id: string;
  roomId: string;
  senderId: string;
  senderRole: "customer" | "customerSupportManager" | string;
  message: string;
  createdAt: string;
};

const CHAT_SERVICE_URL = process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || "http://localhost:3006";
const DEMO_ROOM_ID = "support-room-1";

export default function ChatPage() {
  const authUser = useAppSelector((s) => s.auth.user);
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const [role, setRole] = useState<"customer" | "customerSupportManager">("customer");

  const senderId = useMemo(() => authUser?.id || "demo-customer", [authUser?.id]);

  useEffect(() => {
    const socket = io(CHAT_SERVICE_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join_room", {roomId: DEMO_ROOM_ID, userId: senderId, role});
    });

    socket.on("disconnect", () => setConnected(false));
    socket.on("room_history", (history: ChatMessage[]) => setMessages(history));
    socket.on("chat_message", (incoming: ChatMessage) => {
      setMessages((prev) => [...prev, incoming]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [role, senderId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    socketRef.current?.emit("chat_message", {
      roomId: DEMO_ROOM_ID,
      senderId,
      senderRole: role,
      message: value,
    });
    setText("");
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Customer Chat</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Live chat via Socket.IO between customer and customerSupportManager. Status: {connected ? "Connected" : "Disconnected"}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Send as:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "customer" | "customerSupportManager")}
          className="rounded-md border bg-background px-2 py-1 text-sm"
        >
          <option value="customer">Customer</option>
          <option value="customerSupportManager">Customer Support Manager</option>
        </select>
      </div>

      <section className="mt-6 rounded-xl border bg-card">
        <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.senderRole === "customer" ? "ml-auto bg-indigo-600 text-white" : "bg-muted text-foreground"}`}>
              <p>{m.message}</p>
              <p className={`mt-1 text-[11px] ${m.senderRole === "customer" ? "text-indigo-100" : "text-muted-foreground"}`}>
                {new Date(m.createdAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2 border-t p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border px-3 py-2 text-sm outline-none"
          />
          <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Send
          </button>
        </form>
      </section>
    </main>
  );
}
