import React from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
    const paid = payload[1].value;
    const due = payload[0].value;
    const percentage = due > 0 ? Math.min(100, (paid / due) * 100) : 0;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-sm rounded-md border border-black/10 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <div className="space-y-1 mt-1">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-black dark:bg-gray-400 mr-2" />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Due:
            </span>
            <span className="ml-1 font-medium text-gray-900 dark:text-white">
              ${due.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Paid:
            </span>
            <span className="ml-1 font-medium text-gray-900 dark:text-white">
              ${paid.toLocaleString()}
            </span>
          </div>
          <div className="pt-1 mt-1 border-t border-black/10 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {percentage.toFixed(1)}% collected
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const RentChart = ({ data }) => {
  const formatYAxis = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  return (
    <Card className="relative overflow-hidden border-black/20 dark:border-gray-600">
      {/* Black left accent line */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-black dark:bg-gray-500"></div>

      <CardHeader className="pb-2">
        <CardTitle className="text-gray-900 dark:text-white">
          Rent Collection Trends
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Comparison of rent due versus paid
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={data}
            margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
            barSize={32}
          >
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
              tickMargin={10}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              tickMargin={10}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: "12px" }}
              formatter={(value) => (
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="totalDue"
              name="Rent Due"
              fill="#000000"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
            />
            <Bar
              dataKey="totalPaid"
              name="Rent Paid"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">
          Hover over bars for details
        </div>
      </CardContent>
    </Card>
  );
};

RentChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      totalDue: PropTypes.number.isRequired,
      totalPaid: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default RentChart;

// import React from "react";
// import PropTypes from "prop-types";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
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
//     const paid = payload[1].value;
//     const due = payload[0].value;
//     const percentage = due > 0 ? Math.min(100, (paid / due) * 100) : 0;

//     return (
//       <div className="bg-white dark:bg-gray-800 p-3 shadow-sm rounded-md border border-black/10 dark:border-gray-700">
//         <p className="font-medium text-gray-900 dark:text-white">{label}</p>
//         <div className="space-y-1 mt-1">
//           <div className="flex items-center">
//             <div className="w-2 h-2 rounded-full bg-black dark:bg-gray-400 mr-2" />
//             <span className="text-xs text-gray-600 dark:text-gray-300">
//               Due:
//             </span>
//             <span className="ml-1 font-medium text-gray-900 dark:text-white">
//               ${due.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
//             <span className="text-xs text-gray-600 dark:text-gray-300">
//               Paid:
//             </span>
//             <span className="ml-1 font-medium text-gray-900 dark:text-white">
//               ${paid.toLocaleString()}
//             </span>
//           </div>
//           <div className="pt-1 mt-1 border-t border-black/10 dark:border-gray-700">
//             <span className="text-xs text-gray-500 dark:text-gray-400">
//               {percentage.toFixed(1)}% collected
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// const RentChart = ({ data }) => {
//   const formatYAxis = (value) => {
//     if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
//     return `$${value}`;
//   };

//   return (
//     <Card className="relative overflow-hidden border border-black/10 dark:border-gray-700">
//       {/* Black left accent line */}
//       <div className="absolute left-0 top-0 h-full w-[2px] bg-black dark:bg-gray-500"></div>

//       <CardHeader className="pb-2">
//         <CardTitle className="text-gray-900 dark:text-white">
//           Rent Collection Trends
//         </CardTitle>
//         <CardDescription className="text-gray-600 dark:text-gray-400">
//           Comparison of rent due versus paid
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart
//             data={data}
//             margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
//             barSize={32}
//           >
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
//               tickMargin={10}
//               tick={{ fill: "#6b7280" }}
//             />
//             <YAxis
//               stroke="#6b7280"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               tickMargin={10}
//               tick={{ fill: "#6b7280" }}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
//             />
//             <Legend
//               iconType="circle"
//               iconSize={8}
//               wrapperStyle={{ paddingTop: "12px" }}
//               formatter={(value) => (
//                 <span className="text-xs text-gray-600 dark:text-gray-300">
//                   {value}
//                 </span>
//               )}
//             />
//             <Bar
//               dataKey="totalDue"
//               name="Rent Due"
//               fill="#000000"
//               radius={[4, 4, 0, 0]}
//               animationDuration={1200}
//             />
//             <Bar
//               dataKey="totalPaid"
//               name="Rent Paid"
//               fill="#ef4444"
//               radius={[4, 4, 0, 0]}
//               animationDuration={1200}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//         <div className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">
//           Hover over bars for details
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// RentChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       totalDue: PropTypes.number.isRequired,
//       totalPaid: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default RentChart;
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
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
//     const paid = payload[1].value;
//     const due = payload[0].value;
//     const percentage = due > 0 ? Math.min(100, (paid / due) * 100) : 0;

//     return (
//       <div className="bg-white dark:bg-gray-800 p-3 shadow-sm rounded-md border border-gray-200 dark:border-gray-700">
//         <p className="font-medium text-gray-900 dark:text-white">{label}</p>
//         <div className="space-y-1 mt-1">
//           <div className="flex items-center">
//             <div className="w-2 h-2 rounded-full bg-black dark:bg-gray-400 mr-2" />
//             <span className="text-xs text-gray-600 dark:text-gray-300">
//               Due:
//             </span>
//             <span className="ml-1 font-medium text-gray-900 dark:text-white">
//               ${due.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
//             <span className="text-xs text-gray-600 dark:text-gray-300">
//               Paid:
//             </span>
//             <span className="ml-1 font-medium text-gray-900 dark:text-white">
//               ${paid.toLocaleString()}
//             </span>
//           </div>
//           <div className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
//             <span className="text-xs text-gray-500 dark:text-gray-400">
//               {percentage.toFixed(1)}% collected
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// const RentChart = ({ data }) => {
//   const formatYAxis = (value) => {
//     if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
//     return `$${value}`;
//   };

//   return (
//     <Card className="relative overflow-hidden border-l-0">
//       {/* Subtle left accent line */}
//       <div className="absolute left-0 top-0 h-full w-[2px] bg-red-500"></div>

//       <CardHeader className="pb-2">
//         <CardTitle className="text-gray-900 dark:text-white">
//           Rent Collection Trends
//         </CardTitle>
//         <CardDescription className="text-gray-600 dark:text-gray-400">
//           Comparison of rent due versus paid
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart
//             data={data}
//             margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
//             barSize={32}
//           >
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
//               tickMargin={10}
//               tick={{ fill: "#6b7280" }}
//             />
//             <YAxis
//               stroke="#6b7280"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               tickMargin={10}
//               tick={{ fill: "#6b7280" }}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
//             />
//             <Legend
//               iconType="circle"
//               iconSize={8}
//               wrapperStyle={{ paddingTop: "12px" }}
//               formatter={(value) => (
//                 <span className="text-xs text-gray-600 dark:text-gray-300">
//                   {value}
//                 </span>
//               )}
//             />
//             <Bar
//               dataKey="totalDue"
//               name="Rent Due"
//               fill="#000000"
//               radius={[4, 4, 0, 0]}
//               animationDuration={1200}
//             />
//             <Bar
//               dataKey="totalPaid"
//               name="Rent Paid"
//               fill="#ef4444"
//               radius={[4, 4, 0, 0]}
//               animationDuration={1200}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//         <div className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">
//           Hover over bars for details
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// RentChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       totalDue: PropTypes.number.isRequired,
//       totalPaid: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default RentChart;

// /**
//  * RentChart.jsx
//  * Final version with all requested fixes
//  */
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
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
//     const paid = payload[1].value;
//     const due = payload[0].value;
//     const percentage = due > 0 ? Math.min(100, (paid / due) * 100) : 0;

//     return (
//       <div className="bg-white dark:bg-gray-900 p-4 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
//         <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
//         <div className="space-y-1 mt-2">
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-black dark:bg-white mr-2 border dark:border-gray-400" />
//             <span className="text-sm text-gray-600 dark:text-gray-300">
//               Due:
//             </span>
//             <span className="ml-2 font-medium text-gray-900 dark:text-white">
//               ${due.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
//             <span className="text-sm text-gray-600 dark:text-gray-300">
//               Paid:
//             </span>
//             <span className="ml-2 font-medium text-gray-900 dark:text-white">
//               ${paid.toLocaleString()}
//             </span>
//           </div>
//           <div className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-700">
//             <span className="text-xs text-gray-500 dark:text-gray-400">
//               {percentage.toFixed(1)}% collected
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// const RentChart = ({ data }) => {
//   const formatYAxis = (value) => {
//     if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
//     return `$${value}`;
//   };

//   return (
//     <Card className="shadow-sm hover:shadow-md transition-shadow">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
//           Rent Collection Trends
//         </CardTitle>
//         <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
//           Comparison of rent due versus paid
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart
//             data={data}
//             margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
//             barSize={32}
//           >
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#e5e7eb"
//               strokeOpacity={0.5}
//               vertical={false}
//             />
//             <XAxis
//               dataKey="name"
//               stroke="#6b7280"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickMargin={10}
//               tick={{ fill: "#6b7280" }}
//             />
//             <YAxis
//               stroke="#6b7280"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               tickMargin={10}
//               tick={{ fill: "#6b7280" }}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
//             />
//             <Legend
//               iconType="circle"
//               iconSize={10}
//               wrapperStyle={{ paddingTop: "16px" }}
//               formatter={(value) => (
//                 <span className="text-xs text-gray-600 dark:text-gray-300">
//                   {value}
//                 </span>
//               )}
//             />
//             <Bar
//               dataKey="totalDue"
//               name="Rent Due"
//               fill="#000000"
//               stroke="#ffffff"
//               strokeWidth={1}
//               radius={[4, 4, 0, 0]}
//               animationDuration={1500}
//             />
//             <Bar
//               dataKey="totalPaid"
//               name="Rent Paid"
//               fill="#ef4444"
//               radius={[4, 4, 0, 0]}
//               animationDuration={1500}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//         <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
//           Hover over bars for details
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// RentChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       totalDue: PropTypes.number.isRequired,
//       totalPaid: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default RentChart;

// /**
//  * RentChart.jsx
//  * Final working version with all fixes
//  */
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
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
//     const percentage =
//       payload[0].value > 0
//         ? Math.min(100, (payload[1].value / payload[0].value) * 100)
//         : 0;

//     return (
//       <div
//         className="p-4 shadow-lg rounded-lg border bg-popover text-popover-foreground"
//         style={{
//           borderColor: "hsl(var(--border))",
//         }}
//       >
//         <p className="font-semibold">{label}</p>
//         <div className="space-y-1 mt-2">
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-foreground mr-2" />
//             <span className="text-sm text-muted-foreground">Due:</span>
//             <span className="ml-2 font-medium">
//               ${payload[0].value.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
//             <span className="text-sm text-muted-foreground">Paid:</span>
//             <span className="ml-2 font-medium">
//               ${payload[1].value.toLocaleString()}
//             </span>
//           </div>
//           <div
//             className="pt-1 mt-1 border-t"
//             style={{ borderColor: "hsl(var(--border))" }}
//           >
//             <span className="text-xs text-muted-foreground">
//               {percentage.toFixed(1)}% collected
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// const RentChart = ({ data }) => {
//   const formatYAxis = (value) => {
//     if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
//     return `$${value}`;
//   };

//   return (
//     <Card className="shadow-sm hover:shadow-md transition-shadow">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-lg font-semibold">
//           Rent Collection Trends
//         </CardTitle>
//         <CardDescription className="text-sm">
//           Comparison of rent due versus paid
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart
//             data={data}
//             margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
//             barSize={32}
//           >
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="hsl(var(--border))"
//               vertical={false}
//             />
//             <XAxis
//               dataKey="name"
//               stroke="hsl(var(--muted-foreground))"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickMargin={10}
//             />
//             <YAxis
//               stroke="hsl(var(--muted-foreground))"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               tickMargin={10}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
//             />
//             <Legend
//               iconType="circle"
//               iconSize={10}
//               wrapperStyle={{ paddingTop: "16px" }}
//               formatter={(value) => (
//                 <span className="text-xs text-muted-foreground">{value}</span>
//               )}
//             />
//             <Bar
//               dataKey="totalDue"
//               name="Rent Due"
//               fill="hsl(var(--foreground))"
//               stroke="hsl(var(--background))"
//               strokeWidth={2}
//               radius={[4, 4, 0, 0]}
//               animationDuration={1500}
//             />
//             <Bar
//               dataKey="totalPaid"
//               name="Rent Paid"
//               fill="#ef4444"
//               radius={[4, 4, 0, 0]}
//               animationDuration={1500}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//         <div className="mt-2 text-xs text-center text-muted-foreground">
//           Hover over bars for details
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// RentChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       totalDue: PropTypes.number.isRequired,
//       totalPaid: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default RentChart;
// /**
//  * RentChart.jsx
//  * Final working version with all syntax errors fixed
//  */
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
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
//     // Fixed calculation with proper parentheses
//     const percentage =
//       payload[0].value > 0
//         ? Math.min(100, (payload[1].value / payload[0].value) * 100)
//         : 0;

//     return (
//       <div
//         className="p-4 shadow-lg rounded-lg border"
//         style={{
//           backgroundColor: "hsl(var(--background))",
//           borderColor: "hsl(var(--border))",
//         }}
//       >
//         <p
//           className="font-semibold"
//           style={{ color: "hsl(var(--foreground))" }}
//         >
//           {label}
//         </p>
//         <div className="space-y-1 mt-2">
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-black dark:bg-white mr-2" />
//             <span
//               className="text-sm"
//               style={{ color: "hsl(var(--muted-foreground))" }}
//             >
//               Due:
//             </span>
//             <span
//               className="ml-2 font-medium"
//               style={{ color: "hsl(var(--foreground))" }}
//             >
//               ${payload[0].value.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
//             <span
//               className="text-sm"
//               style={{ color: "hsl(var(--muted-foreground))" }}
//             >
//               Paid:
//             </span>
//             <span
//               className="ml-2 font-medium"
//               style={{ color: "hsl(var(--foreground))" }}
//             >
//               ${payload[1].value.toLocaleString()}
//             </span>
//           </div>
//           <div
//             className="pt-1 mt-1 border-t"
//             style={{ borderColor: "hsl(var(--border))" }}
//           >
//             <span
//               className="text-xs"
//               style={{ color: "hsl(var(--muted-foreground))" }}
//             >
//               {percentage.toFixed(1)}% collected
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// const RentChart = ({ data }) => {
//   const formatYAxis = (value) => {
//     if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
//     return `$${value}`;
//   };

//   return (
//     <Card className="shadow-sm hover:shadow-md transition-shadow">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-lg font-semibold">
//           Rent Collection Trends
//         </CardTitle>
//         <CardDescription className="text-sm">
//           Comparison of rent due versus paid
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart
//             data={data}
//             margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
//             barSize={32}
//           >
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="hsl(var(--border))"
//               vertical={false}
//             />
//             <XAxis
//               dataKey="name"
//               stroke="hsl(var(--muted-foreground))"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickMargin={10}
//             />
//             <YAxis
//               stroke="hsl(var(--muted-foreground))"
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               tickMargin={10}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
//             />
//             <Legend
//               iconType="circle"
//               iconSize={10}
//               wrapperStyle={{ paddingTop: "16px" }}
//               formatter={(value) => (
//                 <span
//                   className="text-xs"
//                   style={{ color: "hsl(var(--muted-foreground))" }}
//                 >
//                   {value}
//                 </span>
//               )}
//             />
//             <Bar
//               dataKey="totalDue"
//               name="Rent Due"
//               fill="hsl(var(--foreground))"
//               radius={[4, 4, 0, 0]}
//               animationDuration={1500}
//             />
//             <Bar
//               dataKey="totalPaid"
//               name="Rent Paid"
//               fill="#ef4444"
//               radius={[4, 4, 0, 0]}
//               animationDuration={1500}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//         <div
//           className="mt-2 text-xs text-center"
//           style={{ color: "hsl(var(--muted-foreground))" }}
//         >
//           Hover over bars for details
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// RentChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       totalDue: PropTypes.number.isRequired,
//       totalPaid: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default RentChart;

// /**
//  * RentChart.jsx
//  * Enhanced responsive bar chart for visualizing rent collection trends.
//  */
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// const COLORS = {
//   due: "#4f46e5",
//   paid: "#10b981",
//   grid: "#e2e8f0",
//   text: "#334155",
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const percentage =
//       payload[0].value > 0
//         ? Math.min(100, (payload[1].value / payload[0].value) * 100)
//         : 0;

//     return (
//       <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
//         <p className="font-semibold text-gray-800">{label}</p>
//         <div className="space-y-1 mt-2">
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2" />
//             <span className="text-sm text-gray-600">Due:</span>
//             <span className="ml-2 font-medium text-gray-900">
//               ${payload[0].value.toLocaleString()}
//             </span>
//           </div>
//           <div className="flex items-center">
//             <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
//             <span className="text-sm text-gray-600">Paid:</span>
//             <span className="ml-2 font-medium text-gray-900">
//               ${payload[1].value.toLocaleString()}
//             </span>
//           </div>
//           <div className="pt-1 mt-1 border-t border-gray-100">
//             <span className="text-xs text-gray-500">
//               {percentage.toFixed(1)}% collected
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
//   return null;
// };

// const RentChart = ({ data }) => {
//   const formatYAxis = (value) => {
//     if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
//     if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
//     return `$${value}`;
//   };

//   return (
//     <Card className="shadow-sm hover:shadow-md transition-shadow">
//       <CardHeader className="pb-2">
//         <CardTitle className="text-lg font-semibold text-gray-800">
//           Rent Collection Trends
//         </CardTitle>
//         <CardDescription className="text-sm text-gray-500">
//           Comparison of rent due versus paid
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <ResponsiveContainer width="100%" height={320}>
//           <BarChart
//             data={data}
//             margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
//             barSize={32}
//           >
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke={COLORS.grid}
//               vertical={false}
//             />
//             <XAxis
//               dataKey="name"
//               stroke={COLORS.text}
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickMargin={10}
//             />
//             <YAxis
//               stroke={COLORS.text}
//               fontSize={12}
//               tickLine={false}
//               axisLine={false}
//               tickFormatter={formatYAxis}
//               tickMargin={10}
//             />
//             <Tooltip
//               content={<CustomTooltip />}
//               cursor={{ fill: "rgba(226, 232, 240, 0.5)" }}
//             />
//             <Legend
//               iconType="circle"
//               iconSize={10}
//               wrapperStyle={{ paddingTop: "16px" }}
//               formatter={(value) => (
//                 <span className="text-xs text-gray-600">{value}</span>
//               )}
//             />
//             <Bar
//               dataKey="totalDue"
//               name="Rent Due"
//               fill={COLORS.due}
//               radius={[4, 4, 0, 0]}
//               animationDuration={1500}
//             />
//             <Bar
//               dataKey="totalPaid"
//               name="Rent Paid"
//               fill={COLORS.paid}
//               radius={[4, 4, 0, 0]}
//               animationDuration={1500}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//         <div className="mt-2 text-xs text-gray-500 text-center">
//           Hover over bars for details
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// RentChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       totalDue: PropTypes.number.isRequired,
//       totalPaid: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default RentChart;

// /**
//  * RentChart.jsx
//  * * This component displays a responsive bar chart for visualizing rent collection trends.
//  * It uses the Recharts library to compare total rent due versus rent paid over a series of months.
//  *
//  * @param {{data: Array<Object>}} props - The props for the component.
//  * - `data` should be an array of objects, e.g., [{ name: 'Jan', totalDue: 4000, totalPaid: 3800 }]
//  */
// import React from "react";
// import PropTypes from "prop-types";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// const RentChart = ({ data }) => {
//   // A function to format the ticks on the Y-axis to be more readable (e.g., $5k)
//   const formatYAxis = (tickItem) => `$${(tickItem / 1000).toLocaleString()}k`;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Rent Collection (Last 6 Months)</CardTitle>
//         <CardDescription>
//           A summary of rent due versus rent paid.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart
//             data={data}
//             margin={{
//               top: 5,
//               right: 20,
//               left: 10,
//               bottom: 5,
//             }}
//           >
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
//             />
//             <Tooltip
//               cursor={{ fill: "hsl(var(--muted))" }}
//               contentStyle={{
//                 backgroundColor: "hsl(var(--background))",
//                 borderColor: "hsl(var(--border))",
//                 borderRadius: "var(--radius)",
//               }}
//               formatter={(value) => `$${value.toLocaleString()}`}
//             />
//             <Legend iconType="circle" />
//             <Bar
//               dataKey="totalDue"
//               name="Rent Due"
//               fill="hsl(var(--secondary-foreground))"
//               radius={[4, 4, 0, 0]}
//             />
//             <Bar
//               dataKey="totalPaid"
//               name="Rent Paid"
//               fill="hsl(var(--primary))"
//               radius={[4, 4, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   );
// };

// RentChart.propTypes = {
//   data: PropTypes.arrayOf(
//     PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       totalDue: PropTypes.number.isRequired,
//       totalPaid: PropTypes.number.isRequired,
//     })
//   ).isRequired,
// };

// export default RentChart;
