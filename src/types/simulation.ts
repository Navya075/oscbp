export type OperationType = 'LANDING' | 'TAKEOFF';
export type PriorityType = 'NORMAL' | 'EMERGENCY';
export type PlaneStatus = 'WAITING' | 'RUNNING' | 'COMPLETED';
export type SchedulingAlgorithm = 'FCFS' | 'PRIORITY' | 'ROUND_ROBIN';

export interface Plane {
  id: string;
  operation: OperationType;
  priority: PriorityType;
  burstTime: number; // in seconds
  remainingTime: number;
  arrivalTime: number; // simulation tick
  startTime?: number;
  completionTime?: number;
  status: PlaneStatus;
  runwayId?: number;
  quantumUsed?: number;
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

export interface SimulationMetrics {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  completedPlanes: number;
}
