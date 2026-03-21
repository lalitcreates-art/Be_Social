import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";

const namesToRemove = ["Anika Rao", "Rishi Sen", "Test User", "Lalit", "Lalit Mohan"];
const namesToKeep = new Set(["Lalit_Phone", "Lalit_Laptop", "Advika"]);

async function cleanupUsers() {
  await connectDb();

  const users = await User.find({
    name: { $in: namesToRemove.filter((name) => !namesToKeep.has(name)) }
  }).select("_id name");

  if (!users.length) {
    console.log("No matching users found. Nothing to remove.");
    return;
  }

  const userIds = users.map((user) => user._id);
  const conversationIds = await Conversation.find({ members: { $in: userIds } }).distinct("_id");

  await Message.deleteMany({
    $or: [{ sender: { $in: userIds } }, { conversation: { $in: conversationIds } }]
  });

  await Conversation.deleteMany({ _id: { $in: conversationIds } });
  await Post.deleteMany({ author: { $in: userIds } });

  await Post.updateMany(
    {},
    {
      $pull: {
        likes: { $in: userIds },
        comments: { author: { $in: userIds } }
      }
    }
  );

  await User.updateMany(
    {},
    {
      $pull: {
        followers: { $in: userIds },
        following: { $in: userIds }
      }
    }
  );

  await User.deleteMany({ _id: { $in: userIds } });

  console.log(`Removed users: ${users.map((user) => user.name).join(", ")}`);
}

cleanupUsers()
  .catch((error) => {
    console.error("Failed to clean up users", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
