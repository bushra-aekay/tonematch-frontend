'use client'
import axios from 'axios';
import { Zap, LayoutGrid, CheckCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type StrategySource = 'ai' | 'user' | 'hybrid';

interface ProjectData {
    project_id: string;
    name: string;
    mission: string;
    industry: string
    target_audience: string
    short_desc: string
    website_link: string
    current_marketing: string
    platforms_currently_used: string[]
    brand_keywords: string[]
    voice: string
    ai_strategy_status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
    ai_suggested_strategy: any | null
}

const StrategyDisplayPage: FC = () => {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectData | null>(null);
    const [selectedSource, setSelectedSource] = useState<StrategySource>('hybrid');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);
    const [isGenerating, setIsGenerating] = useState(false);

    // Fetching Project Data
    useEffect(() => {
        const projectId = params.id as string
        let intervalId: NodeJS.Timeout
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/business/${projectId}`, { withCredentials: true });
                const currentProjectData: ProjectData = response.data
                setProject(currentProjectData)

                if (currentProjectData.ai_strategy_status === 'COMPLETED' ||
                    currentProjectData.ai_strategy_status === 'FAILED') {
                    clearInterval(intervalId)
                }
            } catch (err) {
                console.error("failed to fetch project.", err);
                clearInterval(intervalId);
                router.push('/dashboard');
            }
        };
        if (projectId) {
            fetchProject();
            intervalId = setInterval(fetchProject, 7000);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [params.id, router]);

    // Platform selection
    const togglePlatform = (platform: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    // Initiate Post Generation
    const handleGeneratePosts = async () => {
        if (!project || selectedPlatforms.length === 0) {
            alert("Please select at least one platform");
            return;
        }
        if (project?.ai_strategy_status !== 'COMPLETED') {
            alert("Wait for the AI strategy to be completed");
            return;
        }
        setIsGenerating(true);

        const finalGenerationPayload = {
            project_id: project?.project_id,
            strategy_selected: selectedSource,
            platforms: selectedPlatforms
        };
        console.log('starting post gen', finalGenerationPayload, project);

        try {
            const response = await axios.post(`${BACKEND_URL}/posts/generate-posts`, finalGenerationPayload, { withCredentials: true });

            const batchId = response.data.batch_id

            setIsGenerating(false);
            router.push(`/project/${project.project_id}/content?batchId=${batchId}`);

        } catch (error) {
            console.error("Post Generation API Failed:", error);
            setIsGenerating(false);
            alert("Failed to start post generation. Please check the API connection.");
        }
    };

    const isStrategyReady = project?.ai_strategy_status === "COMPLETED";
    const isLoading = (
        project?.ai_strategy_status === "PENDING" ||
        project?.ai_strategy_status === "IN_PROGRESS"
    )

    if (!project) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-white/60">Loading project details...</p>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-white/60">Generating posts...</p>
            </div>
        );
    }

    return (
        <div className='p-4 sm:p-10 max-w-7xl mx-auto'>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                {project.name} Strategy
            </h1>
            <p className="text-white/60 mb-8">
                Review your generated strategy and select your preferences for content generation.
            </p>

            {/* Loading State */}
            {isLoading && (
                <div className="bg-gray-900 border border-gray-800 p-10 rounded-lg shadow-xl text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-white">
                        Generating Core Strategy...
                    </h2>
                    <p className="text-white/60 mt-2">
                        This may take a minute as the AI analyzes your profile. Please wait or come back later.
                    </p>
                </div>
            )}

            {/* Failed State */}
            {project.ai_strategy_status === 'FAILED' && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 p-6 rounded-lg">
                    <p className="font-bold text-lg">Generation Failed</p>
                    <p className="text-white/80">The AI failed to generate a strategy. Please review your profile data and try again.</p>
                </div>
            )}

            {/* Ready State */}
            {isStrategyReady && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
                    {/* Strategy Content Display */}
                    <div className='lg:col-span-2 p-6 bg-gray-900 border border-gray-800 rounded-xl'>
                        <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
                            <Zap className="w-6 h-6 mr-2 text-orange-500" />
                            AI Strategy Summary
                        </h2>
                        <div className='prose max-w-none'>
                            {project.ai_suggested_strategy ? (
                                <pre className="bg-gray-800 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto border border-gray-700 text-white/90">
                                    {JSON.stringify(project.ai_suggested_strategy, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-red-400">AI strategy content is still pending...</p>
                            )}
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Strategy Source Selection */}
                        <div className='p-6 bg-gray-900 border border-gray-800 rounded-xl'>
                            <h3 className="text-lg font-semibold mb-3 text-white">1. Select Strategy Source</h3>
                            <p className="text-sm text-white/60 mb-4">Choose the foundation for your content tone and focus.</p>

                            <div className='space-y-3'>
                                {['ai', 'user', 'hybrid'].map(source => (
                                    <button
                                        key={source}
                                        onClick={() => setSelectedSource(source as StrategySource)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${selectedSource === source
                                                ? 'bg-orange-500 text-white border-orange-600 shadow-lg'
                                                : 'bg-gray-800 text-white/80 border-gray-700 hover:bg-gray-700'
                                            }`}
                                    >
                                        <span className="font-medium capitalize">
                                            {source} Strategy
                                            {source === 'ai' && ' (AI Generated)'}
                                            {source === 'user' && ' (Your Mission)'}
                                            {source === 'hybrid' && ' (Best for Consistency)'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Platform Selector */}
                        <div className='p-6 bg-gray-900 border border-gray-800 rounded-xl'>
                            <h3 className="text-lg font-semibold mb-3 text-white">2. Select Platforms</h3>
                            <p className="text-sm text-white/60 mb-4">Content will be optimized for selected platforms.</p>

                            <div className='grid grid-cols-2 gap-3'>
                                {['LinkedIn', 'X', 'Instagram', 'Reddit', 'Medium'].map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => togglePlatform(platform.toLowerCase())}
                                        className={`flex items-center justify-center py-3 rounded-lg border transition-colors ${selectedPlatforms.includes(platform.toLowerCase())
                                                ? 'bg-orange-900/30 text-orange-400 border-orange-500'
                                                : 'bg-gray-800 text-white/60 border-gray-700 hover:bg-gray-700'
                                            }`}
                                    >
                                        {selectedPlatforms.includes(platform.toLowerCase()) && <CheckCircle className="w-4 h-4 mr-1" />}
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGeneratePosts}
                            disabled={selectedPlatforms.length === 0}
                            className="w-full flex items-center justify-center px-6 py-4 bg-orange-500 text-white font-bold text-lg rounded-xl shadow-xl hover:bg-orange-600 transition disabled:bg-gray-700 disabled:cursor-not-allowed"
                        >
                            <LayoutGrid className="w-6 h-6 mr-3" />
                            Generate Content Now!
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StrategyDisplayPage;
