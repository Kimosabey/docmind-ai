"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Send, FileText, CheckCircle, AlertCircle, Bot, User, Database } from "lucide-react";
import { uploadDocument, chatWithBot } from "@/services/api";
import NeuralInspector from "./NeuralInspector";

interface Message {
    id: string;
    role: "user" | "bot";
    text: string;
    sources?: string[];
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            text: "Hello! I'm DocMind AI. Upload a PDF contract or manual, and I'll help you navigate it instantly.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
    const [fileName, setFileName] = useState("");
    const [showInspector, setShowInspector] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setFileName(file.name);
        setIsUploading(true);
        setUploadStatus("idle");

        try {
            await uploadDocument(file);
            setUploadStatus("success");
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "bot",
                    text: `✅ Successfully processed **${file.name}**. I'm ready to answer your questions!`,
                },
            ]);
        } catch (error) {
            console.error(error);
            setUploadStatus("error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            text: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await chatWithBot(userMessage.text);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: response.data.answer,
                sources: response.data.sources,
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "bot",
                    text: "❌ Sorry, I encountered an error while processing your request.",
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 shadow-2xl overflow-hidden border-x border-gray-200 dark:border-gray-800">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 z-10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">D</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">DocMind AI</h1>
                        <p className="text-xs text-gray-500 font-medium">Enterprise Knowledge Engine</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Inspector Toggle */}
                    <button
                        onClick={() => setShowInspector(!showInspector)}
                        className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                        title="View Knowledge Graph"
                    >
                        <Database className="w-5 h-5" />
                    </button>

                    {/* Upload Button */}
                    <div className="relative group">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            disabled={isUploading}
                        />
                        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 border ${uploadStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                                uploadStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                                    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                            } shadow-sm group-hover:shadow-md`}>
                            {isUploading ? (
                                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            ) : uploadStatus === 'success' ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : (
                                <Upload className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            )}
                            <span className="text-sm font-medium">
                                {isUploading ? "Uploading..." : uploadStatus === 'success' ? "Indexed" : "Upload PDF"}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm relative ${msg.role === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-sm"
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-sm"
                                    }`}
                            >
                                <div className="flex items-start space-x-3">
                                    <div className={`min-w-6 mt-1`}>
                                        {msg.role === 'bot' ? <Bot className="w-5 h-5 text-indigo-500" /> : <User className="w-5 h-5 text-indigo-200" />}
                                    </div>
                                    <div>
                                        <div className="text-base leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Sources:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.sources.map((src, i) => (
                                                        <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs rounded-md border border-gray-200 dark:border-gray-700 flex items-center">
                                                            <FileText className="w-3 h-3 mr-1 opacity-70" />
                                                            {src.split('/').pop()?.substring(0, 20)}...
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center space-x-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="p-6 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                <div className="relative max-w-4xl mx-auto flex items-center shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500">

                    <input
                        type="text"
                        className="flex-1 bg-transparent px-5 py-4 outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
                        placeholder="Ask a question about your documents..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isTyping}
                        className={`mr-3 p-2 rounded-lg transition-all duration-200 ${input.trim()
                                ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transform hover:scale-105 active:scale-95'
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <div className="text-center mt-3">
                    <p className="text-xs text-gray-400 dark:text-gray-600">
                        DocMind AI can make mistakes. Verify important information.
                    </p>
                </div>
            </footer>

            {/* Neural Inspector Side Panel */}
            <AnimatePresence>
                {showInspector && <NeuralInspector onClose={() => setShowInspector(false)} />}
            </AnimatePresence>
        </div>
    );
}
