import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const ActionHub = ({ tabs, defaultTab }) => {
  // If no default is provided, use the first tab's ID
  const [activeTab, setActiveTab] = useState(
    defaultTab || (tabs.length > 0 ? tabs[0].id : "")
  );

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const isCurrentTabUrgent = currentTab?.urgent || false;

  return (
    <section className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full gap-0 border-b border-gray-200 bg-transparent p-0 dark:border-gray-700">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "relative px-4 py-3 text-sm font-medium transition-colors data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground/80",
                tab.urgent
                  ? "data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400"
                  : "data-[state=active]:text-foreground"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "absolute -bottom-px left-0 right-0 h-0.5 transition-opacity data-[state=active]:opacity-100",
                  tab.urgent ? "bg-red-500" : "bg-black dark:bg-gray-400"
                )}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Dynamic Content Container */}
        <div
          className={cn(
            "relative mt-2 overflow-hidden rounded-lg border bg-card text-card-foreground transition-colors",
            isCurrentTabUrgent
              ? "border-red-500/20 dark:border-red-500/30"
              : "border-gray-200 dark:border-gray-700"
          )}
        >
          {/* Unified Accent Bar */}
          <div
            className={cn(
              "absolute left-0 top-0 h-full w-[2px]",
              isCurrentTabUrgent ? "bg-red-500" : "bg-black dark:bg-gray-500"
            )}
          ></div>

          {/* Render the content for each tab */}
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="p-6 pl-8">
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </section>
  );
};

export default ActionHub;
