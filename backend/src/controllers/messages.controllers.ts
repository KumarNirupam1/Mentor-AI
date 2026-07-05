import { Chat } from "../models/chats.models.ts";
import { Message } from "../models/messages.models.ts";
import { hitesh, piyush } from "../utils/ai.ts";
import { ApiError } from "../utils/api-error.ts";
import { ApiResponse } from "../utils/api-response.ts";
import type { Request, Response } from "express";

const getAllMessages = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        if (!chatId) {
            return res.status(400).json(new ApiError(400, "chatId is required", [], ""));
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json(new ApiError(404, "Chat not found", [], ""));
        }

        if (chat.userId.toString() !== userId.toString()) {
            return res.status(403).json(new ApiError(403, "You are not authorized to access this chat", [], ""));
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

        const filteredMessages = messages.map((message) => ({
            role: message.role,
            content: message.content,
        }));

        return res.status(200).json(new ApiResponse(200, { messages: filteredMessages }, "Messages fetched successfully"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while fetching messages";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
};

const createMessage = async (req: Request & { user?: any }, res: Response) => {
    try {
        const { chatId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!chatId) {
            return res.status(400).json(new ApiError(400, "chatId is required", [], ""));
        }

        if (!content?.trim()) {
            return res.status(400).json(new ApiError(400, "Message content is required", [], ""));
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json(new ApiError(404, "Chat not found", [], ""));
        }

        if (chat.userId.toString() !== userId.toString()) {
            return res.status(403).json(new ApiError(403, "You are not authorized to access this chat", [], ""));
        }

        let messages = await Message.find({ chatId }).sort({ createdAt: -1 }).limit(100);
        messages = messages.reverse();

        if (!messages.length) {
            const titleWords = content.trim().split(/\s+/);
            if (titleWords.length <= 3) {
                chat.title = titleWords.join(" ");
            } else {
                chat.title = titleWords.slice(0, 3).join(" ") + " ...";
            }
            await chat.save();
        }

        const developer = {
            role: "developer" as const,
            content: `User which is asking the question is ${req.user.name} and his email is ${req.user.email}`,
        };

        const history = messages.map((message) => ({
            role: message.role as "user" | "assistant",
            content: message.content,
        }));

        const newMessage = {
            role: "user" as const,
            content: content.trim(),
        };

        let rawContent: string | null;
        if (chat.persona === "hitesh") {
            rawContent = await hitesh(developer, history, newMessage);
        } else {
            rawContent = await piyush(developer, history, newMessage);
        }

        if (!rawContent) {
            return res.status(400).json(new ApiError(400, "Error in generating response", [], ""));
        }

        const parsed = {
            role: "assistant" as const,
            content: rawContent,
        };

        await Message.create({
            chatId: chatId as string,
            role: "user",
            content: content.trim(),
        });

        await Message.create({
            chatId: chatId as string,
            role: "assistant",
            content: rawContent,
        });

        return res.status(200).json(new ApiResponse(200, { parsed }, "Message created successfully"));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong while creating message";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
};

export { getAllMessages, createMessage };
