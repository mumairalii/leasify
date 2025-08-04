import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  color,
  progress,
}) => {
  // Simplified color mapping for elegant black/red theme
  const borderColorMap = {
    default: "border-gray-200 dark:border-gray-700",
    destructive: "border-red-500/20 dark:border-red-500/30",
    success: "border-black/20 dark:border-gray-600",
    warning: "border-red-500/20 dark:border-red-500/30",
    info: "border-black/20 dark:border-gray-600",
  };

  const textColorMap = {
    default: "text-muted-foreground",
    destructive: "text-red-600 dark:text-red-400",
    success: "text-black dark:text-gray-200",
    warning: "text-red-500 dark:text-red-300",
    info: "text-black dark:text-gray-200",
  };

  return (
    <Card
      className={`relative overflow-hidden ${
        borderColorMap[color] || borderColorMap.default
      } transition-all hover:shadow-sm`}
    >
      {/* Single subtle accent line */}
      <div
        className={`absolute left-0 top-0 h-full w-[2px] ${
          color === "destructive" || color === "warning"
            ? "bg-red-500"
            : "bg-black dark:bg-gray-500"
        }`}
      ></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div
            className={`p-2 rounded-lg ${
              color === "destructive" || color === "warning"
                ? "text-red-500 dark:text-red-400"
                : "text-black dark:text-gray-300"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold mb-1 ${
            textColorMap[color] || textColorMap.default
          }`}
        >
          {value}
        </div>
        {progress !== undefined && (
          <div className="mb-2">
            <Progress
              value={progress}
              className={`h-[3px] ${
                color === "destructive" || color === "warning"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
              indicatorClassName={
                color === "destructive" || color === "warning"
                  ? "bg-red-500"
                  : "bg-black dark:bg-gray-400"
              }
            />
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
export default StatCard;

// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";

// const StatCard = ({
//   title,
//   value,
//   description,
//   icon: Icon,
//   color,
//   progress,
// }) => {
//   // Color mapping for consistent theming
//   const colorMap = {
//     default: "border-gray-200 dark:border-gray-700",
//     destructive: "border-red-500/50 dark:border-red-500/80",
//     success: "border-green-500/50 dark:border-green-500/80",
//     warning: "border-yellow-500/50 dark:border-yellow-500/80",
//     info: "border-blue-500/50 dark:border-blue-500/80",
//   };

//   const textColorMap = {
//     default: "text-muted-foreground",
//     destructive: "text-red-500 dark:text-red-400",
//     success: "text-green-500 dark:text-green-400",
//     warning: "text-yellow-500 dark:text-yellow-400",
//     info: "text-blue-500 dark:text-blue-400",
//   };

//   return (
//     <Card
//       className={`relative overflow-hidden transition-all hover:shadow-lg ${
//         colorMap[color] || colorMap.default
//       }`}
//     >
//       {/* Animated background element */}
//       <div
//         className={`absolute -right-10 -top-10 h-24 w-24 rounded-full bg-${color}-500/10 dark:bg-${color}-500/5`}
//       ></div>

//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium text-muted-foreground">
//           {title}
//         </CardTitle>
//         {Icon && (
//           <div className={`p-2 rounded-lg bg-${color}-500/10`}>
//             <Icon
//               className={`h-4 w-4 ${
//                 textColorMap[color] || textColorMap.default
//               }`}
//             />
//           </div>
//         )}
//       </CardHeader>
//       <CardContent className="relative">
//         <div className="text-2xl font-bold mb-1">{value}</div>
//         {progress && (
//           <Progress
//             value={progress}
//             className={`h-2 mb-2 ${color ? `bg-${color}-500/20` : ""}`}
//             indicatorClassName={color ? `bg-${color}-500` : ""}
//           />
//         )}
//         {description && (
//           <p className="text-xs text-muted-foreground flex items-center gap-1">
//             {description}
//           </p>
//         )}
//       </CardContent>
//     </Card>
//   );
// };
// // src/components/dashboard/StatCard.jsx

// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const StatCard = ({ title, value, description, icon: Icon, color }) => {
//   return (
//     <Card className={color ? `border-${color}-500/50 dark:border-${color}-500/80` : ''}>
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         {Icon && <Icon className={`h-4 w-4 text-muted-foreground ${color ? `text-${color}-500 dark:text-${color}-400` : ''}`} />}
//       </CardHeader>
//       <CardContent>
//         <div className="text-2xl font-bold">{value}</div>
//         {description && <p className="text-xs text-muted-foreground">{description}</p>}
//       </CardContent>
//     </Card>
//   );
// };

// export default StatCard;
