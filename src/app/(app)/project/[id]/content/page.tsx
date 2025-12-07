// Polling is a technique where a client (your frontend browser) repeatedly sends requests to a server at set time intervals to check for a new status or updated data.
// Analogy: It's like calling a restaurant every 5 minutes to ask, "Is my takeout order ready yet?" until they finally say, "Yes, it's complete."
'use client'
import { Copy, Edit3, Linkedin, Instagram, Save, Twitter, Sparkles } from 'lucide-react';
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
    linkedin: <Linkedin className="w-5 h-5 text-blue-700" />,
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
    // states for polling
    const [isLoading, setIsLoading] = useState(batchId? true: false);
    const [generationStatus, setGenerationStatus] = useState(batchId? "PENDING" : "READY");
    // og states for ui
    const [activePlatform, setActivePlatform] = useState<Platform>('linkedin');
    const [editingId, setEditingId] = useState<string | null>(null);



    // polling effect

    useEffect(()=> {
        if (!batchId) {
            setIsLoading(false);
            setGenerationStatus('READY');
            return;
        }
        let intervalId: NodeJS.Timeout; //stores the uniqueID returned by setIntercal
        const POLL_INTERVAL = 5000;

        const fetchContentStatus = async() => {
            try {
                const response = await axios.get<GeneratedContentResponse>(`${BACKEND_URL}/posts/get-posts/${batchId}`, {withCredentials: true});
                const data = response.data;
                const status = data.status;
                setGenerationStatus(status);

                if (status === 'COMPLETED') {
                    clearInterval(intervalId); //stop calls when job is done or user leaves the page
                    setIsLoading(false);

                    const generatedContent = data.generated_content || {}
                    // Get the platform names: ['LinkedIn', 'Twitter'], use flatmap to loop thru them
                    // For the current key (e.g., "LinkedIn"), access the array of posts: generatedContent["LinkedIn"].
                    // Use the inner .map() to iterate over that array (Post1, Post2, etc.).
                    // For each post object, create a brand new object ({...}) where you manually assign the standardized keys (id, platform: key.toLowerCase(), content: post.text).
                    const flattenedPosts: GeneratedPost[] = Object.keys(generatedContent).flatMap(key => { 
                        return generatedContent[key].map((post: any) => ({
                            id: crypto.randomUUID(), //unique key
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
        intervalId = setInterval(fetchContentStatus, POLL_INTERVAL); //setInterval - a js function that calls a specific fn repeatedly after a certain time interval and returns a uniqueId
        fetchContentStatus()

        return () => clearInterval(intervalId); //cleanup fn -> ensures the loop and polling stops when component is unmounted(user navigates away)
    }, [batchId, BACKEND_URL])

    // Handlers

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
// Success feedback (can be implemented with a toast or temporary message)
            console.log('content copied to clipboard');
        }).catch(err => {
            console.error('could not copy text:', err);
        });
    };

    const handleSaveEdit = (post: GeneratedPost) => {
        // update the main content w edited content, then reset editedcontent
        setPosts(prev => prev.map(p=>
            p.id ===post.id
            ? { ...p, content: post.editedContent || post.text, editedContent: undefined }
            : p 
        ));
        // no actual api call here, js local state update
        setEditingId(null);
    }
    
    const handleEditChange = (id: string, newContent: string) => {
        // update temporary edited content state
        setPosts(prev => prev.map( p=>
            p.id ===id
            ? {...p, editedContent: newContent}
            : p
        ));
    };

    const filteredPosts = posts.filter(p=>p.platform === activePlatform);
    // Use a mock project ID from the dynamic route parameter
    const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

        // 💡 NEW BLOCK: Conditional Rendering for Loading and Error States
    // =================================================================

    // 1. Loading/Polling State
    if (isLoading) {
        return (
            <div className="p-10 max-w-7xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-blue-600">
                    AI Content is Brewing... ☕️
                </h1>
                <p className="text-gray-600 mt-4">
                    We're generating your posts based on your strategy. This may take a moment.
                </p>
                <div className="mt-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                    Current Status: **{generationStatus.toUpperCase().replace('_', ' ')}** (Batch ID: {batchId})
                </p>
            </div>
        );
    }

    // 2. Failure State
    if (generationStatus === 'FAILED' || generationStatus === 'ERROR') {
        return (
            <div className="p-10 max-w-7xl mx-auto text-center text-red-600">
                <h1 className="text-3xl font-bold">Content Generation Failed 😔</h1>
                <p className="mt-4">
                    There was an issue processing the content for batch **{batchId}**. Please try generating the content again.
                </p>
            </div>
        );
    }

    // 3. Ready State (If no posts were loaded, even after being READY)
    if (posts.length === 0 && generationStatus === 'READY') {
         return (
            <div className="p-10 max-w-7xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-gray-800">No Content Found</h1>
                <p className="text-gray-600 mt-4">
                    This project has no generated posts yet. Navigate back to the strategy page to create a new batch.
                </p>
            </div>
        );
    }
    
    // =================================================================
    // 👇 YOUR ORIGINAL RENDER CODE STARTS HERE (It only runs when data is READY/COMPLETED)
    // =================================================================
    return (
        <div className="p-10 max-w-7xl mx-auto">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                    Content Grid for <span className="text-blue-600 ml-2">{projectId}</span>
                </h1>
                <p className="text-gray-500 mt-1">
                    Review and refine the AI-generated posts tailored to your strategy and tone.
                </p>
            </header>

            {/* Platform Tab Selector */}
            <div className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto">
                {Object.keys(platformLabels).map((key) => {
                    const platform = key as Platform;
                    return (
                        <button
                            key={platform}
                            onClick={() => setActivePlatform(platform)}
                            className={`shrink-0 px-4 py-3 text-lg font-semibold transition-colors flex items-center rounded-t-lg
                                ${activePlatform === platform 
                                    ? 'border-b-4 border-blue-600 text-blue-600' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {platformIcons[platform]}
                            <span className="ml-2">{platformLabels[platform]}</span>
                            <span className="ml-2 text-sm font-normal bg-gray-100 px-2 py-0.5 rounded-full">
                                {posts.filter(p => p.platform === platform).length}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map(post => (
                    <div key={post.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative">
                        
                        <div className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full shadow-inner">
                            {platformIcons[post.platform]}
                        </div>
                        
                        {editingId === post.id ? (
                            // Editing State
                            <div>
                                <textarea
                                    className="w-full min-h-32 p-3 border-2 border-dashed border-blue-300 rounded-lg focus:outline-none resize-none"
                                    // NOTE: Using post.content here as the source of truth, not post.text
                                    value={post.editedContent ?? post.text} 
                                    onChange={(e) => handleEditChange(post.id, e.target.value)}
                                />
                                <div className="flex space-x-2 mt-3">
                                    <button
                                        onClick={() => handleSaveEdit(post)}
                                        className="flex items-center text-sm font-semibold px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                    >
                                        <Save className="w-4 h-4 mr-1" /> Save
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="flex items-center text-sm font-semibold px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        <Twitter className="w-4 h-4 mr-1" /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Display State
                            <div>
                                <p className="text-gray-800 text-base leading-relaxed mb-4 whitespace-pre-wrap">
                                    {/* NOTE: Using post.content here */}
                                    {post.text} 
                                </p>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-500">Tone Profile:</span>
                                        <span className="text-sm font-semibold text-purple-600">{post.tone}</span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingId(post.id)}
                                            title="Edit Post"
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                                        >
                                            <Edit3 className="w-5 h-5" />
                                        </button>
                                        <button
                                            // NOTE: Using post.content here
                                            onClick={() => handleCopy(post.text)} 
                                            title="Copy to Clipboard"
                                            className="p-2 text-green-500 hover:bg-green-50 rounded-full transition"
                                        >
                                            <Copy className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Fallback if no posts are available for the currently active tab */}
                {posts.length > 0 && filteredPosts.length === 0 && (
                    <div className="md:col-span-3 text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">No posts generated for the {platformLabels[activePlatform]} platform in this batch.</p>
                    </div>
                )}
            </div>

            {/* Call to Action for Export/Next Steps */}
            <div className="mt-12 text-center">
                <button
                    onClick={() => console.log('Simulating Export/Scheduling...')}
                    className="px-10 py-4 bg-purple-700 text-white font-bold text-xl rounded-xl shadow-xl hover:bg-purple-800 transition"
                >
                    Export All Content
                </button>
            </div>
        </div>
    );
}

const ContentDisplayPage: FC = () => {
    return (
        <Suspense fallback={<div className="p-10 max-w-7xl mx-auto text-center"><p className="text-gray-600">Loading content...</p></div>}>
            <ContentDisplayContent />
        </Suspense>
    )
}
export default ContentDisplayPage


// return (
//         <div className="p-10 max-w-7xl mx-auto">
//             <header className="mb-8 border-b pb-4">
//                 <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
//                     Content Grid for <span className="text-blue-600 ml-2">{projectId}</span>
//                 </h1>
//                 <p className="text-gray-500 mt-1">
//                     Review and refine the AI-generated posts tailored to your strategy and tone.
//                 </p>
//             </header>

//             {/* Platform Tab Selector */}
//             <div className="flex space-x-2 border-b border-gray-200 mb-8 overflow-x-auto">
//                 {Object.keys(platformLabels).map((key) => {
//                     const platform = key as Platform;
//                     return (
//                         <button
//                             key={platform}
//                             onClick={() => setActivePlatform(platform)}
//                             className={`shrink-0 px-4 py-3 text-lg font-semibold transition-colors flex items-center rounded-t-lg
//                                 ${activePlatform === platform 
//                                     ? 'border-b-4 border-blue-600 text-blue-600' 
//                                     : 'text-gray-500 hover:text-gray-700'
//                                 }`}
//                         >
//                             {platformIcons[platform]}
//                             <span className="ml-2">{platformLabels[platform]}</span>
//                             <span className="ml-2 text-sm font-normal bg-gray-100 px-2 py-0.5 rounded-full">
//                                 {posts.filter(p => p.platform === platform).length}
//                             </span>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* Post Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredPosts.map(post => (
//                     <div key={post.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative">
                        
//                         {/* Platform Icon at the top right */}
//                         <div className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full shadow-inner">
//                             {platformIcons[post.platform]}
//                         </div>
                        
//                         {editingId === post.id ? (
//                             // Editing State
//                             <div>
//                                 <textarea
//                                     className="w-full min-h-32 p-3 border-2 border-dashed border-blue-300 rounded-lg focus:outline-none resize-none"
//                                     value={post.editedContent ?? post.text}
//                                     onChange={(e) => handleEditChange(post.id, e.target.value)}
//                                 />
//                                 <div className="flex space-x-2 mt-3">
//                                     <button
//                                         onClick={() => handleSaveEdit(post)}
//                                         className="flex items-center text-sm font-semibold px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
//                                     >
//                                         <Save className="w-4 h-4 mr-1" /> Save
//                                     </button>
//                                     <button
//                                         onClick={() => setEditingId(null)}
//                                         className="flex items-center text-sm font-semibold px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//                                     >
//                                         <Twitter className="w-4 h-4 mr-1" /> Cancel
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             // Display State
//                             <div>
//                                 <p className="text-gray-800 text-base leading-relaxed mb-4 whitespace-pre-wrap">
//                                     {post.text}
//                                 </p>
                                
//                                 <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//                                     <div className="flex flex-col">
//                                         <span className="text-xs font-medium text-gray-500">Tone Profile:</span>
//                                         <span className="text-sm font-semibold text-purple-600">{post.tone}</span>
//                                     </div>
                                    
//                                     <div className="flex space-x-2">
//                                         <button
//                                             onClick={() => setEditingId(post.id)}
//                                             title="Edit Post"
//                                             className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
//                                         >
//                                             <Edit3 className="w-5 h-5" />
//                                         </button>
//                                         <button
//                                             onClick={() => handleCopy(post.text)}
//                                             title="Copy to Clipboard"
//                                             className="p-2 text-green-500 hover:bg-green-50 rounded-full transition"
//                                         >
//                                             <Copy className="w-5 h-5" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
                
//                 {filteredPosts.length === 0 && (
//                     <div className="md:col-span-3 text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
//                         <p className="text-gray-500 font-medium">No posts generated for the {platformLabels[activePlatform]} platform yet.</p>
//                     </div>
//                 )}
//             </div>

//             {/* Call to Action for Export/Next Steps */}
//             <div className="mt-12 text-center">
//                 <button
//                     onClick={() => console.log('Simulating Export/Scheduling...')}
//                     className="px-10 py-4 bg-purple-700 text-white font-bold text-xl rounded-xl shadow-xl hover:bg-purple-800 transition"
//                 >
//                     Export All Content
//                 </button>
//             </div>
//         </div>
//     );


    // // effect - fetch generated content
    // useEffect(()=> {
    //     const fetchContent = async () => {
    //         try {
    //             // Assuming this endpoint is POST /project/{id}/content/fetch 
    //             // or just GET /project/{id}/content
    //             const response = await axios.get(`${BACKEND_URL}/posts/get-posts/${batchId}`, { withCredentials: true });
    //             // Set the real data, replacing the mock data
    //             setPosts(response.data);   
    //         } catch (err) {
    //             console.error("Failed to fetch generated content.", err);
    //             // In a real app, you'd show an error message and/or redirect
    //             router.push(`/project/${params.id}/strategy`);
    //         }
    //         // setPosts(mockGeneratedPosts)
    //     }
    //     fetchContent();
    // }, [params.id]);

// mock data
// const mockGeneratedPosts: GeneratedPost[] = [
//     {
//         id: 'p1',
//         platform: 'linkedin',
//         content: "Consistency is the new velocity. If your brand voice changes day-to-day, you’re losing credibility. Our latest tool ensures every post hits your unique Witty, Empathetic tone, automatically. See how we cut content inconsistency by 80%. #SaaS #BrandVoice #MarketingAutomation",
//         tone: 'Authoritative, Witty',
//         keywords: ['SaaS', 'BrandVoice'],
//     },
//     {
//         id: 'p2',
//         platform: 'x',
//         content: "Tired of your content sounding like 5 different people wrote it? 🙋‍♀️ Voice consistency isn't just nice, it's profitable. Try ToneMatch—the AI that locks in your tone across every tweet. Start being predictably brilliant. ✨",
//         tone: 'Witty, Direct',
//         keywords: ['AI', 'ToneMatch'],
//     },
//     {
//         id: 'p3',
//         platform: 'instagram',
//         content: "🚨 Case Study Alert! 🚨 Startup X increased their engagement 45% just by unifying their brand tone using ToneMatch. Stop guessing and start automating your voice. Link in bio to read the full breakdown! [Image: Placeholder for graphic]",
//         tone: 'Empathetic, Proof-based',
//         keywords: ['CaseStudy', 'Growth'],
//     },
//     {
//         id: 'p4',
//         platform: 'linkedin',
//         content: "Tutorial Tuesday: Here's a 3-step guide on mapping your core brand values to specific linguistic markers. If you can measure it, you can scale it. #ContentStrategy #B2B",
//         tone: 'Authoritative, Educational',
//         keywords: ['Tutorial', 'ContentStrategy'],
//     },
// ]
