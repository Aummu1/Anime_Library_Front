"use client"
import React, { useState, useRef, useEffect } from 'react';
import UserProfileDropdown from './user-profile-dropdown';

// --- Icons ---
// Using SVG components for icons, similar to lucide-react
const MenuIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);

const MountainIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
);

// --- Main Header Component ---
const Header = () => {
    // State for the main mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // State for desktop dropdowns
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    // State to manage which dropdown is open (for mobile)
    const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

    // Refs to detect outside clicks
    const featuresDropdownRef = useRef<HTMLDivElement>(null);
    const avatarDropdownRef = useRef<HTMLDivElement>(null);
    const notificationsDropdownRef = useRef<HTMLDivElement>(null);

    // --- Data for Navigation ---
    const navLinks = [

        { href: "/", label: "Home" },
        // { href: "/anime/edit", label: "Manage" },
    ];

    // Effect to handle clicks outside of dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (featuresDropdownRef.current && !featuresDropdownRef.current.contains(event.target as Node)) {
                setIsFeaturesOpen(false);
            }
            if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target as Node)) {
                setIsAvatarOpen(false);
            }
            if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to toggle mobile dropdowns
    const toggleMobileDropdown = (label: string) => {
        setOpenMobileDropdown(openMobileDropdown === label ? null : label);
    };

    return (
        <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo & Desktop Nav */}
                    <div className="flex items-center gap-10">
                        <a href="#" className="flex items-center gap-2 flex-shrink-0">
                            <MountainIcon className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Acme Inc</span>
                        </a>
                        <nav className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) =>
                            (
                                <a key={link.label} href={link.href} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300">
                                    {link.label}
                                </a>
                            )
                            )}
                        </nav>
                    </div>

                    {/* Right: Notification + Avatar + Mobile Button */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative hidden sm:block" ref={notificationsDropdownRef}>
                            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                                <span className="sr-only">View notifications</span>
                                <BellIcon className="h-6 w-6" />
                            </button>
                            <div className={`absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-opacity duration-300 ${isNotificationsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                <div className="p-3">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</p>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700">
                                    <a href="#" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <p className="font-medium">New message</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">You have a new message from Jane Doe.</p>
                                    </a>
                                    <a href="#" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <p className="font-medium">Server update</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Server #1 will be updated at 3:00 AM.</p>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Replaced Avatar dropdown with new UserProfileDropdown */}
                        <div className="hidden sm:block">
                            <UserProfileDropdown />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800" id="mobile-menu">
                    <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            (
                                <a key={link.label} href={link.href} className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                                    {link.label}
                                </a>
                            )
                        ))}
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                            <div className="flex items-center justify-between px-3">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <UserProfileDropdown />
                                    </div>
                                </div>
                                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;