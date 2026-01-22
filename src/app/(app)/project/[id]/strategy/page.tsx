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
        <div className='p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto'>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                    {project.name}
                </h1>
                <p className="text-white/60">
                    Review your generated strategy and configure content generation
                </p>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 p-10 rounded-2xl shadow-xl text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-white">
                        Generating Strategy...
                    </h2>
                    <p className="text-white/60 mt-2">
                        AI is analyzing your profile. This may take a minute.
                    </p>
                </div>
            )}

            {/* Failed State */}
            {project.ai_strategy_status === 'FAILED' && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl">
                    <p className="font-bold text-lg">Generation Failed</p>
                    <p className="text-white/80">The AI failed to generate a strategy. Please review your profile and try again.</p>
                </div>
            )}

            {/* Ready State */}
            {isStrategyReady && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Strategy Content Display - 2 columns */}
                    <div className='lg:col-span-2 bg-gray-900/50 backdrop-blur-sm p-6 border border-gray-800/50 rounded-2xl shadow-lg'>
                        <div className="flex items-center mb-4">
                            <Zap className="w-6 h-6 mr-2 text-orange-400" />
                            <h2 className="text-2xl font-bold text-white">
                                AI Strategy Summary
                            </h2>
                        </div>
                        <div className='prose max-w-none'>
                            {project.ai_suggested_strategy ? (
                                <pre className="bg-gray-800/50 p-4 rounded-xl text-sm whitespace-pre-wrap overflow-x-auto border border-gray-700/50 text-white/90">
                                    {JSON.stringify(project.ai_suggested_strategy, null, 2)}
                                </pre>
                            ) : (
                                <p className="text-red-400">AI strategy content is still pending...</p>
                            )}
                        </div>
                    </div>

                    {/* Control Panel - 1 column */}
                    <div className='lg:col-span-1 space-y-4'>
                        {/* Strategy Source Selection */}
                        <div className='bg-gray-900/50 backdrop-blur-sm p-5 border border-gray-800/50 rounded-2xl shadow-lg'>
                            <h3 className="text-base font-semibold mb-2 text-white">Strategy Source</h3>
                            <p className="text-xs text-white/50 mb-4">Choose your content foundation</p>

                            <div className='space-y-2'>
                                {[
                                    { value: 'ai', label: 'AI Generated', desc: 'Pure AI strategy' },
                                    { value: 'user', label: 'Your Mission', desc: 'Manual approach' },
                                    { value: 'hybrid', label: 'Hybrid', desc: 'Best balance' }
                                ].map(source => (
                                    <button
                                        key={source.value}
                                        onClick={() => setSelectedSource(source.value as StrategySource)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all ${selectedSource === source.value
                                                ? 'bg-orange-500/90 text-white border-orange-500 shadow-md'
                                                : 'bg-gray-800/50 text-white/80 border-gray-700/50 hover:bg-gray-800'
                                            }`}
                                    >
                                        <div className="font-medium">{source.label}</div>
                                        <div className="text-xs opacity-75">{source.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Platform Selector */}
                        <div className='bg-gray-900/50 backdrop-blur-sm p-5 border border-gray-800/50 rounded-2xl shadow-lg'>
                            <h3 className="text-base font-semibold mb-2 text-white">Select Platforms</h3>
                            <p className="text-xs text-white/50 mb-4">Choose where to publish</p>

                            <div className='grid grid-cols-2 gap-2'>
                                {['LinkedIn', 'X', 'Instagram', 'Reddit', 'Medium'].map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => togglePlatform(platform.toLowerCase())}
                                        className={`flex items-center justify-center py-2.5 px-2 rounded-xl border text-sm transition-all ${selectedPlatforms.includes(platform.toLowerCase())
                                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/50'
                                                : 'bg-gray-800/50 text-white/60 border-gray-700/50 hover:bg-gray-800'
                                            }`}
                                    >
                                        {selectedPlatforms.includes(platform.toLowerCase()) && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGeneratePosts}
                            disabled={selectedPlatforms.length === 0}
                            className="w-full flex items-center justify-center px-6 py-4 bg-orange-500/90 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all disabled:bg-gray-800 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            <LayoutGrid className="w-5 h-5 mr-2" />
                            Generate Content
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StrategyDisplayPage;
