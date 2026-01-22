'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ProtectedLayout: FC<{ children: ReactNode}> = ({ children }) => {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/auth/me`, {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data?.email) {
                    setIsAuth(true);
                }else{
                    // This block technically shouldn't be hit with a proper 401/403 setup,
                    // but it's a fallback.
                    router.replace("/login");
                }
            } catch (error) {
                router.replace('/login');
            } finally {
                setIsLoading(false)
            }
        };
        checkAuth()
    }, [router]);

    if(isLoading){
        return(
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-lg text-white/80">Securing your session...</p>
                </div>
            </div>
        );
    }
    if(isAuth){
        return (
        <div className="flex h-screen bg-black">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
        )
    }
    // If not authenticated and not loading, show nothing (or the login redirect)
    return null;
}

export default ProtectedLayout;