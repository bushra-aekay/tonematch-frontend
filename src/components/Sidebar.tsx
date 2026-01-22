'use client'

import React, { FC, useState } from "react";
import { LayoutDashboard, Folder, Lightbulb, TrendingUp, Settings, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface NavItemsProps {
    href: string;
    icon: React.ElementType;
    label: string;
    isNew?: boolean;
}

const NavItem: FC<NavItemsProps> = ({ href, icon: Icon, label, isNew }) => {
    const router = useRouter();
    const currentPath = usePathname();
    const isActive = currentPath === href;

    return (
        <a
            onClick={() => router.push(href)}
            className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors duration-150
                        ${isActive
                            ? 'bg-gray-800 text-orange-500 font-semibold'
                            : 'text-white/60 hover:bg-gray-800 hover:text-white/80'}`}
        >
            <div className={`p-1 rounded-full ${isActive ? 'bg-orange-500/20' : 'bg-gray-800'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <span>{label}</span>
            {isNew && (
                <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs font-bold">
                    +
                </span>
            )}
        </a>
    );
}

const Sidebar: FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg border border-gray-800 shadow-lg"
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <Menu className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed md:relative inset-y-0 left-0 z-40 w-64 flex flex-col justify-between border-r border-gray-800 bg-black shadow-2xl transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className="p-6 flex flex-col space-y-8">
                    {/* Logo */}
                    <div className="text-2xl font-bold mb-4">
                        <span className="text-white">Tone</span>
                        <span className="text-orange-500">Match</span>
                    </div>

                    {/* Nav items */}
                    <nav className="space-y-2">
                        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem href="/projects" icon={Folder} label="Projects" isNew={true} />
                        <NavItem href="/profile" icon={Lightbulb} label="Snap A" />
                        <NavItem href="/metrics" icon={TrendingUp} label="Metrics" />
                    </nav>
                </div>

                {/* Bottom section */}
                <div className="p-6 border-t border-gray-800">
                    <NavItem href="/settings" icon={Settings} label="Settings" />
                    <p className="text-xs text-white/50 mt-4">
                        hello@tonematch.com
                    </p>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
