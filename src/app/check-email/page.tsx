// Add resend email func later.
"use client"

import React, { FC, Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; //hook to read url parameters

const CheckEmailContent: FC = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') // read the email parameter passed from login form
    // const [resendDisabled, setResendDisabled] = useState(false);
    // const [seconds, setSeconds] = useState(30);
    // const [hasSubmitted, setHasSubmitted] = useState(true)
    // const [isResending, setIsResending] = useState(false)
    // const [error, setError] = useState('')
    
    // useEffect(()=> {
    //     setResendDisabled(true);
    //     setSeconds(30);
    // }, []); 
    //  useEffect(()=> {
    //     if (!resendDisabled) return 

    //     const interval = setInterval(() => {
    //         setSeconds((prev) => prev - 1)
    //     }, 1000)
    //     return () => clearInterval(interval);
    // }, [resendDisabled])

    // useEffect(()=> {
    //     if (seconds <= 0) {
    //         setResendDisabled(false)
    //     }
    // },[seconds])



    return(
        <div className="min-h-screen bg-black flex items-center justify-center">
        {/* <div className=""> */}
        <div className="max-w-2xl w-full items-center text-center mx-auto">
            {/* <div className="flex justify-center items-start pt-25"> */}
                {/* <div className="max-w-2xl mx-auto"> */}
                <h2 className="text-6xl font-bold tracking-tight text-white mb-4">
                    Check your inbox!
                </h2>
                <p className="text-white/80 mb-2">
                    We've sent a secure, temporary login link to {email || 'your email address'}
                </p>                
                <p className="text-white/60 text-sm">
                    Please click the link in the email to log in. It will expire in 10 minutes.
                    
                </p>
                <p className="font-extralight mt-15">
                    Didn't receceive it? Check your spam folder 
                </p>
                {/* {hasSubmitted && (
                <button
                    type="button"
                    // onClick={handleSubmit}
                    disabled={resendDisabled}
                    className="text-sm text-white/70 underline underline-offset-2 hover:text-white transition disabled:opacity-40 self-start"
                >
                    Resend email {resendDisabled && `(in ${seconds}s)`}
                </button>
                )} */}
                    <a
                        href="/login"
                        className="text-orange-400 hover:text-orange-200 underline underline-offset-2 transition mt-1"
                    >
                        Go back to login screen
                    </a>
            {/* </div> */}
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