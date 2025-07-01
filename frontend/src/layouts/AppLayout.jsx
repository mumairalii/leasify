import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useState } from 'react'; // Added useState

// --- Imports for Icons from lucide-react ---
import { Home, Wrench, Bell, User, Search, LogOut, Menu, Building2, MessageSquare, Settings, ChevronLeft } from "lucide-react";
import {  Users } from "lucide-react";
// --- Imports for shadcn/ui Components ---
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Uncommented Tooltip

// --- Import for the Theme Toggle Button ---
import { ThemeToggleButton } from '../components/ThemeToggleButton';

function AppLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Added state for sidebar collapse

    const onLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // A reusable NavLink component for clean code
    const NavItem = ({ to, icon: Icon, children }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
                }`
            }
        >
            <Icon className="h-4 w-4" />
            {!sidebarCollapsed && children}
        </NavLink>
    );

    // Function to render navigation links based on user role
    const renderNavLinks = () => {
        if (user?.role === 'landlord') {
            return (
                <>
                    <NavItem to="/landlord/dashboard" icon={Home}>Dashboard</NavItem>
                    <NavItem to="/landlord/applications" icon={Users}>Applications</NavItem>
                    <NavItem to="/landlord/maintenance" icon={Wrench}>Maintenance</NavItem>
                </>
            );
        }
        if (user?.role === 'tenant') {
            return (
                <>
                    <NavItem to="/tenant/dashboard" icon={Home}>Dashboard</NavItem>
                    <NavItem to="/tenant/maintenance/new" icon={MessageSquare}>Submit Request</NavItem>
                </>
            );
        }
        return null; // Return null if no role matches
    };
    
    // A component for the navigation content, to be reused in mobile and desktop
    const NavContent = () => (
         <nav className="grid items-start gap-1 px-2 text-sm font-medium">
            {renderNavLinks()}
            <Separator className="my-2" />
            <NavItem to="/" icon={Search}>Browse Properties</NavItem>
            <Separator className="my-2" />
            <NavItem to="/settings" icon={Settings}>Settings</NavItem>
        </nav>
    );

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[auto_1fr]"> {/* Changed from fixed width to auto */}
            {/* --- Desktop Sidebar --- */}
            <aside className="hidden border-r bg-card text-card-foreground lg:block">
                <div className={`flex h-full max-h-screen flex-col gap-4 p-4 ${sidebarCollapsed ? 'w-[72px]' : 'w-[280px]'}`}>
                    <div className="flex h-14 items-center border-b px-2 justify-between">
                        {!sidebarCollapsed && (
                            <Link to="/" className="flex items-center gap-3 font-semibold">
                                <Building2 className="h-6 w-6 text-primary" />
                                <span className="text-xl">Leaseify</span>
                            </Link>
                        )}
                        {sidebarCollapsed && (
                            <Link to="/" className="flex items-center gap-3 font-semibold justify-center w-full">
                                <Building2 className="h-6 w-6 text-primary" />
                            </Link>
                        )}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                    
                    <TooltipProvider delayDuration={100}>
                        <div className="flex-1">
                            {sidebarCollapsed ? (
                                <div className="grid items-start gap-1 px-2 text-sm font-medium">
                                    {renderNavLinks()}
                                    <Separator className="my-2" />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <NavItem to="/" icon={Search}></NavItem>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Browse Properties</TooltipContent>
                                    </Tooltip>
                                    <Separator className="my-2" />
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <NavItem to="/settings" icon={Settings}></NavItem>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Settings</TooltipContent>
                                    </Tooltip>
                                </div>
                            ) : (
                                <NavContent />
                            )}
                        </div>
                    </TooltipProvider>
                    
                    <div className="mt-auto">
                        {/* You can add footer items here if needed */}
                    </div>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <div className="flex flex-col">
                {/* Header */}
                <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
                    {/* Mobile Sidebar (Sheet) */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                           <NavContent />
                        </SheetContent>
                    </Sheet>
                    
                    <div className="w-full flex-1">
                       {/* You can add a global search bar here later */}
                    </div>

                    {/* Theme Toggle Button */}
                    <ThemeToggleButton />

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full ml-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.avatar} alt={user?.name} />
                                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>{user?.name}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onLogout} className="text-destructive font-medium cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* This Outlet renders the specific page content (e.g., Dashboard) */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;

// import React from 'react';
// import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../features/auth/authSlice';

// // --- Imports for Icons from lucide-react ---
// import { Home, Wrench, Bell, User, Search, LogOut, Menu, Building2, MessageSquare, Settings } from "lucide-react";
// import {  Users } from "lucide-react";
// // --- Imports for shadcn/ui Components ---
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// import { Separator } from "@/components/ui/separator";
// // import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// // --- Import for the Theme Toggle Button ---
// import { ThemeToggleButton } from '../components/ThemeToggleButton';

// function AppLayout() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);

//     const onLogout = () => {
//         dispatch(logout());
//         navigate('/login');
//     };

//     // A reusable NavLink component for clean code
//     const NavItem = ({ to, icon: Icon, children }) => (
//         <NavLink
//             to={to}
//             className={({ isActive }) =>
//                 `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
//                 isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
//                 }`
//             }
//         >
//             <Icon className="h-4 w-4" />
//             {children}
//         </NavLink>
//     );

