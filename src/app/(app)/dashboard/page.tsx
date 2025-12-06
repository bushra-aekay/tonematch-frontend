'use client';
import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PlusSquare, LogOut } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const DashboardPage: FC = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    // const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(()=> {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/auth/me`, {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data?.email){
                    setUserEmail(response.data.email);
                    // setIsLoading(false);
                } else {
                    throw new Error("Invalid session data received.");
                }
            } catch (err: any) {
                console.error("Failed to fetch user data in dashboard.");  
            }
        };
        fetchUserData();
    },[]);

    const handleLogout = () => {
        router.push('/login');
    }

return (
        <div className="w-full">
            {/* 1. TOP BAR */}
            <header className="flex justify-between items-center h-16 px-8 border-b border-gray-200 bg-white shadow-sm">
                <p className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                    Feedback
                </p>
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                        Help
                    </p>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center text-sm text-red-500 hover:text-red-700 transition duration-150"
                    >
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                    </button>
                </div>
            </header>

            {/* 2. MAIN CONTENT AREA */}
            <main className="p-8">
                
                {/* Header & Button */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Projects
                    </h1>
                    <button 
                        onClick={() => router.push('/project/new')} 
                        className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                    >
                        <PlusSquare className="w-5 h-5 mr-2" />
                        Create New Project
                    </button>
                </div>
                
                {/* Welcome Message */}
                {userEmail && (
                    <p className="text-gray-500 mb-6">
                        Welcome back, {userEmail}! Here are your ongoing projects.
                    </p>
                )}

                {/* Project Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProjectCard 
                        title="Project X - Launch Campaign"
                        metricValue="5.8K"
                        metricLabel="Views"
                        status="not published"
                    />
                    <ProjectCard 
                        title="Blog Content Strategy"
                        metricValue="22"
                        metricLabel="Articles"
                        status="published"
                    />
                    <ProjectCard 
                        title="Social Media Tones"
                        metricValue="1.2M"
                        metricLabel="Reach"
                        status="published"
                    />
                </div>
            </main>
        </div>
    );
}

export default DashboardPage


// 'use client'

// import axios from "axios";
// import { useRouter } from "next/navigation";
// import React, { FC, useEffect, useState } from "react";
// import Sidebar from "@/components/Sidebar";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const DashboardPage: FC = () => {
//     const [userEmail, setUserEmail] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const router = useRouter();

//     useEffect(()=> {
//         const fetchUserData = async () => {
//             try {
//                 const response = await axios.get(`${BACKEND_URL}/auth/me`, {
//                     withCredentials: true,
//                 });
//                 if (response.status === 200 && response.data?.email){
//                     setUserEmail(response.data.email);
//                     setIsLoading(false);
//                 } else {
//                     throw new Error("Invalid session data received.");
//                 }
//             } catch (err: any) {
//                 console.error("Auth failed", err.response?.status);
//                 router.replace('/login')
//             }
//         };
//         fetchUserData();
//     },[router]);

//     if (isLoading) {
//         return(
//             <div className="min=h-screen flex items-center justify-center">
//                 <p>Loading Dashboard..</p>
//             </div>
//         )
//     }

    

//     return(
//         <div className="min-h-screen bg-gray-100 p-8">
//             <Sidebar/>
//             <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
//                 <h1 className="text-3xl font-bold text-gray-800 mb-4">
//                     Welcome to ToneMatch, {userEmail}! 🎉
//                 </h1>
//                 <p className="text-gray-600 mb-6">
//                     This confirms your secure login session is active.
//                 </p>
                
//                 {/* Placeholder for the Tone Card (as discussed) */}
//                 <div className="border border-dashed border-gray-300 p-8 rounded-lg text-center">
//                     <h3 className="text-xl font-semibold mb-3">
//                         One Final Step: Define Your Voice
//                     </h3>
//                     <p className="text-gray-500 mb-4">
//                         We need your unique writing examples to personalize your strategy.
//                     </p>
//                     <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700">
//                         Launch My Strategy
//                     </button>
//                 </div>

//                 <div className="mt-8">
//                     <button 
//                         onClick={() => router.push('/login')} // Simple redirect placeholder for logout
//                         className="text-red-500 hover:text-red-700 font-medium"
//                     >
//                         Log Out (Simulated)
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default DashboardPage