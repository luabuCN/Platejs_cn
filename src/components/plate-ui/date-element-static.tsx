import React from 'react';

import type { SlateElementProps } from '@udecode/plate';

import { cn } from '@udecode/cn';
import { SlateElement } from '@udecode/plate';

export function DateElementStatic({
  children,
  className,
  ...props
}: SlateElementProps) {
  const { element } = props;

  return (
    <SlateElement className={cn(className, 'inline-block')} {...props}>
      <span
        className={cn('w-fit rounded-sm bg-muted px-1 text-muted-foreground')}
      >
        {element.date ? (
          (() => {
            const today = new Date();
            const elementDate = new Date(element.date as string);
            const isToday =
              elementDate.getDate() === today.getDate() &&
              elementDate.getMonth() === today.getMonth() &&
              elementDate.getFullYear() === today.getFullYear();

            const isYesterday =
              new Date(today.setDate(today.getDate() - 1)).toDateString() ===
              elementDate.toDateString();
            const isTomorrow =
              new Date(today.setDate(today.getDate() + 2)).toDateString() ===
              elementDate.toDateString();

            if (isToday) return '今天';
            if (isYesterday) return '昨天';
            if (isTomorrow) return '明天';

            return elementDate.toLocaleDateString('zh-CN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
          })()
        ) : (
          <span>选择日期</span>
        )}
      </span>
      {children}
    </SlateElement>
  );
}
