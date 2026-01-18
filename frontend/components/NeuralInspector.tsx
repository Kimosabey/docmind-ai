"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, FileText, RefreshCw, Server, X } from "lucide-react";
import { getCollectionStats, getDebugDocuments } from "@/services/api";

interface DocChunk {
    id: string;
    content: string;
    metadata: {
        source: string;
        page?: number;
    };
}

interface Stats {
    count: number;
    name?: string;
}

export default function NeuralInspector({ onClose }: { onClose: () => void }) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [chunks, setChunks] = useState<DocChunk[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, docsRes] = await Promise.all([
                getCollectionStats(),
                getDebugDocuments()
            ]);
            setStats(statsRes.data);
            setChunks(docsRes.data);
        } catch (error) {
            console.error("Failed to fetch debug data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 border-l border-gray-200 dark:border-gray-800 flex flex-col"
        >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-950">
                <div className="flex items-center space-x-2">
                    <Server className="w-5 h-5 text-purple-600" />
                    <h2 className="font-bold text-gray-900 dark:text-gray-100">Neural Inspector</h2>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-4 rounded-xl border border-indigo-100 dark:border-gray-700">
                    <h3 className="text-xs font-semibold uppercase text-indigo-500 mb-2">Vector Database Status</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {loading ? "..." : stats?.count || 0}
                            </p>
                            <p className="text-xs text-gray-500">Total Chunks</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${stats ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Stored Chunks</h3>
                    <button onClick={fetchData} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="space-y-3">
                    {chunks.map((chunk) => (
                        <div key={chunk.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 text-xs shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                                    {chunk.metadata.source.split('/').pop()}
                                </span>
                                <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px] text-gray-500">
                                    ID: {chunk.id.substring(0, 6)}...
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 font-mono leading-relaxed">
                                {chunk.content}
                            </p>
                        </div>
                    ))}
                    {!loading && chunks.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            <Database className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            No documents vectorized yet.
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
