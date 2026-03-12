# **App Name**: RunwaySim Dashboard

## Core Features:

- Plane Request Input Form: Users input plane details (ID, Operation, Priority, Runway Time) to add new 'processes' to the simulation's waiting queue.
- Dynamic Waiting Queue Display: A real-time table view showing all planes currently awaiting runway access, including their status (Waiting, Running, Completed), operation, priority, and burst time.
- Scheduling Algorithm & Runway Configuration: Allows users to select the desired OS scheduling algorithm (FCFS, Priority, Round Robin) from a dropdown and configure the number of active runways (1 to 3) for the simulation.
- Real-Time Runway Allocation Dashboard: Visualizes the current status of each runway (busy/free), detailing which plane is occupying it, its operation, and remaining time, mirroring multi-core CPU usage.
- Simulation Control & Monitoring Engine: The core JavaScript-timer driven logic that manages the simulation flow, executing plane scheduling, updating runway states, and providing controls to start, pause, and reset the simulation.
- Performance Metrics & Event Log: Calculates and displays real-time OS scheduling metrics such as Waiting Time, Turnaround Time, and Average values for each plane, alongside a chronological log of system events and state changes.
- Firestore Data Persistence: Stores plane requests, user-defined simulation parameters, and event logs in a Firebase Firestore database for later review and analysis of past simulation runs.

## Style Guidelines:

- Color Palette based on a professional 'Airport Control Dashboard' aesthetic with a dark scheme. Primary interactive color: Deep, desaturated blue (#3967BE) for critical data and active elements. Background: Very dark desaturated blue-gray (#24262A) to provide a neutral, non-distracting 'control room' environment. Accent color: Vibrant cyan (#3BD6EF) for alerts, highlights, and critical calls-to-action.
- Headline and body font: 'Inter', a grotesque-style sans-serif. Chosen for its modern, machined, and highly legible characteristics, perfectly suited for displaying real-time data and status updates in a control dashboard context.
- Utilize a clean, minimalist set of geometric sans-serif icons. Focus on clarity for statuses (e.g., 'waiting', 'running', 'completed'), operational actions (landing/takeoff), and simulation controls (play, pause, reset).
- A structured, multi-panel dashboard layout, featuring distinct sections for plane input, waiting queues, live runway statuses, and a dedicated area for metrics and event logs. Employ a grid system to ensure clear visual hierarchy and efficient information display.
- Subtle and functional animations will be used sparingly to indicate state changes, such as a plane transitioning from the waiting queue to a runway, or status updates on the dashboard. Avoid distracting flourishes, prioritizing immediate feedback and clarity.