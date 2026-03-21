const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("be-social-token");
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  request,
  auth: {
    register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    me: () => request("/auth/me")
  },
  posts: {
    list: () => request("/posts"),
    create: (payload) => request("/posts", { method: "POST", body: JSON.stringify(payload) }),
    remove: (postId) => request(`/posts/${postId}`, { method: "DELETE" }),
    like: (postId) => request(`/posts/${postId}/like`, { method: "POST" }),
    comment: (postId, payload) => request(`/posts/${postId}/comments`, { method: "POST", body: JSON.stringify(payload) })
  },
  uploads: {
    image: (file) => {
      const formData = new FormData();
      formData.append("image", file);
      return request("/uploads/image", { method: "POST", body: formData });
    }
  },
  users: {
    suggestions: () => request("/users/suggestions"),
    updateMe: (payload) => request("/users/me", { method: "PUT", body: JSON.stringify(payload) }),
    getById: (userId) => request(`/users/${userId}`)
  },
  messages: {
    conversations: () => request("/messages/conversations"),
    createConversation: (payload) => request("/messages/conversations", { method: "POST", body: JSON.stringify(payload) }),
    list: (conversationId) => request(`/messages/conversations/${conversationId}/messages`),
    send: (conversationId, payload) => request(`/messages/conversations/${conversationId}/messages`, { method: "POST", body: JSON.stringify(payload) })
  }
};
