import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileHeader } from '@/components/dashboard/MobileHeader'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F4F4F5]">
        <div className="lg:hidden">
          <MobileHeader />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto px-5 lg:px-8 py-7 lg:py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
