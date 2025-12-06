'use client'
import axios from 'axios';
import { Zap, LayoutGrid, CheckCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { platform } from 'os';
import { FC, useEffect, useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type StrategySource = 'ai' | 'user' | 'hybrid';

interface ProjectData {
    project_id:string;
    name: string;
    mission: string; // user defined strategy
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
    useEffect(()=> {
        const projectId = params.id as string
        let intervalId: NodeJS.Timeout // varaible to hold the interval id
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/business/${projectId}`, { withCredentials: true });
                const currentProjectData: ProjectData = response.data
                setProject(currentProjectData)

                if (currentProjectData.ai_strategy_status === 'COMPLETED' || 
                    currentProjectData.ai_strategy_status === 'FAILED') {
                    clearInterval(intervalId) //// If job is done or failed, stop polling
                }
            } catch (err) {
                console.error("failed to fetch project.", err);
                clearInterval(intervalId); // Stop polling on error
                router.push('/dashboard');
            }
        };
        if (projectId) {
            fetchProject();
            intervalId = setInterval(fetchProject, 7000); //every 7 secs
        }
        // 3. CLEANUP: Clear the interval when the component unmounts or dependencies change
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
        // setting mock data
        // setProject(mockProject);
    }, [params.id]);

    // Platform selection
    const togglePlatform = (platform: string) => {
        setSelectedPlatforms(prev => 
            prev.includes(platform)
                ? prev.filter(p => p !== platform) //deselection logic.
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
            // define this fully later
            project_id: project?.project_id,
            strategy_selected: selectedSource,
            platforms: selectedPlatforms
        };
        console.log('starting post gen', finalGenerationPayload, project);

        // /generate/posts endpoint code
        
        try {
            // This is the long-running call that triggers the background worker
            const response = await axios.post(`${BACKEND_URL}/posts/generate-posts`, finalGenerationPayload, { withCredentials: true });
            
            const batchId = response.data.batch_id
            // Backend should return a 200 OK immediately, confirming the worker started.
            
            // Now, we simulate the wait time for the background worker to finish
            // This mock promise replaces the need for a complex polling mechanism for now.
            // await new Promise(resolve => setTimeout(resolve, 30000)); // Simulate 30 seconds wait
            
            setIsGenerating(false);
            // Redirect to the generated content page using the project ID
            router.push(`/project/${project.project_id}/content?batchId=${batchId}`);
            
        } catch (error) {
            console.error("Post Generation API Failed:", error);
            setIsGenerating(false);
            // TODO: Display a user-friendly error message here
            alert("Failed to start post generation. Please check the API connection.");
        }
        

        // console.log("MOCK: Starting Post Generation with Payload:", finalGenerationPayload);
        // // mock response time
        // await new Promise(resolve => setTimeout(resolve,5000));
        // // mock
        // setIsGenerating(false)
        // router.push(`/project/${project?.id}/content`);
    };

    const isStrategyReady = project?.ai_strategy_status === "COMPLETED";
    const isLoading = (
        project?.ai_strategy_status === "PENDING" || 
        project?.ai_strategy_status ==="IN_PROGRESS"
    )
    if (!project) {
        return <div className="p-8 text-center text-gray-500">Loading project details...</div>;
    }

    
    // If the generation process has started, show the loading step
    if (isGenerating) {
        // 🛑 Reuse the LoadingStep component logic with new messages
        return <div className="p-8 text-center text-gray-500">Loading Posts... (We'll use a clean component here)</div>
    }

    return(
        <div className='p-10 max-w-6xl mx-auto'>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                {project.name} Strategy Ready!
            </h1>
            <p className="text-gray-500 mb-8">
                Review your generated strategy and select your preferences for content generation.
            </p>
            {/* --- CONDITIONAL UI BLOCK --- */}
            {isLoading && (
                <div className="bg-white p-10 rounded-lg shadow-xl text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">
                        Generating Core Strategy...
                    </h2>
                    <p className="text-gray-500 mt-2">
                        This may take a minute as the AI analyzes your profile. Please wait or come back later.
                    </p>
                </div>
            )}
            
            {project.ai_strategy_status === 'FAILED' && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
                    <p className="font-bold">Generation Failed</p>
                    <p>The AI failed to generate a strategy. Please review your profile data and try again.</p>
                </div>
            )}
            {isStrategyReady && (
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* strategy content display */}
                <div className='lg:col-span-2 p-6 border border-yellow-400'>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-purple-600" />
                        AI Strategy Summary
                    </h2>
                    {/* render ai content */}
                    <div className='prose max-w-none text-black'>
                        {project.ai_suggested_strategy ? (
                           <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto border border-dashed border-gray-300">
                                {JSON.stringify(project.ai_suggested_strategy, null, 2)}
                            </pre> 
                        ):(
                            <p className="text-red-500">AI strategy content is still pending...</p>
                        )}
                    </div>
                </div>
                {/* Control panel */}
                <div className='lg:col-span-1 spac-y-8'>
                    <h3 className="text-lg font-semibold mb-3">1. Select Strategy Source</h3>
                    <p className="text-sm text-gray-500 mb-4">Choose the foundation for your content tone and focus.</p>
                        
                    {/* Radio Buttons */}
                    <div className='space-y-3'>
                        {['ai', 'user', 'hybrid'].map(source => (
                            <button
                                key={source}
                                onClick={()=> setSelectedSource(source as StrategySource)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                        selectedSource === source
                                            ? 'bg-blue-500 text-white border-blue-600 shadow-md'
                                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
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
                
                {/* B. Platform Selector */}
                <div className='p-6 border border-gray-200'>
                    <h3 className="text-lg font-semibold mb-3">2. Select Platforms</h3>
                    <p className="text-sm text-gray-500 mb-4">Content will be optimized for selected platforms.</p>

                    {/* platform checkboxes */}
                    <div className='grid grid-cols-2 gap-3'>
                        {['LinkedIn', 'X', 'Instagram', 'Reddit', 'Medium'].map(platform => (
                            <button
                                key={platform}
                                onClick={() => togglePlatform(platform.toLowerCase())}
                                className={`flex items-center justify-center py-3 rounded-lg border transition-colors ${
                                    selectedPlatforms.includes(platform.toLowerCase())
                                        ? 'bg-green-100 text-green-800 border-green-500'
                                        : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                {selectedPlatforms.includes(platform.toLowerCase()) && <CheckCircle className="w-4 h-4 mr-1" />}
                                {platform}
                            </button>                                
                        ))}
                    </div>
                </div>
                {/* generate buttton */}
                <button
                    onClick={handleGeneratePosts}
                    disabled={selectedPlatforms.length === 0}
                    className="w-full flex items-center justify-center px-6 py-4 bg-purple-600 text-white font-bold text-lg rounded-xl shadow-xl hover:bg-purple-700 transition disabled:bg-gray-400"
                >
                    <LayoutGrid className="w-6 h-6 mr-3" />
                    Generate Content Now!
                </button>
            </div>
            )}
            
        </div>
    )
}

export default StrategyDisplayPage


// mock data
// const mockProject: Project = {
//     id: '123-abc',
//     name: "tonematch launch campaign",
//     mission: "Our goal is to provide SaaS founders with tools that automate their brand voice consistency across all channels.",
//     strategy_content: `
//         ## AI-Generated Strategy: The Authority Framework
//         ### 1. Positioning & Tone
//         * **Core Tone:** Authoritative, Witty, and Direct.
//         * **Key Message:** Consistency is the new velocity.
//         ### 2. Content Pillars
//         * **Pillar A (Education):** Tutorials on brand voice mapping. (60%)
//         * **Pillar B (Proof):** Case studies on successful content automation. (30%)
//         * **Pillar C (Engagement):** Quick polls on content struggles. (10%)
//     ` 
// };