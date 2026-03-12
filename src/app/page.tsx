import { RunwaySimulation } from '@/components/runway/RunwaySimulation';

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-body p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-accent tracking-tight flex items-center gap-3">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
              RunwaySim Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Airport Control - OS Scheduling Concepts Simulation
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm bg-card px-4 py-2 rounded-lg border">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              <span className="font-mono text-accent">SYSTEM ACTIVE</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <span className="text-muted-foreground uppercase">Terminal A-B</span>
          </div>
        </header>

        <RunwaySimulation />
      </div>
    </main>
  );
}
