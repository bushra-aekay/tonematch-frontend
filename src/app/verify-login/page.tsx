"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useState, Suspense } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const VerifyLoginContent: FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [statusMessage, setStatusMessage] = useState('Verifying your magic link...');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');

        if(!token){
            setStatusMessage("Error: Link token is missing");
            setIsError(true);
            return;
        }

        const verifyToken = async() => {
            try {
                const response = await axios.get(`${BACKEND_URL}/auth/verify`, {
                    params: { token },
                    withCredentials: true,
                })

                if (response.status === 200) {
                    setStatusMessage('Login successful! Redirecting to dashboard...');
                    setTimeout(()=>{
                        router.push('/dashboard');
                    }, 1500)
                } else {
                    throw new Error('Verification failed');
                }
            } catch (err: any) {
                console.error("Verification Error", err);
                setStatusMessage(err.response?.data?.detail || 'link expired or invalid. Please requext a new link.');
                setIsError(true);
                setTimeout(()=> {
                    router.push('/login');
                }, 4000);
            }            
        }; 
        verifyToken();
    }, [searchParams, router]);

    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md p-8 text-center">
                <h2 className={`text-5xl font-semibold mb-4 ${isError? 'text-red-600': 'text-orange-600'}`}>
                    {isError ? 'Login Failed':'Authentication in Progress'}
                </h2>
                <p className="">
                    {statusMessage}
                </p>
                {!isError && (
                    <div className="mt-6">
                        {/*Loading spinner */}
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    </div>
                )}
            </div>
        </div>
    )
}

const VerifyLoginPage: FC = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
            <VerifyLoginContent />
        </Suspense>
    )
}

export default VerifyLoginPage;