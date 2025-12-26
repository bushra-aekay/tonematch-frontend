import LoginForm from "@/components/LoginForm";
import { FC } from "react";

const LoginPage: FC = () => {
    return(
        <div className="min-h-screen bg-black items-center justify-center flex">
            <div className="w-full flex flex-col justify-center items-center text-center">
            <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage;