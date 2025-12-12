import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function Landing() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            {/* Navigation Bar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/0 bg-white/80 backdrop-blur-md transition-all duration-300">
                <div className="px-6 lg:px-40 flex h-20 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined !text-[28px]">
                                smart_toy
                            </span>
                        </div>
                        <h2 className="font-display text-xl font-bold tracking-tight text-text-main">
                            RAG Engine
                        </h2>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a
                            href="#features"
                            className="text-sm font-medium text-text-main hover:text-primary transition-colors"
                        >
                            Features
                        </a>
                        <a
                            href="#architecture"
                            className="text-sm font-medium text-text-main hover:text-primary transition-colors"
                        >
                            Architecture
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-text-main hover:text-primary transition-colors"
                        >
                            GitHub
                        </a>
                    </nav>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outline" className="hidden md:flex">
                                        Login
                                    </Button>
                                </Link>
                                <Button onClick={handleGetStarted}>Get Started</Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative flex w-full flex-col items-center justify-center bg-hero-gradient px-4 py-20 lg:py-32">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center gap-8">
                    {/* Badge */}
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1">
                        <span className="text-xs font-bold uppercase tracking-wide text-primary-dark">
                            Production-Grade AI System
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-text-main sm:text-5xl lg:text-6xl">
                        Build Intelligent Knowledge Bases with Multi-Modal RAG
                    </h1>

                    {/* Subheadline */}
                    <p className="max-w-2xl text-lg font-normal leading-relaxed text-text-secondary">
                        A full-stack engine powered by LlamaIndex, Qdrant, and FastAPI.
                        Experience data isolation with 'Spaces' and state-of-the-art
                        document parsing.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Button
                            size="lg"
                            className="min-w-[160px] rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
                            onClick={handleGetStarted}
                        >
                            Try the Demo
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="min-w-[160px] rounded-xl"
                            onClick={() => window.open('https://github.com', '_blank')}
                        >
                            <span className="material-symbols-outlined text-[20px]">code</span>
                            View Source Code
                        </Button>
                    </div>
                </div>

                {/* Abstract Visual Elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-3xl"></div>
                    <div className="absolute top-[40%] -left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-50/60 blur-3xl"></div>
                </div>
            </section>

            {/* Feature Grid Section */}
            <section className="w-full bg-white px-4 py-24" id="features">
                <div className="mx-auto flex max-w-[960px] flex-col gap-12">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <h2 className="font-display text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
                            Why this RAG System?
                        </h2>
                        <p className="max-w-2xl text-base text-text-muted">
                            Our architecture provides robust solutions for enterprise needs,
                            focusing on scalability, accuracy, and security.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Card 1 */}
                        <div className="group flex flex-col gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">layers</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="font-display text-lg font-bold text-text-main">
                                    Workspace Isolation
                                </h3>
                                <p className="text-sm leading-relaxed text-text-muted">
                                    Logical separation of data using Spaces for multi-project
                                    management. Keep client data secure and distinct.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group flex flex-col gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="font-display text-lg font-bold text-text-main">
                                    LlamaParse Integration
                                </h3>
                                <p className="text-sm leading-relaxed text-text-muted">
                                    Extracts tables and complex structures from PDFs with SOTA
                                    accuracy. No more broken formatting.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group flex flex-col gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="font-display text-lg font-bold text-text-main">
                                    Hybrid Search
                                </h3>
                                <p className="text-sm leading-relaxed text-text-muted">
                                    Powered by Qdrant vector database with optional Cohere
                                    Reranking for the most relevant results.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Strip */}
            <section className="w-full bg-sidebar py-16 text-white" id="architecture">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-center text-white/90">
                        Built with modern infrastructure
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-70">
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="material-symbols-outlined text-3xl group-hover:text-yellow-400 transition-colors">
                                terminal
                            </span>
                            <span className="text-lg font-bold group-hover:text-white transition-colors">
                                Python
                            </span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="material-symbols-outlined text-3xl group-hover:text-teal-400 transition-colors">
                                bolt
                            </span>
                            <span className="text-lg font-bold group-hover:text-white transition-colors">
                                FastAPI
                            </span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="material-symbols-outlined text-3xl group-hover:text-cyan-400 transition-colors">
                                code
                            </span>
                            <span className="text-lg font-bold group-hover:text-white transition-colors">
                                React
                            </span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="material-symbols-outlined text-3xl group-hover:text-blue-400 transition-colors">
                                deployed_code
                            </span>
                            <span className="text-lg font-bold group-hover:text-white transition-colors">
                                Docker
                            </span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="material-symbols-outlined text-3xl group-hover:text-pink-400 transition-colors">
                                database
                            </span>
                            <span className="text-lg font-bold group-hover:text-white transition-colors">
                                Qdrant
                            </span>
                        </div>
                        <div className="flex items-center gap-2 group cursor-default">
                            <span className="material-symbols-outlined text-3xl group-hover:text-green-400 transition-colors">
                                psychology
                            </span>
                            <span className="text-lg font-bold group-hover:text-white transition-colors">
                                OpenAI
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full border-t border-border bg-white py-12">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">
                                smart_toy
                            </span>
                            <span className="font-display font-bold text-text-main">
                                RAG Engine
                            </span>
                        </div>
                        <p className="text-sm text-text-muted">
                            © 2024 AI Portfolio Project. All rights reserved.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="text-text-muted transition-colors hover:text-primary"
                            aria-label="Twitter"
                        >
                            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-text-muted transition-colors hover:text-primary"
                            aria-label="LinkedIn"
                        >
                            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                                ></path>
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-text-muted transition-colors hover:text-primary"
                            aria-label="GitHub"
                        >
                            <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                ></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
