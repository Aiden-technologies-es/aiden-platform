export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-brand">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#0A0A0F]">Aiden</span>
          </div>
          <p className="text-sm text-[#7A7A8C]">Tu panel de servicios digitales</p>
        </div>
        {children}
      </div>
    </div>
  )
}
