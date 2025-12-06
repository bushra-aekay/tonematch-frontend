import React, { FC } from "react";
import { LayoutDashboard, Folder, Lightbulb, TrendingUp, Settings, Icon } from "lucide-react";
import { useRouter,usePathname } from "next/navigation";

interface NavItemsProps {
    href: string;
    icon: React.ElementType;
    label: string;
    isNew?:boolean;
}

const NavItem: FC<NavItemsProps> = ({ href, icon: Icon, label, isNew }) => {
    const router = useRouter();
    const currentPath = usePathname();
    const isActive = currentPath === href;

    return (
        <a
            onClick={()=> router.push(href)}
            className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors duration-150
                        ${isActive ? 'bg-gray-200 text-gray-900 font-semibold':'text-gray-600 hover:bg-gray-100'}`}
        >
            <div className="p-1 rounded full bg-gray-300">
                <Icon className = "w-5 h-5"/>
            </div>
            <span>{label}</span>
            {isNew && (
                <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    +
                </span>
            )}
        </a>
    )
}

const Sidebar: FC = () => {
    return(
        <div className="w-64 flex flex-col justify-between border-r border-gray-200 bg-white shadow-lg">
            <div className="p-6 flex flex-col space-y-8">
                {/* logo */}
                <div className="text-2x; font-bold text-gray-900 mb-4">
                    Tone<span className="text-blue-600">Match</span>
                </div>
                {/* Nav items */}
                <nav className="space-y-2">
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Dasboard" />
                    <NavItem href="/projects" icon={Folder} label="Projects" isNew={true} />
                    <NavItem href="/profile" icon={Lightbulb} label="Snap A" />
                    <NavItem href="/metrics" icon={TrendingUp} label="Metrics" />
                </nav>
            </div>
            {/* Bottom section */}
            <div className="p-6 border-t border-gray-100">
                <NavItem href="/settings" icon={Settings} label="Settings" />
                <p className="text-xs text-gray-400 mt-4">
                    hellp@tonematch.com
                </p>
            </div>
        </div>
    )
}

export default Sidebar;