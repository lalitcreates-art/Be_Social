import { User } from "./models/User.js";
import { Post } from "./models/Post.js";
import { Conversation } from "./models/Conversation.js";
import { Message } from "./models/Message.js";

export async function seedInitialData() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const [lalit, anika, rishi] = await User.create([
    {
      name: "Lalit Mohan",
      email: "lalit@example.com",
      password: "password123",
      bio: "Building Be Social one sprint at a time.",
      headline: "Founder"
    },
    {
      name: "Anika Rao",
      email: "anika@example.com",
      password: "password123",
      bio: "Designing calm, expressive product experiences.",
      headline: "Product Designer"
    },
    {
      name: "Rishi Sen",
      email: "rishi@example.com",
      password: "password123",
      bio: "Frontend engineer shipping polished interactions.",
      headline: "Frontend Engineer"
    }
  ]);

  await Post.create([
    {
      author: anika._id,
      content: "Be Social is where creators, friends, and communities meet with less noise and more intention."
    },
    {
      author: rishi._id,
      content: "Rebuilding the feed for mobile-first scrolling today. Android ergonomics matter."
    },
    {
      author: lalit._id,
      content: "First production-ready Be Social milestone: auth, uploads, messaging, and MongoDB."
    }
  ]);

  const conversation = await Conversation.create({
    members: [lalit._id, anika._id],
    lastMessage: "Ready to review the Android-first feed?"
  });

  await Message.create([
    {
      conversation: conversation._id,
      sender: anika._id,
      text: "Ready to review the Android-first feed?"
    },
    {
      conversation: conversation._id,
      sender: lalit._id,
      text: "Yes. I want it to feel great one-handed on smaller screens."
    }
  ]);
}
