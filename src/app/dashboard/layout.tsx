import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-100 selection:text-blue-900 font-sans overflow-hidden">
            <div className="relative z-10 h-screen overflow-y-auto custom-scrollbar">
                {children}
            </div>

            {/* Background Ambient Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px]" />
            </div>
        </div>
    );
}
