// src/lib/mockData.js

import { User, Bell } from 'lucide-react';

export const communicationItems = [
    { id: 'c1', actor: 'Alice Johnson', action: '(Unit 101)', details: 'Sent: Overdue Rent Reminder', time: '2h ago', actorIcon: User },
    { id: 'c2', actor: 'Bob Williams', action: '(Unit 205)', details: 'Logged call regarding late payment.', time: '17m ago', actorIcon: User },
    { id: 'c3', actor: 'Frank Green', action: '(Unit 301)', details: 'Can we schedule maintenance for...', time: '3h ago', actorIcon: User },
];

export const systemActivityItems = [
    { id: 's1', actor: 'System', action: 'Generated "Late Rent Notice" batch for Oak Apartments', details: 'Automated Action', time: '10m ago', actorIcon: Bell },
    { id: 's2', actor: 'Property Manager', action: 'Logged $1200 rent payment for T. Brown (Unit 301)', details: 'Manual Entry', time: '17m ago', actorIcon: Bell },
    { id: 's3', actor: 'Dave M', action: 'Maintenance Request #1225 status changed to "In Progress"', details: 'Via Maintenance Module', time: '32m ago', actorIcon: Bell },
];

export const mockTasks = [
    { id: 'task1', text: 'Finalize budget report Q1', dueDate: 'Due: Apr 10', isOverdue: true },
    { id: 'task2', text: 'Call Tenant X (Unit Y) re: Overdue Rent', dueDate: 'Due: Apr 14', isOverdue: true },
    { id: 'task3', text: 'Review application from Kathy Allen', dueDate: 'Due: Apr 16', isOverdue: false },
];

// export const mockTenants = [
//     { id: 't1', name: 'Alice Johnson', unit: 'Unit 101', days: 15, amount: 1250 },
//     { id: 't2', name: 'Bob Williams', unit: 'Unit 205', days: 12, amount: 950 },
//     { id: 't3', name: 'Charlie Brown', unit: 'Unit 103', days: 10, amount: 1500 },
// ];


export const mockTenants = [
    { id: 't1', leaseId: 'lease_abc', name: 'Alice Johnson', unit: 'Unit 101', days: 15, amount: 1250 },
    { id: 't2', leaseId: 'lease_def', name: 'Bob Williams', unit: 'Unit 205', days: 12, amount: 950 },
    { id: 't3', leaseId: 'lease_ghi', name: 'Charlie Brown', unit: 'Unit 103', days: 10, amount: 1500 },
];