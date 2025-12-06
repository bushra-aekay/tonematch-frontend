'use client'

import { ArrowRight } from "lucide-react";
import { ChangeEvent, FC, FormEvent, useState } from "react";

// Defining the structutr for ProjectData props
interface BusinessProfileStepProps {
    //onNext tells the component that owns the state(parent) that its time to move on to next step. the child (this file) calls it to submit data to its parent.
    onNext: (data: any) => void     // it returns nothing bc its job is js to send data to parent, not return a result.
    inititalData: any;     // holds prefilled data, often used when a user comes back or is editing a existing project, can be any datatype
}

// helper fn to check if req field is empty
const isRequired = (value: string | undefined): boolean => { //value passed is gon be a string or undef, and fn will return a boolean
    return !value || value.trim() === ''; //no value, undefined || empty spaces
};

const BusinessProfileStep: FC<BusinessProfileStepProps> = ({ onNext, inititalData}) => {

    // Local state to manage input fields
    const [data, setData] = useState({
        name: inititalData.name || "",
        targetAudience: inititalData.targetAudience || "",
        shortDescription: inititalData.shortDescription || "",
        industry: inititalData.industry || "",
        mission: inititalData.mission || "",
        websiteLink: inititalData.websiteLink || "",
        currentMarketing: inititalData.currentMarketing || "",
        platformsCurrentlyUsed: inititalData.platformsCurrentlyUsed || "",
        brandKeywords: inititalData.brandKeywords || "",
        voice: inititalData.voice || "",
    });
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev =>({...prev, [name]: value}));
    };

    const requiredFields: (keyof typeof data)[] = ['name', 'targetAudience','shortDescription']; // req fields based on backend model
    const isFormValid = requiredFields.every(field => !isRequired(data[field]))

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if(isFormValid) {
            onNext(data);
        }
    }

    return (
        <div className="bg-black p-10 rounder 2-xl shadow-2xl w-full">
            <h2 className="text-3xl font-bold text-white mb-6">
                Step 1: Business Details
            </h2>
            <p className="text-white mb-8">
                Tell us about your project to start generating your strategy.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white">
                        Project Name / Business Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={data.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border bprder-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Eg: Tonematch Marketing"
                    />
                </div>
                {/* short Description */}
                <div>
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                        Short Description (What do you actually do?) *
                    </label>
                    <textarea
                        name="shortDescription"
                        id="shortDescription"
                        value={data.shortDescription}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., A SaaS tool that ensures brand voice consistency across social media channels using AI."
                    />
                </div>
                {/* targetAudience */}
                <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-white">
                        Target Audience
                    </label>
                    <textarea
                        name="targetAudience"
                        id="targetAudience"
                        value={data.targetAudience}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="mt-1 block w-full px-4 py-2 border bprder-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe who you are trying to reach (e.g., Small business owners, age 25-45, in the US, struggling with content consistency)."                        />
                </div>
                
                {/* Industry */}
                <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-white">
                        Industry / Niche
                    </label>
                    <input
                        type="text"
                        name="industry"
                        id="industry"
                        value={data.industry}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-2 border bprder-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Eg: Consulting, SaaS, Financial Tech, E-Commerce"
                    />
                </div>
                {/* mission */}
                <div>
                    <label htmlFor="mission" className="block text-sm font-medium text-white">
                        Business Mission / Value Proposition
                    </label>
                    <textarea                        
                        name="mission"
                        id="mission"
                        value={data.mission}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full px-4 py-2 border bprder-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe who you are trying to reach (e.g., Small business owners, age 25-45, in the US, struggling with content consistency)."                        />
                </div>
                {/* Website Link (Optional) */}
                <div>
                    <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-700">
                        Website Link
                    </label>
                    <input
                        type="url"
                        name="websiteLink"
                        id="websiteLink"
                        value={data.websiteLink}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://www.yourbusiness.com"
                    />
                </div>

                {/* Current Marketing (Optional) */}
                <div>
                    <label htmlFor="currentMarketing" className="block text-sm font-medium text-gray-700">
                        Current Marketing Strategy
                    </label>
                    <textarea
                        name="currentMarketing"
                        id="currentMarketing"
                        value={data.currentMarketing}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., We focus heavily on LinkedIn thought leadership posts and weekly blog articles."
                    />
                </div>

                {/* Platforms Currently Used (Optional - simplified to string) */}
                <div>
                    <label htmlFor="platformsCurrentlyUsed" className="block text-sm font-medium text-gray-700">
                        Platforms Currently Used (Comma-separated)
                    </label>
                    <input
                        type="text"
                        name="platformsCurrentlyUsed"
                        id="platformsCurrentlyUsed"
                        value={data.platformsCurrentlyUsed}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., LinkedIn, Twitter, Blog"
                    />
                </div>
                
                {/* Brand Keywords (Optional - simplified to string) */}
                <div>
                    <label htmlFor="brandKeywords" className="block text-sm font-medium text-gray-700">
                        Core Brand Keywords (Comma-separated)
                    </label>
                    <input
                        type="text"
                        name="brandKeywords"
                        id="brandKeywords"
                        value={data.brandKeywords}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., brand consistency, content automation, voice AI"
                    />
                </div>
                
                {/* Voice Description (Optional - Placeholder) */}
                <div>
                    <label htmlFor="voice" className="block text-sm font-medium text-gray-700">
                        Existing Voice Description (If known)
                    </label>
                    <input
                        type="text"
                        name="voice"
                        id="voice"
                        value={data.voice}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Witty, Sarcastic, but highly Professional"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        If left blank, this will be generated after Step 2.
                    </p>
                </div>
                
                {/* Next button */}
                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        disabled={!isFormValid}
                        className={`flex items-center px-6 py-3 rounded-xl text-white font-semibold transition-colors
                            ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        Next
                        <ArrowRight className='w-5 h-5 ml-2'/>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default BusinessProfileStep