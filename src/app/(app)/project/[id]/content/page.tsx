'use client'
import { Copy, Edit3, Linkedin, Instagram, Save, Twitter, Sparkles, X as XIcon } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
type Platform = 'linkedin' | 'x' | 'instagram' | 'medium' | 'reddit'

interface GeneratedContentResponse {
    status: "PENDING" | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    batch_id: string;
    generated_content?: Record<string, GeneratedPost[]>;
}

interface GeneratedPost {
    id: string;
    platform: Platform;
    text: string;
    tone: string;
    keywords: string[];
    editedContent?: string;
}

const platformIcons: Record<Platform, React.ReactNode> = {
    linkedin: <Linkedin className="w-5 h-5 text-blue-400" />,
    x: <Twitter className="w-5 h-5 text-sky-400" />,
    instagram: <Instagram className="w-5 h-5 text-pink-500" />,
    reddit: <Sparkles className="w-5 h-5 text-orange-500" />,
    medium: <Sparkles className="w-5 h-5 text-orange-500" />,
};

const platformLabels: Record<Platform, string> = {
    linkedin: 'LinkedIn',
    x: 'X (Twitter)',
    instagram: 'Instagram',
    reddit: 'Blog Snippets',
    medium: 'Blog Snippets',
};

const ContentDisplayContent: FC = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const batchId = searchParams.get('batchId');
    const [posts, setPosts] = useState<GeneratedPost[]>([]);
    const [isLoading, setIsLoading] = useState(batchId ? true : false);
    const [generationStatus, setGenerationStatus] = useState(batchId ? "PENDING" : "READY");
    const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        if (!batchId) {
            setIsLoading(false);
            setGenerationStatus('READY');
            return;
        }
        let intervalId: NodeJS.Timeout;
        const POLL_INTERVAL = 5000;

        const fetchContentStatus = async () => {
            try {
                const response = await axios.get<GeneratedContentResponse>(`${BACKEND_URL}/posts/get-posts/${batchId}`, { withCredentials: true });
                const data = response.data;
                const status = data.status;
                setGenerationStatus(status);

                if (status === 'COMPLETED') {
                    clearInterval(intervalId);
                    setIsLoading(false);

                    const generatedContent = data.generated_content || {}
                    const flattenedPosts: GeneratedPost[] = Object.keys(generatedContent).flatMap(key => {
                        return generatedContent[key].map((post: any) => ({
                            id: crypto.randomUUID(),
                            platform: key.toLowerCase() as Platform,
                            text: post.text,
                            tone: post.tone,
                            keywords: post.keywords || [],
                            editedContent: undefined,
                        }))
                    })
                    setPosts(flattenedPosts)
                } else if (status === "FAILED") {
                    clearInterval(intervalId);
                    setIsLoading(false);
                    console.error("Content generation failed")
                }
            } catch (error) {
                console.error("polling failed", error);
                clearInterval(intervalId);
                setIsLoading(false);
                setGenerationStatus('ERROR');
            }
        };
        intervalId = setInterval(fetchContentStatus, POLL_INTERVAL);
        fetchContentStatus()

        return () => clearInterval(intervalId);
    }, [batchId, BACKEND_URL])

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            console.log('content copied to clipboard');
        }).catch(err => {
            console.error('could not copy text:', err);
        });
    };

    const handleSaveEdit = (post: GeneratedPost) => {
        setPosts(prev => prev.map(p =>
            p.id === post.id
                ? { ...p, content: post.editedContent || post.text, editedContent: undefined }
                : p
        ));
        setEditingId(null);
    }

    const handleEditChange = (id: string, newContent: string) => {
        setPosts(prev => prev.map(p =>
            p.id === id
                ? { ...p, editedContent: newContent }
                : p
        ));
    };

    const filteredPosts = posts.filter(p => p.platform === activePlatform);
    const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

    if (isLoading) {
        return (
            <div className="p-10 max-w-7xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-orange-500 mb-4">
                    AI Content is Brewing... ☕️
                </h1>
                <p className="text-white/60 mt-4">
                    We're generating your posts based on your strategy. This may take a moment.
                </p>
                <div className="mt-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
                </div>
                <p className="text-sm text-white/50 mt-4">
                    Current Status: <span className="text-orange-400 font-semibold">{generationStatus.toUpperCase().replace('_', ' ')}</span> (Batch ID: {batchId})
                </p>
            </div>
        );
    }

    if (generationStatus === 'FAILED' || generationStatus === 'ERROR') {
        return (
            <div className="p-10 max-w-7xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-red-400">Content Generation Failed 😔</h1>
                <p className="text-white/60 mt-4">
                    There was an issue processing the content for batch <span className="text-orange-400">{batchId}</span>. Please try generating the content again.
                </p>
            </div>
        );
    }

    if (posts.length === 0 && generationStatus === 'READY') {
        return (
            <div className="p-10 max-w-7xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-white">No Content Found</h1>
                <p className="text-white/60 mt-4">
                    This project has no generated posts yet. Navigate back to the strategy page to create a new batch.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-10 max-w-7xl mx-auto">
            <header className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center flex-wrap gap-2">
                    Content Grid for <span className="text-orange-500">{projectId}</span>
                </h1>
                <p className="text-white/60 mt-2">
                    Review and refine the AI-generated posts tailored to your strategy and tone.
                </p>
            </header>

            {/* Platform Tab Selector */}
            <div className="flex space-x-2 border-b border-gray-800 mb-8 overflow-x-auto pb-2">
                {Object.keys(platformLabels).map((key) => {
                    const platform = key as Platform;
                    return (
                        <button
                            key={platform}
                            onClick={() => setActivePlatform(platform)}
                            className={`shrink-0 px-4 py-3 text-base sm:text-lg font-semibold transition-colors flex items-center rounded-t-lg
                                ${activePlatform === platform
                                    ? 'border-b-4 border-orange-500 text-orange-500'
                                    : 'text-white/60 hover:text-white/80'
                                }`}
                        >
                            {platformIcons[platform]}
                            <span className="ml-2">{platformLabels[platform]}</span>
                            <span className="ml-2 text-sm font-normal bg-gray-800 px-2 py-0.5 rounded-full">
                                {posts.filter(p => p.platform === platform).length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                    <div key={post.id} className="relative bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-800/50 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all group overflow-hidden">

                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-transparent transition-all duration-300 rounded-2xl pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Platform Icon Badge */}
                            <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700/50">
                                {platformIcons[post.platform]}
                            </div>

                            {editingId === post.id ? (
                                <div className="pr-10">
                                    <textarea
                                        className="w-full min-h-32 p-3 border-2 border-dashed border-orange-500/50 bg-gray-800/50 text-white rounded-xl focus:outline-none focus:border-orange-500 resize-none placeholder-gray-500"
                                        value={post.editedContent ?? post.text}
                                        onChange={(e) => handleEditChange(post.id, e.target.value)}
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => handleSaveEdit(post)}
                                            className="flex-1 flex items-center justify-center text-sm font-semibold px-4 py-2 bg-orange-500/90 hover:bg-orange-500 text-white rounded-xl transition-all shadow-md"
                                        >
                                            <Save className="w-4 h-4 mr-1.5" /> Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="flex-1 flex items-center justify-center text-sm font-semibold px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white/90 rounded-xl transition-all border border-gray-700/50"
                                        >
                                            <XIcon className="w-4 h-4 mr-1.5" /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pr-10">
                                    <p className="text-white/90 text-sm leading-relaxed mb-4 whitespace-pre-wrap min-h-[120px]">
                                        {post.text}
                                    </p>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-800/50">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-white/40 mb-0.5">Tone</span>
                                            <span className="text-sm font-semibold text-orange-400">{post.tone}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingId(post.id)}
                                                title="Edit Post"
                                                className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleCopy(post.text)}
                                                title="Copy to Clipboard"
                                                className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {posts.length > 0 && filteredPosts.length === 0 && (
                    <div className="md:col-span-3 text-center p-12 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl border-dashed">
                        <p className="text-white/60 font-medium">No posts generated for {platformLabels[activePlatform]} in this batch</p>
                    </div>
                )}
            </div>

            {/* Export Button */}
            <div className="mt-12 text-center">
                <button
                    onClick={() => console.log('Simulating Export/Scheduling...')}
                    className="w-full sm:w-auto px-10 py-4 bg-orange-500/90 hover:bg-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/20 transition-all"
                >
                    Export All Content
                </button>
            </div>
        </div>
    );
}

const ContentDisplayPage: FC = () => {
    return (
        <Suspense fallback={<div className="p-10 max-w-7xl mx-auto text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div><p className="text-white/60">Loading content...</p></div>}>
            <ContentDisplayContent />
        </Suspense>
    )
}

export default ContentDisplayPage;
