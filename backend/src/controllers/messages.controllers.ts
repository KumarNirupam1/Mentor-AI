import { Chat } from "../models/chats.models.ts";
import { Message } from "../models/messages.models.ts";
import { User } from "../models/user.models.ts";
import { hitesh, piyush } from "../utils/ai.ts";
import {
    releasePersonaMessage,
    reservePersonaMessage,
} from "../utils/persona-limit.ts";
import { decryptSecret, hasStoredSecret } from "../utils/encryption.ts";
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
    let reserved = false;
    let user: Awaited<ReturnType<typeof User.findById>> = null;
    let chatPersona: "hitesh" | "piyush" | null = null;

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

        chatPersona = chat.persona;

        if (chat.userId.toString() !== userId.toString()) {
            return res.status(403).json(new ApiError(403, "You are not authorized to access this chat", [], ""));
        }

        user = await User.findById(userId).select("+openaiApiKey");
        if (!user) {
            return res.status(404).json(new ApiError(404, "User not found", [], ""));
        }

        if (!hasStoredSecret(user.openaiApiKey)) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "OpenAI API key required. Please add your key to start chatting.",
                data: { requiresOpenaiKey: true },
            });
        }

        const limitCheck = await reservePersonaMessage(user, chat.persona);
        if (!limitCheck.allowed) {
            return res.status(429).json({
                statusCode: 429,
                success: false,
                message: "Message limit reached for this mentor. Please come back after the cooldown.",
                data: { usage: limitCheck.usage },
            });
        }

        reserved = true;

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
        let apiKey: string;
        try {
            apiKey = decryptSecret(user.openaiApiKey as string);
        } catch {
            await releasePersonaMessage(user, chat.persona);
            reserved = false;
            return res.status(400).json(
                new ApiError(
                    400,
                    "Could not read your OpenAI API key. Please re-save it from the dashboard.",
                    [],
                    "",
                ),
            );
        }

        try {
            if (chat.persona === "hitesh") {
                rawContent = await hitesh(apiKey, developer, history, newMessage);
            } else {
                rawContent = await piyush(apiKey, developer, history, newMessage);
            }
        } catch (aiError) {
            await releasePersonaMessage(user, chat.persona);
            reserved = false;
            const aiMessage =
                aiError instanceof Error ? aiError.message : "OpenAI request failed";
            return res.status(400).json(
                new ApiError(400, `AI error: ${aiMessage}`, [], ""),
            );
        }

        if (!rawContent) {
            await releasePersonaMessage(user, chat.persona);
            reserved = false;
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

        return res.status(200).json(new ApiResponse(200, { parsed, usage: limitCheck.usage }, "Message created successfully"));
    } catch (error) {
        if (reserved && user && chatPersona) {
            await releasePersonaMessage(user, chatPersona);
        }
        const message = error instanceof Error ? error.message : "Something went wrong while creating message";
        return res.status(500).json(new ApiError(500, message, [error], ""));
    }
};

export { getAllMessages, createMessage };
