"use client";

import React, { FC, FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const LoginForm: FC = () =>{
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

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
        <div className="w-full max-w-sm p-8">
            <h2 className="text-2xl font-bold mb-6 text-white">Log into ToneMatch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-white-500">Enter your email</p>
            <label htmlFor="email">
                Email Address
            </label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-base"
            />
            {error && <p>{error}</p>}
            <button
                type="submit"
                disabled={isLoading || !email}
            >
                {isLoading? 'sending link' : 'send link'}
            </button>
            </form>
        </div>
    )
}

export default LoginForm