//     // Function to render navigation links based on user role
//     const renderNavLinks = () => {
//         if (user?.role === 'landlord') {
//             return (
//                 <>
//                     <NavItem to="/landlord/dashboard" icon={Home}>Dashboard</NavItem>
//                     <NavItem to="/landlord/applications" icon={Users}>Applications</NavItem> {/* 2. Add the new NavItem */}
//                     <NavItem to="/landlord/maintenance" icon={Wrench}>Maintenance</NavItem>
//                 </>
//             );
//         }
//         if (user?.role === 'tenant') {
//             return (
//                 <>
//                     <NavItem to="/tenant/dashboard" icon={Home}>Dashboard</NavItem>
//                     <NavItem to="/tenant/maintenance/new" icon={MessageSquare}>Submit Request</NavItem>
//                 </>
//             );
//         }
//         return null; // Return null if no role matches
//     };
    
//     // A component for the navigation content, to be reused in mobile and desktop
//     const NavContent = () => (
//          <nav className="grid items-start gap-1 px-2 text-sm font-medium">
//             {renderNavLinks()}
//             <Separator className="my-2" />
//             <NavItem to="/" icon={Search}>Browse Properties</NavItem>
//             <Separator className="my-2" />
//             <NavItem to="/settings" icon={Settings}>Settings</NavItem>
//         </nav>
//     );

//     return (
//         <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
//             {/* --- Desktop Sidebar --- */}
//             <aside className="hidden border-r bg-card text-card-foreground lg:block">
//                 <div className="flex h-full max-h-screen flex-col gap-4 p-4">
//                     <div className="flex h-14 items-center border-b px-2">
//                         <Link to="/" className="flex items-center gap-3 font-semibold">
//                             <Building2 className="h-6 w-6 text-primary" />
//                             <span className="text-xl">PropMan Hub</span>
//                         </Link>
//                     </div>
                    
//                     <NavContent />
                    
//                     <div className="mt-auto">
//                         {/* You can add footer items here if needed */}
//                     </div>
//                 </div>
//             </aside>

//             {/* --- Main Content Area --- */}
//             <div className="flex flex-col">
//                 {/* Header */}
//                 <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
//                     {/* Mobile Sidebar (Sheet) */}
//                     <Sheet>
//                         <SheetTrigger asChild>
//                             <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
//                                 <Menu className="h-5 w-5" />
//                                 <span className="sr-only">Toggle navigation menu</span>
//                             </Button>
//                         </SheetTrigger>
//                         <SheetContent side="left">
//                            <NavContent />
//                         </SheetContent>
//                     </Sheet>
                    
//                     <div className="w-full flex-1">
//                        {/* You can add a global search bar here later */}
//                     </div>

//                     {/* Theme Toggle Button */}
//                     <ThemeToggleButton />

//                     {/* User Profile Dropdown */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" className="rounded-full ml-2">
//                                 <Avatar className="h-8 w-8">
//                                     <AvatarImage src={user?.avatar} alt={user?.name} />
//                                     <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
//                                 </Avatar>
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                             <DropdownMenuItem>{user?.name}</DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem>Profile</DropdownMenuItem>
//                             <DropdownMenuItem>Settings</DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem onClick={onLogout} className="text-destructive font-medium cursor-pointer">
//                                 <LogOut className="mr-2 h-4 w-4" />
//                                 <span>Logout</span>
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </header>

//                 {/* This Outlet renders the specific page content (e.g., Dashboard) */}
//                 <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// }

// export default AppLayout;

// import React from 'react';
// import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout, reset } from '../features/auth/authSlice';

// // A simple SVG icon for navigation links
// const NavIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;

// function AppLayout() {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);

//     const onLogout = () => {
//         dispatch(logout());
//         dispatch(reset());
//         navigate('/login');
//     };

//     // Style for the active NavLink
//     const activeLinkStyle = {
//         backgroundColor: '#e5e7eb', // A light gray for light mode
//         color: '#111827', // A dark gray for light mode
//         fontWeight: '600',
//     };

//     return (
//         <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//             {/* Sidebar Navigation */}
//             <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg">
//                 <div className="p-4 border-b">
//                     <h1 className="text-2xl font-bold text-blue-600">PropMan Hub</h1>
//                 </div>
//                 <nav className="mt-6">
//                     {/* Role-based navigation rendering */}
//                     {user?.role === 'landlord' && (
//                         <>
//                             <NavLink 
//                                 to="/landlord/dashboard" 
//                                 className="flex items-center py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                                 style={({ isActive }) => isActive ? activeLinkStyle : undefined}
//                             >
//                                 <NavIcon /> Dashboard
//                             </NavLink>
//                             <NavLink 
//                                 to="/landlord/maintenance" 
//                                 className="flex items-center py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                                 style={({ isActive }) => isActive ? activeLinkStyle : undefined}
//                             >
//                                 <NavIcon /> Maintenance
//                             </NavLink>
//                         </>
//                     )}
//                     {user?.role === 'tenant' && (
//                          <>
//                             <NavLink 
//                                 to="/tenant/dashboard" 
//                                 className="flex items-center py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                                 style={({ isActive }) => isActive ? activeLinkStyle : undefined}
//                             >
//                                 <NavIcon /> Dashboard
//                             </NavLink>
//                              <NavLink 
//                                 to="/tenant/maintenance/new" 
//                                 className="flex items-center py-2.5 px-4 rounded transition duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                                 style={({ isActive }) => isActive ? activeLinkStyle : undefined}
//                             >
//                                 <NavIcon /> Submit Request
//                             </NavLink>
//                         </>
//                     )}
//                 </nav>
//             </aside>

//             {/* Main Content Area */}
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-end">
//                     <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
//                         Logout
//                     </button>
//                 </header>
//                 <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8">
//                     {/* The <Outlet> from react-router-dom will render the actual page component here */}
//                     <Outlet /> 
//                 </main>
//             </div>
//         </div>
//     );
// }

// export default AppLayout;