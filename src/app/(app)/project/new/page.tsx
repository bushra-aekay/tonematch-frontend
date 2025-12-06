"use client"
import BusinessProfileStep from "@/components/BusinessProfileStep"
import ToneInputStep from "@/components/ToneInputStep"
import LoadingStep from "@/components/LoadingStep"
import { ArrowRight } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

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

const initialProjectData: ProjectData = {
    name: '', targetAudience: '', shortDescription: '',
    industry: '', mission: '', websiteLink: '', 
    currentMarketing: '', platformsCurrentlyUsed: '', 
    brandKeywords: '', voice: '',
    toneExamples: ['', '', ''],
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const NewProjectPage: FC = () =>{
    const router = useRouter();

    // tracking user's tone profile status
    const [hasToneProfile, setHasToneProfile] = useState<boolean | null> (null);

    const [currentStep, setCurrentStep] = useState(1);
    const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);

    // calculate total i.p circles needed based on tone profile status
    // If the tone profile exists (true), we only need 1 circle (Business Details).
    // If it doesn't exist (false), we need 2 circles (Business Details + Tone Input).
    const totalInputSteps = hasToneProfile === false ? 2 : 1;

    // check user's global tone profile status
    useEffect(() => {
        const checkToneStatus = async () => {
            // try{
            //     const response = await axios.get(`${BACKEND_URL}/tone/me`, {withCredentials: true });
            //     // assuming the backend returns a summary or a flag if the tone is set
            //     setHasToneProfile(!!response.data.toneSummary);
            // } catch (err){
            //     setHasToneProfile(false);
            // }
            
            // mock: assume user is new and has to set their tone
            setHasToneProfile(false);
        }
        checkToneStatus();
    }, []);

    // const handleNext = (data: Partial<ProjectData>) => {
    //     setProjectData(prev => ({...prev, ...data}));
    //     let nextStep = currentStep + 1;

    //     // if tone exists, skip it
    //     if (hasToneProfile === true && currentStep ===1){
    //         // go directly to step 3 (loading), skip 2
    //         nextStep = 3
    //     }
    //     if (currentStep <3) {
    //         setCurrentStep(nextStep);
    //     }
    // };

    // Handler for moving to the next step
    const handleNext = (data: any) => {
        setProjectData(prev => ({ ...prev, ...data }));
        setCurrentStep(prev => prev + 1);
    };

    // 🚨 NEW HANDLER: For moving back to the previous step
    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    // Handler for the final submission (from ToneInputStep or LoadingStep)
    const handleFinalSubmission = (data: any) => {
        setProjectData(prev => ({ ...prev, ...data }));
        setCurrentStep(3); // Move to Loading/Final Step
    };

    // conditional rendering of step 2 -- tone or summary
    const renderToneOrSummary = () => {
        if(hasToneProfile === false) {
            // render tone i/p card - user to provide posts
            return <ToneInputStep onNext={handleFinalSubmission} onBack={handleBack} initialData={projectData}/>;
        }  
        //  tone summary/modification card if tone alr exists
        return (
            <div className="bg-yellow-50 p-10 rounded-2xl w-full">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Tone Profile:
                </h2>
                <p className="text-amber-50 mb-6">
                    Your **Witty, Concise, Empathetic** tone profile will be used for this project.                
                </p>
                <div className="flex justify-between items-center pt-4">
                    <button 
                        // 🛑 Placeholder action to view or edit tone
                        onClick={() => router.push('/settings?tab=tone')} 
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Modify My Global Tone
                    </button>
                    <button
                        onClick={() => handleNext({})} // Skip to Loading Step (Step 3)
                        className="flex items-center px-6 py-3 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition"
                    >
                        Use Existing Tone & Generate
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    </div>
                </div>
        );
    };

    const renderStep = () => {
        if (hasToneProfile === null) {
            // initial loading state while checking status
            return(
                <div className="text-center p-12">
                    <p className="text-white">Checking if you have a pre-defined tone</p>
                </div>
            );
        }
        switch (currentStep) {
            case 1:
                return <BusinessProfileStep onNext={handleNext} inititalData={projectData}/>
             case 2:
                return renderToneOrSummary();
            case 3:
                return <LoadingStep projectData={projectData}/>   
            default:
                return <div>Something went wrong.</div>;
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-xl p-8">
                {renderStep()}
                {/* Step indicator circles */}
                {(currentStep === 1 || (currentStep ===2 && hasToneProfile === false)) && (
                    <div className="flex justify-center mt-6 space-x-2">
                        {Array.from({ length: totalInputSteps }).map((_, index) => (
                            <div 
                                key={index}
                                // index 0 is step 1, index 1 is step 2
                                className={`w-3 h-3 rounded-full transition-colors duration-200 
                                    ${index + 1 === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NewProjectPage;