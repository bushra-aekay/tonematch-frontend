"use client";

import React, { FC, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const LoginForm: FC = () =>{
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();
        setError('')
        setIsLoading(true);
        try{
            // calling backend link request endpoint
            const response = await axios.post(`${BACKEND_URL}/auth/request-link`, {
                email: email
            });

            if ((response.status === 200)) {
                // Redirect to waiting screen
                router.push(`/check-email?email=${encodeURIComponent(email)}`)
            } 
        }catch(err: any){
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to send link. Please check ur email and try again');
        } finally {
            setIsLoading(false);
        }
    }
    
    return(
        <div className="max-w-2xl w-full items-center mx-auto">
            <h2 className="text-6xl font-bold tracking-tight mb-8 text-white text-shadow-orange-600 md:whitespace-nowrap">Log Into ToneMatch</h2>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <p className="text-2xl m-2 font-thin italic"> Enter your Email Address</p>
            <div className="relative w-full max-w-sm mx-auto">
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pr-14 pl-4 p-3 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-base"
            />
            <button
                type="submit"
                disabled={isLoading || !email}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white text-black flex items-center justify-center transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isLoading ? (
                <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
                "→"
            )}
            </button>
            </div>
            <p className="text-xs text-white/50 mt-2">
                By entering your email, you agree to our Terms & Conditions and Privacy Policy.
            </p>
            {error && <p className="text-sm text-red-400 ">{error}</p>}
            </form>
        </div>
    )
}

export default LoginForm