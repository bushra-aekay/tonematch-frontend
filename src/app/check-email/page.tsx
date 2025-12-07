"use client"

import React, { FC, Suspense } from "react";
import { useSearchParams } from "next/navigation"; //hook to read url parameters

const CheckEmailContent: FC = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') // read the email parameter passed from login form

    return(
        <div className="min-h-screen bg-black p-8">
            <div className="flex justify-center items-start pt-25">
                <div className="max-w-2xl mx-auto">
                <h2 className="text-5xl font-extrabold text-white mb-4 ">
                    Check your inbox!
                </h2>
                <p className="mb-2">
                    We've sent a secure, temporary login link to {email || 'your email address'}
                </p>                
                <p className="mt-1">
                    Please click the link in the email for passwordless login. It will expire in 10 minutes.
                    
                </p>
                <p className="font-extralight mt-15">
                    Didn't receceive it? Check your spam folder 
                </p>
                    <a
                        href="/login"
                        className="text-blue-600 hover:text-blue-100 mt-1"
                    >
                        Go back to login screen
                    </a>
            </div>
            </div>
        </div>
    )
}

const CheckEmailPage: FC = () => {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
            <CheckEmailContent />
        </Suspense>
    )
}

export default CheckEmailPage;