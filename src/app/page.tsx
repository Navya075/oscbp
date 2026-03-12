import { RunwaySimulation } from '@/components/runway/RunwaySimulation';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50/50 font-body p-4 md:p-6 lg:p-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                </svg>
              </div>
              RunwaySim <span className="text-slate-400 font-normal">v2.0</span>
            </h1>
            <p className="text-slate-500 font-medium">
              ATC Operations Center & OS Scheduling Simulator
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900">ATC NETWORK ONLINE</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Terminal A-B Control</span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">Admin Controller</span>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-tight">System Root</span>
              </div>
            </div>
          </div>
        </header>

        <RunwaySimulation />
      </div>
    </main>
  );
}
