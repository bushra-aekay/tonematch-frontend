// file to show loading and sends data to backend

import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface ProjectData {
// required
    name: string;
    targetAudience: string;
    shortDescription: string;
    // optional
    industry: string;
    mission: string;
    websiteLink: string;
    currentMarketing:string;
    platformsCurrentlyUsed: string; // Will be a comma-separated string on frontend for MVP simplicity
    brandKeywords: string // Will be a comma-separated string on frontend for MVP simplicity
    voice: string;
    // tone field
    toneExamples: string[];
}

interface LoadingStepProps{
    projectData: ProjectData;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const dynamicMessages = [
    "Analyzing your target audience and mission...",
    "Deep dive into your tone examples for authenticity...",
    "Generating strategic pillars with the Gemini AI...",
    "Refining content suggestions for consistency...",
    "Finalizing your personalized ToneMatch Strategy..."   
];

const LoadingStep: FC<LoadingStepProps> = ({ projectData }) => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(dynamicMessages[0]);
    const [timeLeft, setTimeLeft] = useState(60); // Start with an estimate
    const [error, setError] = useState<string | null>(null);
    const [minorError, setMinorError] = useState<string | null>(null);

    const handleFileSubmission = async (data: ProjectData) => {
        setError(null);
        console.log("submitting final project data")
        // project data into the structure bacjend expects.
        // small obj containing only biz details for project creation API
        const finalPayload = {
            name: data.name,
            target_audience: data.targetAudience,            
            short_desc: data.shortDescription,
            industry: data.industry || null,
            mission: data.mission || null,
            website_link: data.websiteLink || null,
            current_marketing: data.currentMarketing || null,
            voice: data.voice || null,

            // converting strings into list for platforms and keywords
            platforms_currently_used: data.platformsCurrentlyUsed
            ? data.platformsCurrentlyUsed.split(',').map(s => s.trim()).filter(s=> s.length>0)
            : null,
            brand_keywords: data.brandKeywords 
            ?  data.brandKeywords.split(',').map(s => s.trim()).filter(s=> s.length>0)
            : null,
        };
        let newProjectId: string | null = null;
        try {
            // This would hit the POST /business/save-profile endpoint
            const response = await axios.post(`${BACKEND_URL}/business/save-business-profile`, finalPayload, {withCredentials: true});
            newProjectId = response.data.id; //Backend sends the project ID
            
            // tone analysis submission
            // check if toneExamples were collected, i.e the user is new
            if(data.toneExamples){
                console.log("submitting tone for analysis");
                try {
                    await axios.post(`${BACKEND_URL}/tone/analyze-tone`, { posts: data.toneExamples }, { withCredentials: true});
                    console.log("Tone Analysis successfully triggered and saved.");
                    // update this logic
                } catch (toneError: any) {
                    console.error("Tone Analysis Failed but proj saved:", toneError);
                    const errorMessage =toneError.response?.data?.detail || 'Failed to analyze your tone. Please try again.'
                    setMinorError(errorMessage);
                    // setMinorError("Tone analysis failed. Using default tone for now.");                    return;   
                }
            }

            // Mock progress bar 
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                    clearInterval(interval);
                    // router.pish(`/project/${newProjectId}/strategy);
                    router.push(`${newProjectId}/strategy`);//placeholder redirect
                    return 100;
                }
                // faking variable progress speed
                return prev + (Math.random()*(10-2) + 2); 
                });
                const messageIndex = Math.floor((progress/100)*dynamicMessages.length);
                setCurrentMessage(dynamicMessages[Math.min(messageIndex, dynamicMessages.length - 1)]);
                setTimeLeft(prev => Math.max(0, prev - 1));
            }, 1000);

            return () => clearInterval(interval) //cleanup

        } catch (submitError: any) {
            console.error(submitError);
            const errorMessage = submitError.response?.data?.detail || "An error occurred during project setup. Please check backend connection.";
            setError(errorMessage);
            setError("Failed to create. Please try again later.")
        }
        // api logic
        
        // Placeholder for project profile submission.
        
    };

    useEffect(()=>{
        handleFileSubmission(projectData);
    }, []);

    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-12 w-full max-w-lg text-center">
                <h2 className={`text-3xl font-bold mb-8${error ? 'text-red-600' : 'text-white'}`}>
                    {error ? 'Submission failed' : 'generating your strategy'}
                </h2>
                {error ? (
                    // If the 'error' state has text in it, show the error message section.
                    <div className="text-red-500 mb-6">
                        {/* Container for the error message, colored red. */}
                        <p>{error}</p>
                        {/* Displays the error message text. */}
                        <button 
                            onClick={() => router.push('/dashboard')}
                            // When clicked, navigates the user to the dashboard page.
                            className="mt-4 text-blue-600 hover:underline"
                        >
                            {/* Styles the button to look like a blue link. */}
                            Go back to Dashboard
                            {/* Text for the error recovery button. */}
                        </button>
                    </div>
                ) : (
                    // If there is NO error, show the loading bar and messages.
                    <>
                        {/* Fragment: allows grouping multiple HTML elements without adding an extra div. */}
                        {/* Loading Text */}
                        <p className="text-lg font-bold text-blue-600 mb-4 h-12 flex items-center justify-center">
                            {/* Displays the current message in large, bold blue text. */}
                            {currentMessage}
                        </p>

                        {/* Loading Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            {/* The background track for the loading bar. */}
                            <div 
                                className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                                // The inner bar, colored blue. The 'transition' makes the movement smooth.
                                style={{ width: `${Math.min(100, progress)}%` }}
                                // Sets the width of the bar based on the 'progress' state variable.
                            ></div>
                        </div>
                        
                        {/* Approx Time Left */}
                        <div className="flex justify-end text-right">
                            {/* Aligns the time text to the right side. */}
                            <p className="text-xs text-gray-500">
                                {/* Displays the time and progress info in small, light gray text. */}
                                {Math.floor(progress)}% Complete | Approx {timeLeft} seconds left
                            </p>
                        </div>
                        
                        {progress >= 100 && (
                            // If the progress is 100 or more, show the completion message.
                            <p className="text-green-600 mt-6 font-semibold">
                                {/* Displays the success message in green. */}
                                Generation Complete! Redirecting...
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
export default LoadingStep;