"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload, Send, FileText, CheckCircle, Bot, User, Database,
    Cpu, Settings, Bell, Menu, MessageCircle, ThumbsUp, ThumbsDown,
    Copy, Zap, Activity, Terminal, Moon, Sun
} from "lucide-react";
import { uploadDocument, chatWithBot, getSystemStatus, getCollectionStats, resetDatabase } from "@/services/api";

interface Message {
    id: string;
    role: "user" | "bot";
    text: string;
    sources?: string[];
    timestamp?: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
    const [fileName, setFileName] = useState("");
    const [showInspector, setShowInspector] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [systemStatus, setSystemStatus] = useState<any>(null);
    const [collectionStats, setCollectionStats] = useState<any>(null);
    const [selectedModel, setSelectedModel] = useState<'openai' | 'ollama'>('openai');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial welcome message (client-side only to avoid hydration mismatch)
    useEffect(() => {
        setMessages([{
            id: "1",
            role: "bot",
            text: "Hello! I'm DocMind AI. Upload a PDF contract or manual, and I'll help you navigate it instantly.",
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }]);
    }, []);

    useEffect(() => {
        getSystemStatus().then(setSystemStatus).catch(console.error);
        getCollectionStats().then(res => setCollectionStats(res.data)).catch(console.error);

        // Refresh stats every 10 seconds
        const interval = setInterval(() => {
            getCollectionStats().then(res => setCollectionStats(res.data)).catch(console.error);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Auto-reset chat when switching models
    useEffect(() => {
        const modelName = selectedModel === 'openai' ? 'GPT-4o mini' : 'Llama 3';
        setMessages([{
            id: Date.now().toString(),
            role: "bot",
            text: `Switched to ${modelName}. Ready to answer your questions!`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }]);
    }, [selectedModel]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleReset = async () => {
        if (!confirm("Are you sure you want to clear the knowledge base? This action cannot be undone.")) return;

        try {
            await resetDatabase();
            setMessages([
                {
                    id: Date.now().toString(),
                    role: "bot",
                    text: "Knowledge base cleared. Ready for new documents.",
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            setFileName("");
            setUploadStatus("idle");
            getCollectionStats().then(res => setCollectionStats(res.data)).catch(console.error);
        } catch (error) {
            console.error("Reset failed", error);
            alert("Failed to reset knowledge base");
        }
    };

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
                    text: `Successfully processed ${file.name}. I'm ready to answer your questions!`,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                },
            ]);
            // Refresh stats after upload
            getCollectionStats().then(res => setCollectionStats(res.data)).catch(console.error);
        } catch (error) {
            setUploadStatus("error");
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "bot",
                    text: `Failed to upload ${file.name}. Please try again.`,
                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                },
            ]);
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
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await chatWithBot(input, selectedModel);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: response.answer,
                sources: response.sources,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className={`relative flex h-screen w-full overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#05060d]' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] transition-opacity duration-500 ${isDarkMode ? 'bg-blue-600/10 opacity-100' : 'bg-blue-400/20 opacity-60'}`}></div>
                <div className={`absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] transition-opacity duration-500 ${isDarkMode ? 'bg-purple-600/10 opacity-100' : 'bg-purple-400/20 opacity-60'}`}></div>
                <div className={`absolute top-[30%] right-[20%] w-[20vw] h-[20vw] rounded-full blur-[80px] transition-opacity duration-500 ${isDarkMode ? 'bg-cyan-500/10 opacity-100' : 'bg-cyan-400/20 opacity-60'}`}></div>
            </div>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full relative z-10">
                {/* Header */}
                <header className={`h-20 flex items-center justify-between px-6 border-b transition-colors duration-500 backdrop-blur-xl sticky top-0 z-20 ${isDarkMode
                    ? 'border-white/5 bg-[#05060d]/60'
                    : 'border-slate-200 bg-white/60'
                    }`}>
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        >
                            <Bot className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                            <h1 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>DocMind AI</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center gap-1">
                                    <div className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </div>
                                    <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wide">Online</span>
                                </div>
                                {fileName && (
                                    <>
                                        <span className={`text-xs ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>•</span>
                                        <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{fileName}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Model Toggle */}
                        {systemStatus && (
                            <div className={`hidden lg:flex items-center p-1 rounded-xl border ${isDarkMode
                                ? 'bg-[#0a0d14]/80 border-white/10'
                                : 'bg-white/80 border-slate-200'
                                }`}>
                                <button
                                    onClick={() => setSelectedModel('openai')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedModel === 'openai'
                                        ? (isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700')
                                        : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
                                        }`}
                                >
                                    GPT-4o mini
                                </button>
                                <button
                                    onClick={() => setSelectedModel('ollama')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedModel === 'ollama'
                                        ? (isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700')
                                        : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
                                        }`}
                                >
                                    Llama 3
                                </button>
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <motion.button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className={`p-2.5 transition-all duration-300 rounded-lg ${isDarkMode
                                ? 'text-amber-400 hover:bg-amber-500/10'
                                : 'text-indigo-600 hover:bg-indigo-500/10'
                                }`}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </motion.button>

                        <button className="p-2.5 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5">
                            <Bell className="w-5 h-5" />
                        </button>

                        <div className="h-8 w-px bg-white/10"></div>

                        {/* Upload Section with Progress */}
                        <div className="relative">
                            {isUploading ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 h-10 px-5 bg-[#10141e]/80 backdrop-blur-sm rounded-xl border border-cyan-500/40"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs text-cyan-400 font-medium">Uploading...</span>
                                        <span className="text-[10px] text-slate-500 truncate max-w-[120px]">{fileName}</span>
                                    </div>
                                </motion.div>
                            ) : uploadStatus === "success" ? (
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center gap-2 h-10 px-4 bg-emerald-500/20 backdrop-blur-sm rounded-xl border border-emerald-400/50"
                                    >
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        <span className="text-sm text-emerald-300 font-medium">Indexed</span>
                                    </motion.div>
                                    <button
                                        onClick={handleReset}
                                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 text-red-500 transition-all"
                                        title="Clear & Reset"
                                    >
                                        <Zap className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        disabled={isUploading}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span>Upload PDF</span>
                                    </motion.button>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setShowInspector(!showInspector)}
                            className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            <Database className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 pb-32">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-start gap-4 max-w-4xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""} group`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === "bot"
                                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
                                        : "bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/20"
                                        }`}
                                >
                                    {msg.role === "bot" ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                                </motion.div>

                                <div className={`flex flex-col gap-2 flex-1 ${msg.role === "user" ? "items-end" : ""}`}>
                                    <div className="flex items-center gap-2.5">
                                        {msg.role === "user" && <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{msg.timestamp}</span>}
                                        <span className="text-sm font-semibold text-white">{msg.role === "bot" ? "DocMind AI" : "You"}</span>
                                        {msg.role === "bot" && <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{msg.timestamp}</span>}
                                    </div>

                                    <div
                                        className={`px-6 py-4 rounded-2xl backdrop-blur-md border shadow-lg ${msg.role === "bot"
                                            ? isDarkMode
                                                ? "bg-[#10141e]/80 text-slate-200 border-white/10 rounded-tl-sm"
                                                : "bg-white text-slate-700 border-slate-200 rounded-tl-sm shadow-slate-200/50"
                                            : "bg-gradient-to-br from-blue-600 to-purple-600 text-white border-white/10 rounded-tr-sm"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FileText className={`w-3.5 h-3.5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                                    <span className={`text-[10px] uppercase tracking-wide font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Sources</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.sources.map((src, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`inline-flex items-center px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${isDarkMode
                                                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20'
                                                                : 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100'
                                                                }`}
                                                        >
                                                            <FileText className="w-3 h-3 mr-1.5" />
                                                            {src}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {msg.role === "bot" && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <motion.button
                                                whileHover={{ scale: 1.2, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                                            >
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.2, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                            >
                                                <ThumbsDown className="w-3.5 h-3.5" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.2, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-4 max-w-4xl"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="px-5 py-4 bg-[#10141e]/80 backdrop-blur-md rounded-2xl rounded-tl-sm border border-white/10">
                                <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                                            className="w-2 h-2 bg-cyan-400 rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`absolute bottom-0 w-full p-6 bg-gradient-to-t z-20 pb-8 ${isDarkMode
                    ? 'from-[#05060d] via-[#05060d]'
                    : 'from-slate-50 via-slate-50'
                    } to-transparent`}>
                    <div className="max-w-4xl mx-auto">
                        <div className={`relative flex items-end gap-2 backdrop-blur-xl rounded-2xl shadow-2xl p-2 focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500/50 transition-all ${isDarkMode
                            ? 'bg-[#10141e]/80 border border-white/10'
                            : 'bg-white border border-slate-200'
                            }`}>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                placeholder="Ask a question about your document..."
                                className={`w-full bg-transparent border-none focus:ring-0 resize-none py-3.5 px-4 max-h-32 min-h-[52px] leading-relaxed ${isDarkMode
                                    ? 'text-white placeholder-slate-500'
                                    : 'text-slate-900 placeholder-slate-400'
                                    }`}
                                rows={1}
                            />
                            <motion.button
                                onClick={handleSendMessage}
                                whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(6, 182, 212, 0.4)" }}
                                whileTap={{ scale: 0.92 }}
                                disabled={!input.trim()}
                                className="p-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 relative overflow-hidden group"
                            >
                                {input.trim() && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={{ scale: 0, opacity: 0.5 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    />
                                )}
                                <Send className="w-5 h-5 relative z-10 group-hover:rotate-45 transition-transform duration-300" />
                            </motion.button>
                        </div>
                        <p className={`text-center text-xs mt-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>
                            DocMind AI can make mistakes. Consider checking important information.
                        </p>
                    </div>
                </div>
            </main >

            {/* Neural Inspector Sidebar */}
            <AnimatePresence>
                {
                    showInspector && (
                        <motion.aside
                            initial={{ x: 420 }}
                            animate={{ x: 0 }}
                            exit={{ x: 420 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`w-[420px] h-full flex flex-col shadow-2xl z-20 overflow-hidden relative backdrop-blur-3xl border-l transition-colors duration-500 ${isDarkMode ? 'bg-[#0B0E14] border-white/10' : 'bg-white border-slate-200'}`}
                        >
                            {/* Ambient Glows */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                            <div className="absolute top-1/2 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                            {/* Header */}
                            <header className={`px-6 py-5 border-b flex items-start justify-between backdrop-blur-md z-10 sticky top-0 transition-colors duration-500 ${isDarkMode ? 'border-white/10 bg-[#0B0E14]/50' : 'border-slate-200 bg-white/50'}`}>
                                <div>
                                    <h3 className={`text-base font-bold leading-tight tracking-wide uppercase flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Activity className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                        Neural Inspector
                                    </h3>
                                    <p className={`text-[11px] font-medium leading-normal pt-1.5 flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="tracking-wide">SYSTEMS ONLINE</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowInspector(false)}
                                    className={`transition-all p-1.5 rounded-lg ${isDarkMode ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
                                >
                                    <Terminal className="w-5 h-5" />
                                </button>
                            </header>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-0" style={{ scrollbarWidth: 'thin' }}>
                                {/* System Health */}
                                <section>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className={`tracking-wider text-[11px] font-bold uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>System Health</h3>
                                        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>LIVE</div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className={`rounded-xl p-4 border hover:border-cyan-500/40 transition-all group ${isDarkMode ? 'bg-[#131722] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex justify-between mb-3">
                                                <div className={`text-sm font-medium flex items-center gap-2.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                    <div className={`p-1.5 rounded-md ${isDarkMode ? 'bg-white/5 text-cyan-400 group-hover:bg-cyan-500/10' : 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100'}`}>
                                                        <Cpu className="w-4 h-4" />
                                                    </div>
                                                    Neural CPU
                                                </div>
                                                <p className={`text-xs font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>42%</p>
                                            </div>
                                            <div className="rounded-full bg-black/40 overflow-hidden h-1.5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "42%" }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div className={`rounded-xl p-3 border ${isDarkMode ? 'bg-[#131722] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <Activity className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                                </div>
                                                <div className={`text-[10px] uppercase tracking-wide font-bold mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Memory</div>
                                                <div className={`text-lg font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                                    {systemStatus?.ram_percent || 0}<span className={`text-xs ml-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Graph Status */}
                                <section>
                                    <h3 className={`tracking-wider text-[11px] font-bold uppercase mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Graph Status</h3>
                                    <div className={`rounded-xl border p-4 relative overflow-hidden ${isDarkMode ? 'bg-[#131722] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className={`text-3xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{collectionStats?.count || 0}</div>
                                                <div className={`text-[11px] font-medium uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Vectors Indexed</div>
                                            </div>
                                            <div className={`border-l pl-4 ${isDarkMode ? 'border-white/5' : 'border-slate-300'}`}>
                                                <div className={`text-3xl font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{systemStatus?.embedding_dimensions || 768}</div>
                                                <div className={`text-[11px] font-medium uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Dimensions</div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Active Context */}
                                {fileName && (
                                    <section>
                                        <h3 className={`tracking-wider text-[11px] font-bold uppercase mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active Context</h3>
                                        <div className={`rounded-xl border p-4 ${isDarkMode ? 'bg-[#131722] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-cyan-300" />
                                                </div>
                                                <div className="overflow-hidden min-w-0">
                                                    <p className="text-sm font-semibold text-slate-200 truncate">{fileName}</p>
                                                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Processed
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Footer */}
                            <footer className="px-6 py-4 border-t border-white/10 bg-[#0B0E14]/80 backdrop-blur flex justify-between items-center text-[10px] text-slate-600 uppercase tracking-widest font-bold font-mono">
                                <span>v2.4.1</span>
                                <span className="text-slate-500">DocMind Neural Engine</span>
                            </footer>
                        </motion.aside>
                    )
                }
            </AnimatePresence >
        </div >
    );
}
