import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/features/tasks/taskSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Loader2, Plus, ListChecks, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Helper Components (Self-Contained) ---

const TaskItem = ({ task, onToggle, onDelete, isProcessing }) => (
  <div className="group flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50">
    <Checkbox
      id={task._id}
      checked={task.isCompleted}
      onCheckedChange={onToggle}
      disabled={isProcessing}
    />
    <label
      htmlFor={task._id}
      className={cn(
        "flex-grow cursor-pointer text-sm transition-colors",
        task.isCompleted && "text-muted-foreground line-through"
      )}
    >
      {task.title}
    </label>
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 rounded-full text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
      onClick={onDelete}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <X className="h-4 w-4" />
      )}
    </Button>
  </div>
);

const TaskSkeleton = () => (
  <div className="space-y-2 p-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 flex-grow" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
    <CheckSquare className="h-10 w-10 text-muted-foreground" />
    <p className="font-medium">All tasks completed!</p>
    <p className="text-sm text-muted-foreground">Add a new task below.</p>
  </div>
);

// --- Main Component ---

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isCreating } = useSelector((state) => state.tasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    if (newTaskTitle.length > 100) {
      setError("Task title is too long (max 100 chars).");
      return;
    }

    setError("");
    toast.promise(dispatch(createTask({ title: newTaskTitle })).unwrap(), {
      loading: "Creating new task...",
      success: () => {
        setNewTaskTitle("");
        return "Task added successfully!";
      },
      error: (err) => err.message || "Failed to add task.",
    });
  };

  const handleToggleComplete = (task) => {
    setProcessingId(task._id);
    dispatch(updateTask({ id: task._id, isCompleted: !task.isCompleted }))
      .unwrap()
      .finally(() => setProcessingId(null));
  };

  const handleDeleteTask = (taskId) => {
    setProcessingId(taskId);
    toast.promise(dispatch(deleteTask(taskId)).unwrap(), {
      loading: "Deleting task...",
      success: "Task removed.",
      error: (err) => err.message || "Failed to delete task.",
      finally: () => setProcessingId(null),
    });
  };

  const sortedTasks = [...tasks].sort((a, b) => a.isCompleted - b.isCompleted);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <ListChecks className="h-6 w-6 text-muted-foreground" />
          <CardTitle>My Tasks</CardTitle>
        </div>
        <CardDescription>A quick list of your personal to-dos.</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="border-t">
          {/* --- THE KEY CHANGE IS HERE --- */}
          {/* Use max-h-* for dynamic height. It will grow up to this height, then scroll. */}
          <ScrollArea className="w-full max-h-[220px]">
            <div className="p-2">
              {isLoading && tasks.length === 0 ? (
                <TaskSkeleton />
              ) : sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggle={() => handleToggleComplete(task)}
                    onDelete={() => handleDeleteTask(task._id)}
                    isProcessing={processingId === task._id}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 border-t pt-4">
        <form onSubmit={handleCreateTask} className="flex w-full gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => {
              setNewTaskTitle(e.target.value);
              if (error) setError("");
            }}
            disabled={isCreating}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isCreating || !newTaskTitle.trim()}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </form>
        {error && <p className="px-1 text-xs text-destructive">{error}</p>}
      </CardFooter>
    </Card>
  );
};

export default TaskList;

// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   getTasks,
//   createTask,
//   updateTask,
//   deleteTask,
// } from "@/features/tasks/taskSlice";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X, Loader2, Plus } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { toast } from "sonner";

// const TaskList = () => {
//   const dispatch = useDispatch();
//   const { tasks, isLoading, isCreating, isUpdating, isDeleting } = useSelector(
//     (state) => state.tasks
//   );
//   const [newTaskTitle, setNewTaskTitle] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     dispatch(getTasks());
//   }, [dispatch]);

//   const handleCreateTask = async (e) => {
//     e.preventDefault();
//     if (!newTaskTitle.trim()) {
//       setError("Task required");
//       return;
//     }
//     if (newTaskTitle.length > 100) {
//       setError("Too long");
//       return;
//     }

//     toast.promise(dispatch(createTask({ title: newTaskTitle })).unwrap(), {
//       loading: "Creating...",
//       success: () => {
//         setNewTaskTitle("");
//         setError("");
//         return "Task added";
//       },
//       error: "Failed to add",
//     });
//   };

//   const handleToggleComplete = (task) => {
//     dispatch(
//       updateTask({
//         id: task._id,
//         isCompleted: !task.isCompleted,
//       })
//     );
//   };

//   const handleDeleteTask = (taskId) => {
//     toast.promise(dispatch(deleteTask(taskId)).unwrap(), {
//       loading: "Deleting...",
//       success: "Task removed",
//       error: "Failed to delete",
//     });
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>My Tasks</CardTitle>
//       </CardHeader>

//       <CardContent>
//         <ScrollArea className={`${tasks.length > 4 ? "h-[200px]" : "h-auto"}`}>
//           <div className="space-y-2">
//             {tasks.map((task) => (
//               <div key={task._id} className="flex items-center gap-3 p-1">
//                 <Checkbox
//                   id={task._id}
//                   checked={task.isCompleted}
//                   onCheckedChange={() => handleToggleComplete(task)}
//                 />
//                 <label
//                   htmlFor={task._id}
//                   className={`flex-grow text-sm ${
//                     task.isCompleted ? "line-through text-muted-foreground" : ""
//                   }`}
//                 >
//                   {task.title}
//                 </label>
//                 <button
//                   onClick={() => handleDeleteTask(task._id)}
//                   className="text-muted-foreground hover:text-destructive"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}

