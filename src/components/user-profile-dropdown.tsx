"use client"
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';


// Icons
const User = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const Settings = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6" />
        <path d="M1 12h6m6 0h6" />
    </svg>
);

const LogOut = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

// Dropdown Components
interface DropdownMenuProps {
    children: ReactNode;
    trigger: ReactNode;
}

const DropdownMenu = ({ children, trigger }: DropdownMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    }

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={handleTriggerClick} className="cursor-pointer">
                {trigger}
            </div>
            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-72 rounded-xl shadow-xl bg-white dark:bg-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in-0 zoom-in-95 p-2"
                    role="menu"
                    aria-orientation="vertical"
                >
                    {children}
                </div>
            )}
        </div>
    );
};

interface DropdownMenuItemProps {
    children: ReactNode;
    onClick?: () => void;
}

const DropdownMenuItem = ({ children, onClick }: DropdownMenuItemProps) => (
    <a
        href="#"
        onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            if (onClick) onClick();
        }}
        className="text-zinc-700 dark:text-zinc-300 group flex items-center px-3 py-2.5 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150"
        role="menuitem"
    >
        {children}
    </a>
);

const DropdownMenuSeparator = () => (
    <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />
);

export default function UserProfileDropdown() {
    const router = useRouter();

    const [user, setUser] = useState<{
        username: string;
        email: string;
        userId: number;
        imageBase64?: string | null;
    } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser({
                username: parsed.username,
                email: parsed.email,
                userId: parsed.userId,
                imageBase64: parsed.imageBase64 || null,
            });
        }
    }, []);

    // fallback initials
    const initials = user?.username
        ? user.username.split(' ')[0]?.charAt(0).toUpperCase()
        : 'U';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        alert('Logged out');
        router.push('/signin'); // หรือ /login
    };

    return (
        <div className="flex items-center justify-center font-sans p-8">
            <DropdownMenu
                trigger={
                    <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            {user?.imageBase64 ? (
                                <img
                                    src={user.imageBase64}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {user?.username || 'Guest'}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                {user?.email || 'Not logged in'}
                            </div>
                        </div>
                    </button>
                }
            >
                {/* Header */}
                <div className="px-3 py-3 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            {user?.imageBase64 ? (
                                <img
                                    src={user.imageBase64}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {user?.username || 'Guest'}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                {user?.email || 'Not logged in'}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Pro Plan</div>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <div className="py-1">
                    <DropdownMenuItem onClick={() => router.push(`/anime/profile/${user?.userId}`)}>
                        <User className="mr-3 h-4 w-4 text-zinc-500" />
                        Your Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/anime/settingpage/${user?.userId}`)}>
                        <Settings className="mr-3 h-4 w-4 text-zinc-500" />
                        Settings
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                <div className="py-1">
                    <DropdownMenuItem
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-4 w-4 text-zinc-500" />
                        Sign Out
                    </DropdownMenuItem>
                </div>
            </DropdownMenu>
        </div>
    );
}
