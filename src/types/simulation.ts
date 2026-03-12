export type OperationType = 'LANDING' | 'TAKEOFF';
export type PriorityType = 'EMERGENCY' | 'HIGH' | 'NORMAL';
export type PlaneStatus = 'WAITING' | 'RUNNING' | 'COMPLETED';
export type SchedulingAlgorithm = 
  | 'FCFS' 
  | 'SJF_NON_PREEMPTIVE' 
  | 'SJF_PREEMPTIVE' 
  | 'PRIORITY_NON_PREEMPTIVE' 
  | 'PRIORITY_PREEMPTIVE' 
  | 'ROUND_ROBIN';

export interface Plane {
  id: string;
  operation: OperationType;
  priority: PriorityType;
  burstTime: number; // Original runway time
  remainingTime: number; // Time left on runway
  arrivalTime: number; // Time added to queue
  startTime?: number; // First time it got a runway
  completionTime?: number; // Time it finished
  status: PlaneStatus;
  runwayId?: number;
  quantumUsed?: number; // For Round Robin
}

export interface Runway {
  id: number;
  currentPlaneId?: string;
  status: 'FREE' | 'BUSY';
}

export interface SystemEvent {
  timestamp: number;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
}
