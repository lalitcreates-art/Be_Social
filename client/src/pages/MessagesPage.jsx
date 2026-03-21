import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { getSocket } from "../lib/socket.js";

export function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [people, setPeople] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    Promise.all([api.messages.conversations(), api.users.suggestions()]).then(([conversationData, peopleData]) => {
      setConversations(conversationData.conversations);
      setPeople(peopleData.users);
      if (conversationData.conversations[0]) setActive(conversationData.conversations[0]);
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
        setMessages((current) => (current.some((item) => item.id === payload.message.id) ? current : [...current, payload.message]));
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
    setMessages((current) => (current.some((item) => item.id === response.message.id) ? current : [...current, response.message]));
    setText("");
  }

  async function startConversation(partnerId) {
    const response = await api.messages.createConversation({ partnerId });
    setConversations((current) => {
      const exists = current.find((item) => item.id === response.conversation.id);
      return exists ? current : [response.conversation, ...current];
    });
    setActive(response.conversation);
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
        <div className="conversation-suggestions">
          <p className="eyebrow">Start a new chat</p>
          {people.map((person) => (
            <button key={person.id} className="conversation-row" onClick={() => startConversation(person.id)}>
              <div className="avatar-shell">{person.initials}</div>
              <div>
                <strong>{person.name}</strong>
                <p>{person.headline}</p>
              </div>
            </button>
          ))}
        </div>
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
