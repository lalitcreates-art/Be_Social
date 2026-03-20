import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { getSocket } from "../lib/socket.js";

export function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    api.messages.conversations().then((data) => {
      setConversations(data.conversations);
      if (data.conversations[0]) setActive(data.conversations[0]);
    });
  }, []);

  useEffect(() => {
    if (!active) return;
    api.messages.list(active.id).then((data) => setMessages(data.messages));
  }, [active]);

  useEffect(() => {
    const token = localStorage.getItem("be-social-token");
    const socket = getSocket(token);
    if (!socket || !active) return;

    socket.emit("conversation:join", active.id);
    const onMessage = (payload) => {
      if (payload.conversationId === active.id) {
        setMessages((current) => [...current, payload.message]);
      }
    };

    socket.on("message:new", onMessage);
    return () => {
      socket.off("message:new", onMessage);
    };
  }, [active]);

  async function handleSend(event) {
    event.preventDefault();
    if (!active || !text.trim()) return;
    const response = await api.messages.send(active.id, { text });
    setMessages((current) => [...current, response.message]);
    setText("");
  }

  return (
    <section className="messages-layout">
      <aside className="card conversation-list">
        <p className="eyebrow">Chats</p>
        {conversations.map((conversation) => (
          <button key={conversation.id} className="conversation-row" onClick={() => setActive(conversation)}>
            <div className="avatar-shell">{conversation.partner.initials}</div>
            <div>
              <strong>{conversation.partner.name}</strong>
              <p>{conversation.lastMessage || conversation.partner.headline}</p>
            </div>
          </button>
        ))}
      </aside>
      <section className="card message-thread">
        <p className="eyebrow">Conversation</p>
        <h2>{active?.partner.name || "Select a chat"}</h2>
        <div className="message-stack">
          {messages.map((message) => (
            <div key={message.id} className="message-bubble">
              <strong>{message.sender.name}</strong>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <form className="message-form" onSubmit={handleSend}>
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Type a message" />
          <button className="primary-button" type="submit">
            Send
          </button>
        </form>
      </section>
    </section>
  );
}
