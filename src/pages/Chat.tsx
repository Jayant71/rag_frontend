import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { Space, ChatMessage as ChatMessageType, Source } from '@/types';

interface OutletContext {
    space: Space | null;
    spaceId: string;
}

export default function Chat() {
    const { space, spaceId } = useOutletContext<OutletContext>();
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentSources, setCurrentSources] = useState<Source[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load chat history
        loadHistory();
    }, [spaceId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadHistory = async () => {
        try {
            const history = await api.chat.history(spaceId);
            setMessages(history);
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        // Optimistically add user message
        const tempUserMsg: ChatMessageType = {
            id: `temp-${Date.now()}`,
            space_id: spaceId,
            user_id: '',
            role: 'user',
            content: userMessage,
            sources: null,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);

        try {
            const response = await api.chat.send(spaceId, userMessage);

            // Add AI response
            const aiMsg: ChatMessageType = {
                id: `temp-ai-${Date.now()}`,
                space_id: spaceId,
                user_id: '',
                role: 'assistant',
                content: response.answer,
                sources: response.sources,
                created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setCurrentSources(response.sources);
        } catch (error) {
            console.error('Failed to send message:', error);
            // Remove the optimistic message on error
            setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to clear all chat history?')) {
            try {
                await api.chat.clear(spaceId);
                setMessages([]);
                setCurrentSources([]);
            } catch (error) {
                console.error('Failed to clear history:', error);
            }
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex h-full">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative min-w-0">
                {/* Header */}
                <header className="h-[60px] border-b border-border flex items-center justify-between px-6 shrink-0 z-10 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600">
                            <span className="material-symbols-outlined text-[20px]">
                                folder_open
                            </span>
                        </div>
                        <div>
                            <h2 className="text-text-main text-base font-bold leading-tight">
                                Chat with {space?.name || 'Space'}
                            </h2>
                            <p className="text-xs text-slate-500">Ask questions about your documents</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center justify-center size-8 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            title="Export Chat"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                download
                            </span>
                        </button>
                        <button
                            onClick={handleClearHistory}
                            className="flex items-center justify-center size-8 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            title="Clear History"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                delete_sweep
                            </span>
                        </button>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 pb-32 flex flex-col gap-6">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                            <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">
                                chat_bubble
                            </span>
                            <p className="text-lg font-medium">Start a conversation</p>
                            <p className="text-sm">
                                Ask questions about your documents and get AI-powered answers
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        'flex w-full group',
                                        message.role === 'user' ? 'justify-end' : 'justify-start gap-3'
                                    )}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="shrink-0 mt-1">
                                            <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                                <span className="material-symbols-outlined text-indigo-600 text-[18px]">
                                                    smart_toy
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={cn(
                                            'flex flex-col',
                                            message.role === 'user'
                                                ? 'items-end max-w-[80%]'
                                                : 'items-start max-w-[85%]'
                                        )}
                                    >
                                        {message.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold text-slate-700">
                                                    AI Assistant
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                'px-5 py-3.5 rounded-2xl',
                                                message.role === 'user'
                                                    ? 'user-bubble bg-chat-user text-white shadow-sm'
                                                    : 'ai-bubble bg-chat-ai text-text-main'
                                            )}
                                        >
                                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                                                {message.content}
                                            </p>
                                        </div>

                                        {message.role === 'assistant' && (
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    onClick={() => copyToClipboard(message.content)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        content_copy
                                                    </span>
                                                    Copy
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                                    <span className="material-symbols-outlined text-[14px]">
                                                        thumb_up
                                                    </span>
                                                    Helpful
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex justify-start gap-3">
                                    <div className="shrink-0 mt-1">
                                        <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                                            <span className="material-symbols-outlined text-indigo-600 text-[18px] animate-pulse">
                                                smart_toy
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ai-bubble bg-chat-ai px-5 py-4 rounded-2xl">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                            <div
                                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.1s' }}
                                            />
                                            <div
                                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.2s' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12">
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
                        <div className="absolute inset-0 bg-slate-200/50 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity" />
                        <div className="relative bg-white border border-border rounded-full shadow-lg flex items-center p-2 pr-3 transition-shadow focus-within:shadow-xl focus-within:border-blue-300">
                            <button
                                type="button"
                                className="p-2 ml-1 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                                title="Attach file"
                            >
                                <span className="material-symbols-outlined">attach_file</span>
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 border-none bg-transparent focus:ring-0 text-text-main placeholder-slate-400 text-base px-3 py-3 outline-none"
                                placeholder="Ask a question about your documents..."
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="bg-chat-user hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2.5 flex items-center justify-center transition-transform active:scale-95 shadow-md"
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    send
                                </span>
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[11px] text-slate-400">
                                AI can make mistakes. Please verify important information.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Sources Panel */}
            <aside className="w-[300px] bg-source-bg border-l border-border flex flex-col h-full shrink-0">
                <div className="h-[60px] flex items-center px-5 border-b border-border bg-source-bg shrink-0">
                    <span className="material-symbols-outlined text-slate-400 mr-2 text-[18px]">
                        manage_search
                    </span>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                        Retrieved Sources
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {currentSources.length === 0 ? (
                        <div className="text-center text-slate-400 py-8">
                            <span className="material-symbols-outlined text-4xl mb-2">
                                source
                            </span>
                            <p className="text-sm">Sources will appear here</p>
                        </div>
                    ) : (
                        currentSources.map((source, index) => (
                            <div
                                key={index}
                                className="bg-white border border-border rounded-lg p-3 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="material-symbols-outlined text-red-500 text-[18px]">
                                            picture_as_pdf
                                        </span>
                                        <span className="text-xs font-semibold text-slate-700 truncate">
                                            {source.metadata.filename || 'Unknown'}
                                        </span>
                                    </div>
                                    {source.score !== null && (
                                        <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                            {source.score.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 group-hover:text-slate-700">
                                    {source.text}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </div>
    );
}
