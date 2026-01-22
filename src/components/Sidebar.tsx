'use client'

import React, { FC, useState, useEffect } from "react";
import { LayoutDashboard, Folder, Settings, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface NavItemsProps {
    href: string;
    icon: React.ElementType;
    label: string;
    isNew?: boolean;
    disabled?: boolean;
}

const NavItem: FC<NavItemsProps> = ({ href, icon: Icon, label, isNew, disabled }) => {
    const router = useRouter();
    const currentPath = usePathname();

    // Check if current path matches or is a child route
    const isActive = currentPath === href ||
                     (href !== '/dashboard' && currentPath?.startsWith(href));

    // For dashboard, also highlight when on project routes
    const isDashboardActive = href === '/dashboard' &&
                              (currentPath === '/dashboard' || currentPath?.startsWith('/project'));

    const handleClick = () => {
        if (!disabled) {
            router.push(href);
        }
    };

    return (
        <a
            onClick={handleClick}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-colors duration-150
                        ${disabled
                            ? 'opacity-50 cursor-not-allowed text-white/30'
                            : (isActive || isDashboardActive)
                                ? 'bg-gray-800 text-orange-500 font-semibold cursor-pointer'
                                : 'text-white/60 hover:bg-gray-800 hover:text-white/80 cursor-pointer'
                        }`}
        >
            <div className={`p-1 rounded-full ${
                (isActive || isDashboardActive)
                    ? 'bg-orange-500/20'
                    : disabled
                        ? 'bg-gray-800/50'
                        : 'bg-gray-800'
            }`}>
                <Icon className="w-5 h-5" />
            </div>
            <span>{label}</span>
            {isNew && !disabled && (
                <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-orange-500 text-white text-xs font-bold">
                    +
                </span>
            )}
            {disabled && (
                <span className="ml-auto text-xs text-white/30">Soon</span>
            )}
        </a>
    );
}

const Sidebar: FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/auth/me`, {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data?.email) {
                    setUserEmail(response.data.email);
                }
            } catch (err) {
                console.error("Failed to fetch user data in sidebar:", err);
                // Fallback to default email if fetch fails
                setUserEmail('hello@tonematch.com');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // Close mobile menu when clicking outside or navigating
    const handleNavigation = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 rounded-lg border border-gray-800 shadow-lg"
                aria-label="Toggle menu"
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
                onClick={handleNavigation}
            >
                <div className="p-6 flex flex-col space-y-8">
                    {/* Logo */}
                    <div className="text-2xl font-bold mb-4">
                        <span className="text-white">Tone</span>
                        <span className="text-orange-500">Match</span>
                    </div>

                    {/* Nav items */}
                    <nav className="space-y-2">
                        <NavItem
                            href="/dashboard"
                            icon={LayoutDashboard}
                            label="Dashboard"
                        />

                        {/* Projects - Coming Soon */}
                        <NavItem
                            href="/projects"
                            icon={Folder}
                            label="Projects"
                            disabled={true}
                        />

                        {/* Future navigation items can be added here */}
                        {/*
                        <NavItem
                            href="/analytics"
                            icon={TrendingUp}
                            label="Analytics"
                            disabled={true}
                        />
                        <NavItem
                            href="/team"
                            icon={Users}
                            label="Team"
                            disabled={true}
                        />
                        */}
                    </nav>
                </div>

                {/* Bottom section */}
                <div className="p-6 border-t border-gray-800">
                    <NavItem
                        href="/settings"
                        icon={Settings}
                        label="Settings"
                        disabled={true}
                    />

                    {/* User Email - Dynamic */}
                    <div className="mt-4">
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-pulse h-3 w-32 bg-gray-800 rounded"></div>
                            </div>
                        ) : (
                            <p className="text-xs text-white/50 truncate" title={userEmail}>
                                {userEmail}
                            </p>
                        )}
                    </div>

                    {/* App Version or Additional Info */}
                    <p className="text-xs text-white/30 mt-2">
                        v1.0.0
                    </p>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
