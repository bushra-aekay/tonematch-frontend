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
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 sm:p-10 rounded-3xl border border-gray-800/50 w-full max-w-3xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Business Details
                </h2>
                <p className="text-white/60 text-sm">
                    Tell us about your project to start generating your strategy
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Project Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                        Project Name <span className="text-orange-400">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={data.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="e.g. ToneMatch Marketing"
                    />
                </div>

                {/* short Description */}
                <div>
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-white/90 mb-2">
                        Short Description <span className="text-orange-400">*</span>
                    </label>
                    <textarea
                        name="shortDescription"
                        id="shortDescription"
                        value={data.shortDescription}
                        onChange={handleChange}
                        required
                        rows={2}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
                        placeholder="What do you do? e.g. A SaaS tool for brand voice consistency"
                    />
                </div>

                {/* targetAudience */}
                <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-white/90 mb-2">
                        Target Audience <span className="text-orange-400">*</span>
                    </label>
                    <textarea
                        name="targetAudience"
                        id="targetAudience"
                        value={data.targetAudience}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
                        placeholder="Who are you trying to reach? e.g. Small business owners, age 25-45"
                    />
                </div>

                {/* Industry */}
                <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-white/90 mb-2">
                        Industry / Niche
                    </label>
                    <input
                        type="text"
                        name="industry"
                        id="industry"
                        value={data.industry}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="e.g. SaaS, Consulting, E-Commerce"
                    />
                </div>

                {/* mission */}
                <div>
                    <label htmlFor="mission" className="block text-sm font-medium text-white/90 mb-2">
                        Mission / Value Proposition
                    </label>
                    <textarea
                        name="mission"
                        id="mission"
                        value={data.mission}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
                        placeholder="What's your core value proposition?"
                    />
                </div>

                {/* Website Link (Optional) */}
                <div>
                    <label htmlFor="websiteLink" className="block text-sm font-medium text-white/90 mb-2">
                        Website Link
                    </label>
                    <input
                        type="url"
                        name="websiteLink"
                        id="websiteLink"
                        value={data.websiteLink}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="https://yourbusiness.com"
                    />
                </div>

                {/* Current Marketing (Optional) */}
                <div>
                    <label htmlFor="currentMarketing" className="block text-sm font-medium text-white/90 mb-2">
                        Current Marketing Strategy
                    </label>
                    <textarea
                        name="currentMarketing"
                        id="currentMarketing"
                        value={data.currentMarketing}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
                        placeholder="e.g. LinkedIn thought leadership and weekly blog articles"
                    />
                </div>

                {/* Platforms Currently Used (Optional - simplified to string) */}
                <div>
                    <label htmlFor="platformsCurrentlyUsed" className="block text-sm font-medium text-white/90 mb-2">
                        Current Platforms
                    </label>
                    <input
                        type="text"
                        name="platformsCurrentlyUsed"
                        id="platformsCurrentlyUsed"
                        value={data.platformsCurrentlyUsed}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="e.g. LinkedIn, Twitter, Blog"
                    />
                    <p className="text-xs text-white/40 mt-1.5">
                        Separate with commas
                    </p>
                </div>

                {/* Brand Keywords (Optional - simplified to string) */}
                <div>
                    <label htmlFor="brandKeywords" className="block text-sm font-medium text-white/90 mb-2">
                        Core Keywords
                    </label>
                    <input
                        type="text"
                        name="brandKeywords"
                        id="brandKeywords"
                        value={data.brandKeywords}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="e.g. brand consistency, content automation, AI"
                    />
                    <p className="text-xs text-white/40 mt-1.5">
                        Separate with commas
                    </p>
                </div>

                {/* Voice Description (Optional - Placeholder) */}
                <div>
                    <label htmlFor="voice" className="block text-sm font-medium text-white/90 mb-2">
                        Brand Voice
                    </label>
                    <input
                        type="text"
                        name="voice"
                        id="voice"
                        value={data.voice}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                        placeholder="e.g. Witty, professional, empathetic"
                    />
                    <p className="text-xs text-white/40 mt-1.5">
                        If left blank, we'll generate this for you
                    </p>
                </div>

                {/* Next button */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`flex items-center px-8 py-3 rounded-xl text-white font-semibold transition-all
                            ${isFormValid
                                ? 'bg-orange-500/90 hover:bg-orange-500 shadow-lg shadow-orange-500/20'
                                : 'bg-gray-800 cursor-not-allowed opacity-50'}`}
                    >
                        Continue
                        <ArrowRight className='w-5 h-5 ml-2'/>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default BusinessProfileStep
