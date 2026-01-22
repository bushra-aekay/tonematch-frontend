'use client';
import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { PlusSquare, LogOut } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const DashboardPage: FC = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/auth/me`, {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data?.email) {
                    setUserEmail(response.data.email);
                } else {
                    throw new Error("Invalid session data received.");
                }
            } catch (err: any) {
                console.error("Failed to fetch user data in dashboard.");
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        router.push('/login');
    }

    return (
        <div className="w-full min-h-screen">
            {/* Top Bar */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 h-auto sm:h-16 px-4 sm:px-8 py-4 sm:py-0 border-b border-gray-800 bg-gray-900 shadow-lg">
                <p className="text-sm text-white/60 hover:text-white/80 cursor-pointer transition">
                    Feedback
                </p>
                <div className="flex items-center space-x-4">
                    <p className="text-sm text-white/60 hover:text-white/80 cursor-pointer transition">
                        Help
                    </p>
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-sm text-orange-500 hover:text-orange-400 transition duration-150"
                    >
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="p-4 sm:p-8">

                {/* Header & Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
                        Projects
                    </h1>
                    <button
                        onClick={() => router.push('/project/new')}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition duration-150"
                    >
                        <PlusSquare className="w-5 h-5 mr-2" />
                        Create New Project
                    </button>
                </div>

                {/* Welcome Message */}
                {userEmail && (
                    <p className="text-white/60 mb-8 text-lg">
                        Welcome back, <span className="text-white font-semibold">{userEmail}</span>! Here are your ongoing projects.
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

export default DashboardPage;
