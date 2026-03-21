import asyncHandler from "express-async-handler";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

function mapConversation(conversation, currentUserId) {
  const partner = conversation.members.find((member) => member._id.toString() !== currentUserId) || conversation.members[0];
  return {
    id: conversation._id.toString(),
    lastMessage: conversation.lastMessage,
    updatedAt: conversation.updatedAt,
    partner: {
      id: partner._id.toString(),
      name: partner.name,
      headline: partner.headline,
      avatarUrl: partner.avatarUrl,
      initials: partner.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("")
    }
  };
}

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ members: req.user._id })
    .sort({ updatedAt: -1 })
    .populate("members", "name headline avatarUrl");

  res.json({ conversations: conversations.map((item) => mapConversation(item, req.user._id.toString())) });
});

export const createConversation = asyncHandler(async (req, res) => {
  const { partnerId } = req.body;
  const partner = await User.findById(partnerId);
  if (!partner) {
    res.status(404);
    throw new Error("Conversation partner not found");
  }

  let conversation = await Conversation.findOne({
    members: { $all: [req.user._id, partnerId], $size: 2 }
  }).populate("members", "name headline avatarUrl");

  if (!conversation) {
    conversation = await Conversation.create({ members: [req.user._id, partnerId] });
    conversation = await Conversation.findById(conversation._id).populate("members", "name headline avatarUrl");
  }

  res.status(201).json({ conversation: mapConversation(conversation, req.user._id.toString()) });
});

export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation || !conversation.members.some((memberId) => memberId.toString() === req.user._id.toString())) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const messages = await Message.find({ conversation: req.params.conversationId })
    .sort({ createdAt: 1 })
    .populate("sender", "name avatarUrl");

  res.json({
    messages: messages.map((message) => ({
      id: message._id.toString(),
      text: message.text,
      imageUrl: message.imageUrl,
      createdAt: message.createdAt,
      sender: {
        id: message.sender._id.toString(),
        name: message.sender.name,
        avatarUrl: message.sender.avatarUrl,
        initials: message.sender.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("")
      }
    }))
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId);
  if (!conversation || !conversation.members.some((memberId) => memberId.toString() === req.user._id.toString())) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text: req.body.text,
    imageUrl: req.body.imageUrl || ""
  });

  conversation.lastMessage = req.body.text;
  await conversation.save();

  const hydrated = await Message.findById(message._id).populate("sender", "name avatarUrl");
  const payload = {
    id: hydrated._id.toString(),
    text: hydrated.text,
    imageUrl: hydrated.imageUrl,
    createdAt: hydrated.createdAt,
    sender: {
      id: hydrated.sender._id.toString(),
      name: hydrated.sender.name,
      avatarUrl: hydrated.sender.avatarUrl,
      initials: hydrated.sender.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("")
    }
  };

  req.app.get("io").to(conversation._id.toString()).emit("message:new", {
    conversationId: conversation._id.toString(),
    message: payload
  });

  res.status(201).json({ message: payload });
});