//             {!isLoading && tasks.length === 0 && (
//               <div className="py-4 text-center text-sm text-muted-foreground">
//                 No tasks yet
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>

//       <CardFooter>
//         <form onSubmit={handleCreateTask} className="flex w-full gap-2">
//           <Input
//             placeholder="Add task..."
//             value={newTaskTitle}
//             onChange={(e) => setNewTaskTitle(e.target.value)}
//             className="flex-grow"
//           />
//           <Button
//             type="submit"
//             size="sm"
//             disabled={isCreating || !newTaskTitle.trim()}
//           >
//             <Plus className="h-4 w-4" />
//           </Button>
//         </form>
//       </CardFooter>
//     </Card>
//   );
// };

// export default TaskList;
// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getTasks, createTask, updateTask, deleteTask } from '@/features/tasks/taskSlice';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X } from 'lucide-react';
// import { ScrollArea } from "@/components/ui/scroll-area"; // 1. Import the ScrollArea component

// const TaskList = () => {
//     const dispatch = useDispatch();
//     const { tasks, isLoading } = useSelector((state) => state.tasks);
//     const [newTaskTitle, setNewTaskTitle] = useState('');

//     useEffect(() => {
//         dispatch(getTasks());
//     }, [dispatch]);

//     const handleCreateTask = (e) => {
//         e.preventDefault();
//         if (newTaskTitle.trim()) {
//             dispatch(createTask({ title: newTaskTitle }));
//             setNewTaskTitle('');
//         }
//     };

//     const handleToggleComplete = (task) => {
//         dispatch(updateTask({ id: task._id, isCompleted: !task.isCompleted }));
//     };

//     return (
//         <Card className="flex flex-col">
//             <CardHeader>
//                 <CardTitle>My Tasks</CardTitle>
//             </CardHeader>
//             {/* 2. Use CardContent with no padding to allow ScrollArea to fill the space */}
//             <CardContent className="flex-grow p-0">
//                 {/* 3. Wrap the list in the ScrollArea component with a fixed height */}
//                 <ScrollArea className="h-[300px] w-full">
//                     <div className="space-y-4 p-6">
//                         {tasks.map((task) => (
//                             <div key={task._id} className="flex items-center gap-3 group">
//                                 <Checkbox
//                                     id={task._id}
//                                     checked={task.isCompleted}
//                                     onCheckedChange={() => handleToggleComplete(task)}
//                                 />
//                                 <label
//                                     htmlFor={task._id}
//                                     className={`flex-grow font-medium transition-colors ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}
//                                 >
//                                     {task.title}
//                                 </label>
//                                 <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
//                                     onClick={() => dispatch(deleteTask(task._id))}
//                                 >
//                                     <X className="h-4 w-4" />
//                                     <span className="sr-only">Delete task</span>
//                                 </Button>
//                             </div>
//                         ))}
//                         {isLoading && tasks.length === 0 && <p className="text-muted-foreground text-center">Loading tasks...</p>}
//                         {!isLoading && tasks.length === 0 && <p className="text-muted-foreground text-center">No tasks here. Add one below!</p>}
//                     </div>
//                 </ScrollArea>
//             </CardContent>
//             <CardFooter className="border-t pt-4">
//                 <form onSubmit={handleCreateTask} className="flex w-full gap-2">
//                     <Input
//                         placeholder="Add a new task..."
//                         value={newTaskTitle}
//                         onChange={(e) => setNewTaskTitle(e.target.value)}
//                     />
//                     <Button type="submit" disabled={isLoading}>Add</Button>
//                 </form>
//             </CardFooter>
//         </Card>
//     );
// };

// export default TaskList;

// // src/components/dashboard/TaskList.jsx

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getTasks, createTask, updateTask, deleteTask } from '@/features/tasks/taskSlice';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { X } from 'lucide-react';

// const TaskList = () => {
//     const dispatch = useDispatch();
//     const { tasks, isLoading } = useSelector((state) => state.tasks);
//     const [newTaskTitle, setNewTaskTitle] = useState('');

//     useEffect(() => {
//         dispatch(getTasks());
//     }, [dispatch]);

//     const handleCreateTask = (e) => {
//         e.preventDefault();
//         if (newTaskTitle.trim()) {
//             dispatch(createTask({ title: newTaskTitle }));
//             setNewTaskTitle('');
//         }
//     };

//     const handleToggleComplete = (task) => {
//         dispatch(updateTask({ id: task._id, isCompleted: !task.isCompleted }));
//     };

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>My Tasks</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="space-y-4">
//                     {tasks.map((task) => (
//                         <div key={task._id} className="flex items-center gap-3 group">
//                             <Checkbox
//                                 id={task._id}
//                                 checked={task.isCompleted}
//                                 onCheckedChange={() => handleToggleComplete(task)}
//                             />
//                             <label
//                                 htmlFor={task._id}
//                                 className={`flex-grow font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}
//                             >
//                                 {task.title}
//                             </label>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-6 w-6 opacity-0 group-hover:opacity-100"
//                                 onClick={() => dispatch(deleteTask(task._id))}
//                             >
//                                 <X className="h-4 w-4" />
//                             </Button>
//                         </div>
//                     ))}
//                     {isLoading && tasks.length === 0 && <p>Loading tasks...</p>}
//                 </div>
//             </CardContent>
//             <CardFooter>
//                 <form onSubmit={handleCreateTask} className="flex w-full gap-2">
//                     <Input
//                         placeholder="Add a new task..."
//                         value={newTaskTitle}
//                         onChange={(e) => setNewTaskTitle(e.target.value)}
//                     />
//                     <Button type="submit">Add</Button>
//                 </form>
//             </CardFooter>
//         </Card>
//     );
// };

// export default TaskList;

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
