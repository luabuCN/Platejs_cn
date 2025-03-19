'use client';

import React from 'react';

import { withRef } from '@udecode/cn';
import { AIChatPlugin } from '@udecode/plate-ai/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import {
  EquationPlugin,
  InlineEquationPlugin,
} from '@udecode/plate-math/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { type PlateEditor, ParagraphPlugin } from '@udecode/plate/react';
import { PlateElement } from '@udecode/plate/react';
import {
  CalendarIcon,
  ChevronRightIcon,
  Code2,
  Columns3Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrdered,
  PilcrowIcon,
  Quote,
  RadicalIcon,
  SparklesIcon,
  Square,
  Table,
  TableOfContentsIcon,
} from 'lucide-react';

import {
  insertBlock,
  insertInlineElement,
} from '@/components/editor/transforms';

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxGroupLabel,
  InlineComboboxInput,
  InlineComboboxItem,
} from './inline-combobox';

type Group = {
  group: string;
  items: Item[];
};

interface Item {
  icon: React.ReactNode;

  value: string;

  onSelect: (editor: PlateEditor, value: string) => void;
  className?: string;
  focusEditor?: boolean;
  keywords?: string[];
  label?: string;
}

const groups: Group[] = [
  {
    group: 'AI',
    items: [
      {
        focusEditor: false,
        icon: <SparklesIcon />,
        value: 'AI',
        onSelect: (editor) => {
          editor.getApi(AIChatPlugin).aiChat.show();
        },
      },
    ],
  },
  {
    group: '基本块',
    items: [
      {
        icon: <PilcrowIcon />,
        keywords: ['paragraph'],
        label: '文本',
        value: ParagraphPlugin.key,
      },
      {
        icon: <Heading1Icon />,
        keywords: ['title', 'h1'],
        label: '标题 1',
        value: HEADING_KEYS.h1,
      },
      {
        icon: <Heading2Icon />,
        keywords: ['subtitle', 'h2'],
        label: '标题 2',
        value: HEADING_KEYS.h2,
      },
      {
        icon: <Heading3Icon />,
        keywords: ['subtitle', 'h3'],
        label: '标题 3',
        value: HEADING_KEYS.h3,
      },
      {
        icon: <ListIcon />,
        keywords: ['unordered', 'ul', '-'],
        label: '项目符号列表',
        value: ListStyleType.Disc,
      },
      {
        icon: <ListOrdered />,
        keywords: ['ordered', 'ol', '1'],
        label: '编号列表',
        value: ListStyleType.Decimal,
      },
      {
        icon: <Square />,
        keywords: ['checklist', 'task', 'checkbox', '[]'],
        label: '待办事项列表',
        value: INDENT_LIST_KEYS.todo,
      },
      {
        icon: <ChevronRightIcon />,
        keywords: ['collapsible', 'expandable'],
        label: '切换',
        value: TogglePlugin.key,
      },
      {
        icon: <Code2 />,
        keywords: ['```'],
        label: '代码块',
        value: CodeBlockPlugin.key,
      },
      {
        icon: <Table />,
        label: '表格',
        value: TablePlugin.key,
      },
      {
        icon: <Quote />,
        keywords: ['citation', 'blockquote', 'quote', '>'],
        label: '引用',
        value: BlockquotePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: '高级块',
    items: [
      {
        icon: <TableOfContentsIcon />,
        keywords: ['toc'],
        label: '目录',
        value: TocPlugin.key,
      },
      {
        icon: <Columns3Icon />,
        label: '三列',
        value: 'action_three_columns',
      },
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: '方程',
        value: EquationPlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: '内联',
    items: [
      {
        focusEditor: true,
        icon: <CalendarIcon />,
        keywords: ['time'],
        label: '日期',
        value: DatePlugin.key,
      },
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: '内联方程',
        value: InlineEquationPlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value);
      },
    })),
  },
];

export const SlashInputElement = withRef<typeof PlateElement>(
  ({ className, ...props }, ref) => {
    const { children, editor, element } = props;

    return (
      <PlateElement
        ref={ref}
        as="span"
        className={className}
        data-slate-value={element.value}
        {...props}
      >
        <InlineCombobox element={element} trigger="/">
          <InlineComboboxInput />

          <InlineComboboxContent>
            <InlineComboboxEmpty>没有结果</InlineComboboxEmpty>

            {groups.map(({ group, items }) => (
              <InlineComboboxGroup key={group}>
                <InlineComboboxGroupLabel>{group}</InlineComboboxGroupLabel>

                {items.map(
                  ({ focusEditor, icon, keywords, label, value, onSelect }) => (
                    <InlineComboboxItem
                      key={value}
                      value={value}
                      onClick={() => onSelect(editor, value)}
                      label={label}
                      focusEditor={focusEditor}
                      group={group}
                      keywords={keywords}
                    >
                      <div className="mr-2 text-muted-foreground">{icon}</div>
                      {label ?? value}
                    </InlineComboboxItem>
                  )
                )}
              </InlineComboboxGroup>
            ))}
          </InlineComboboxContent>
        </InlineCombobox>

        {children}
      </PlateElement>
    );
  }
);
