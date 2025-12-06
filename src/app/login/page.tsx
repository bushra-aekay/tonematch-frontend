import LoginForm from "@/components/LoginForm";
import { FC } from "react";

const LoginPage: FC = () => {
    return(
        <div className="min-h-screen bg-black p-4">
            <div className="flex justify-center items-start pt-20">
            <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage;