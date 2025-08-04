import React from "react";
import PropTypes from "prop-types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-sm rounded-md border border-black/10 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            Occupancy:
          </span>
          <span className="ml-1 font-medium text-gray-900 dark:text-white">
            {payload[0].value}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const OccupancyChart = ({ data }) => {
  const formatYAxis = (tickItem) => `${tickItem}%`;

  return (
    <Card className="relative overflow-hidden border-red-500/20 dark:border-red-500/30">
      {/* Red left accent line */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-red-500"></div>

      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Occupancy Trend
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Monthly occupancy rate for your properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{
              top: 15,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              strokeOpacity={0.2}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              domain={[0, 100]}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#ef4444",
                strokeWidth: 1,
                strokeOpacity: 0.3,
              }}
            />
            <Area
              type="monotone"
              dataKey="occupancyRate"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorOccupancy)"
              fillOpacity={1}
              activeDot={{
                r: 5,
                stroke: "#fff",
                strokeWidth: 2,
                fill: "#ef4444",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          <p>
            The occupancy rate represents the percentage of rented units
            compared to total available units each month.
          </p>
          <p className="mt-1">
            Aim to maintain rates above 90% for optimal revenue performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

OccupancyChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      occupancyRate: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default OccupancyChart;

// import React from "react";
// import PropTypes from "prop-types";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white dark:bg-gray-800 p-3 shadow-sm rounded-md border border-gray-200 dark:border-gray-700">
//         <p className="font-medium text-gray-900 dark:text-white">{label}</p>
//         <div className="flex items-center mt-1">
//           <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
//           <span className="text-sm text-gray-600 dark:text-gray-300">
//             Occupancy:
//           </span>
//           <span className="ml-1 font-medium text-gray-900 dark:text-white">
//             {payload[0].value}%
//           </span>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// const OccupancyChart = ({ data }) => {
//   const formatYAxis = (tickItem) => `${tickItem}%`;

//   return (
//     <Card className="relative overflow-hidden border-l-0">
//       {/* Subtle left accent line (matches stat cards) */}
//       <div className="absolute left-0 top-0 h-full w-[2px] bg-red-500"></div>

//       <CardHeader>
//         <CardTitle className="text-gray-900 dark:text-white">
//           Occupancy Trend
//         </CardTitle>
//         <CardDescription className="text-gray-600 dark:text-gray-400">
//           Monthly occupancy rate for your properties
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart
//             data={data}
//             margin={{
//               top: 15,
//               right: 15,
//               left: 5,
//               bottom: 5,
//             }}
//           >
//             <defs>
//               <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#e5e7eb"
//               strokeOpacity={0.2}
//               vertical={false}
//             />
//             <XAxis
//               dataKey="name"
//               stroke="#6b7280"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tick={{ fill: "#6b7280" }}
//             />
//             <YAxis
//               stroke="#6b7280"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               domain={[0, 100]}
//               tick={{ fill: "#6b7280" }}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{
//                 stroke: "#ef4444",
//                 strokeWidth: 1,
//                 strokeOpacity: 0.3,
//               }}
//             />
//             <Area
//               type="monotone"
//               dataKey="occupancyRate"
//               stroke="#ef4444"
//               strokeWidth={2}
//               fill="url(#colorOccupancy)"
//               fillOpacity={1}
//               activeDot={{
//                 r: 5,
//                 stroke: "#fff",
//                 strokeWidth: 2,
//                 fill: "#ef4444",
//               }}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//         <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
//           <p>
//             The occupancy rate represents the percentage of rented units
//             compared to total available units each month.
//           </p>
//           <p className="mt-1">
//             Aim to maintain rates above 90% for optimal revenue performance.
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// OccupancyChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       occupancyRate: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default OccupancyChart;
// /**
//  * OccupancyChart.jsx
//  * Final version with red styling and description
//  */
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-200 dark:border-gray-600">
//         <p className="font-medium text-gray-900 dark:text-white">{label}</p>
//         <div className="flex items-center mt-1">
//           <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
//           <span className="text-sm text-gray-600 dark:text-gray-300">
//             Occupancy:
//           </span>
//           <span className="ml-1 font-medium text-gray-900 dark:text-white">
//             {payload[0].value}%
//           </span>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// const OccupancyChart = ({ data }) => {
//   const formatYAxis = (tickItem) => `${tickItem}%`;

//   return (
//     <Card className="shadow-sm">
//       <CardHeader>
//         <CardTitle className="text-gray-900 dark:text-white">
//           Occupancy Trend
//         </CardTitle>
//         <CardDescription className="text-gray-600 dark:text-gray-400">
//           Monthly occupancy rate for your properties
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart
//             data={data}
//             margin={{
//               top: 15,
//               right: 15,
//               left: 5,
//               bottom: 5,
//             }}
//           >
//             <defs>
//               <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#e5e7eb"
//               strokeOpacity={0.3}
//               vertical={false}
//             />
//             <XAxis
//               dataKey="name"
//               stroke="#6b7280"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tick={{ fill: "#6b7280" }}
//             />
//             <YAxis
//               stroke="#6b7280"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               domain={[0, 100]}
//               tick={{ fill: "#6b7280" }}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{
//                 stroke: "#ef4444",
//                 strokeWidth: 1,
//                 strokeDasharray: "3 3",
//               }}
//             />
//             <Area
//               type="monotone"
//               dataKey="occupancyRate"
//               stroke="#ef4444"
//               strokeWidth={2}
//               fill="url(#colorOccupancy)"
//               fillOpacity={1}
//               activeDot={{
//                 r: 5,
//                 stroke: "#fff",
//                 strokeWidth: 2,
//                 fill: "#ef4444",
//               }}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//         <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
//           <p>
//             The occupancy rate represents the percentage of rented units
//             compared to total available units each month.
//           </p>
//           <p className="mt-1">
//             Aim to maintain rates above 90% for optimal revenue performance.
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// OccupancyChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       occupancyRate: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default OccupancyChart;

// /**
//  * OccupancyChart.jsx
//  * * This component displays a responsive area chart for visualizing occupancy rate trends.
//  * It uses the Recharts library to show the percentage of occupied units over time.
//  *
//  * @param {{data: Array<Object>}} props - The props for the component.
//  * - `data` should be an array of objects, e.g., [{ name: 'Jan', occupancyRate: 95 }]
//  */
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// const OccupancyChart = ({ data }) => {
//   const formatYAxis = (tickItem) => `${tickItem}%`;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Occupancy Trend (Last 12 Months)</CardTitle>
//         <CardDescription>
//           The percentage of your total units that are occupied.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <AreaChart
//             data={data}
//             margin={{
//               top: 5,
//               right: 20,
//               left: -10, // Adjust to give Y-axis labels space
//               bottom: 5,
//             }}
//           >
//             <defs>
//               <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
//                 <stop
//                   offset="5%"
//                   stopColor="hsl(var(--primary))"
//                   stopOpacity={0.8}
//                 />
//                 <stop
//                   offset="95%"
//                   stopColor="hsl(var(--primary))"
//                   stopOpacity={0}
//                 />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
//             <XAxis
//               dataKey="name"
//               stroke="#888888"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//             />
//             <YAxis
//               stroke="#888888"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               domain={[0, 100]}
//             />
//             <Tooltip
//               cursor={{
//                 stroke: "hsl(var(--primary))",
//                 strokeWidth: 1,
//                 strokeDasharray: "3 3",
//               }}
//               contentStyle={{
//                 backgroundColor: "hsl(var(--background))",
//                 borderColor: "hsl(var(--border))",
//                 borderRadius: "var(--radius)",
//               }}
//               formatter={(value) => [`${value}%`, "Occupancy"]}
//             />
//             <Area
//               type="monotone"
//               dataKey="occupancyRate"
//               name="Occupancy"
//               stroke="hsl(var(--primary))"
//               fillOpacity={1}
//               fill="url(#colorOccupancy)"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };

// OccupancyChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       occupancyRate: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default OccupancyChart;
