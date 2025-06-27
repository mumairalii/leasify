// src/components/dashboard/TaskList.jsx

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks, createTask, updateTask, deleteTask } from '@/features/tasks/taskSlice';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';

const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks, isLoading } = useSelector((state) => state.tasks);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch]);

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            dispatch(createTask({ title: newTaskTitle }));
            setNewTaskTitle('');
        }
    };

    const handleToggleComplete = (task) => {
        dispatch(updateTask({ id: task._id, isCompleted: !task.isCompleted }));
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>My Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div key={task._id} className="flex items-center gap-3 group">
                            <Checkbox 
                                id={task._id} 
                                checked={task.isCompleted}
                                onCheckedChange={() => handleToggleComplete(task)}
                            />
                            <label 
                                htmlFor={task._id} 
                                className={`flex-grow font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                            >
                                {task.title}
                            </label>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={() => dispatch(deleteTask(task._id))}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {isLoading && tasks.length === 0 && <p>Loading tasks...</p>}
                </div>
            </CardContent>
            <CardFooter>
                <form onSubmit={handleCreateTask} className="flex w-full gap-2">
                    <Input 
                        placeholder="Add a new task..." 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <Button type="submit">Add</Button>
                </form>
            </CardFooter>
        </Card>
    );
};

export default TaskList;

// // src/components/dashboard/TaskList.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";

// // The component now accepts 'tasks' as a prop
// const TaskList = ({ tasks = [] }) => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>My Tasks</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {tasks.map((task) => (
//             <div key={task.id} className="flex items-start gap-3">
//               <Checkbox id={task.id} className="mt-1" />
//               <div className="grid gap-0.5 leading-none">
//                 <label htmlFor={task.id} className="font-medium">
//                   {task.text}
//                 </label>
//                 <p className={`text-sm ${task.isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
//                   {task.dueDate}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Button variant="outline" size="sm" className="w-full">View All Tasks</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default TaskList;

// // src/components/dashboard/TaskList.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";

// // --- Mock Data ---
// const mockTasks = [
//     { id: 'task1', text: 'Finalize budget report Q1', dueDate: 'Due: Apr 10', isOverdue: true },
//     { id: 'task2', text: 'Call Tenant X (Unit Y) re: Overdue Rent', dueDate: 'Due: Apr 14 (Overdue)', isOverdue: true },
//     { id: 'task3', text: 'Review application from Kathy Allen', dueDate: 'Due: Apr 16 (Overdue)', isOverdue: true },
//     { id: 'task4', text: 'Follow up with John Doe (Unit 101) re: lease renewal', dueDate: 'Due: Apr 22', isOverdue: false },
// ];
// // --- End Mock Data ---

// const TaskList = () => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>My Tasks</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {mockTasks.map((task) => (
//             <div key={task.id} className="flex items-start gap-3">
//               <Checkbox id={task.id} className="mt-1" />
//               <div className="grid gap-0.5 leading-none">
//                 <label htmlFor={task.id} className="font-medium">
//                   {task.text}
//                 </label>
//                 <p className={`text-sm ${task.isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
//                   {task.dueDate}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//       <CardFooter>
//         <Button variant="outline" size="sm" className="w-full">View All Tasks</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default TaskList;