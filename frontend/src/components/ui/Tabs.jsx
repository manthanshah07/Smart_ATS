import * as React from 'react'
import { cn } from '../../lib/utils'

export const Tabs = ({ tabs = [], activeTab, onChange, className }) => {
  return (
    <div className={cn('flex items-center gap-1 border-b border-border/80 pb-px overflow-x-auto', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px',
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'ml-1 rounded-full px-2 py-0.5 text-[10px] font-mono',
                  isActive ? 'bg-primary/10 text-primary font-bold' : 'bg-muted text-muted-foreground'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
