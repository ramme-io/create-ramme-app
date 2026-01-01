import React from 'react';
import { Card } from '@ramme-io/ui';

export const ChartLine: React.FC<{ title: string; description?: string }> = ({ title, description }) => {
  return (
    <Card className="p-6 h-full min-h-[300px] flex flex-col">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      
      {/* Visual Mockup of a Chart */}
      <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 mt-4 border-b border-l border-border/50">
        {[40, 70, 45, 90, 65, 85, 55, 95, 75, 60, 90, 100].map((h, i) => (
           <div key={i} className="w-full flex flex-col items-center gap-2 group">
              <div 
                className="w-full bg-primary/20 group-hover:bg-primary/80 transition-all rounded-t-sm"
                style={{ height: `${h}%` }}
              />
           </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground px-2">
         <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
      </div>
    </Card>
  );
};