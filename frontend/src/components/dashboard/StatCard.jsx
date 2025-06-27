// src/components/dashboard/StatCard.jsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard = ({ title, value, description, icon: Icon, color }) => {
  return (
    <Card className={color ? `border-${color}-500/50 dark:border-${color}-500/80` : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 text-muted-foreground ${color ? `text-${color}-500 dark:text-${color}-400` : ''}`} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;