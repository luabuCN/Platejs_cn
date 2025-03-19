'use client';

import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
  EquationPlugin,
  InlineEquationPlugin,
} from '@udecode/plate-math/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
  type PlateEditor,
  ParagraphPlugin,
  useEditorRef,
} from '@udecode/plate/react';
import {
  CalendarIcon,
  ChevronRightIcon,
  Columns3Icon,
  FileCodeIcon,
  FilmIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PenToolIcon,
  PilcrowIcon,
  PlusIcon,
  QuoteIcon,
  RadicalIcon,
  SquareIcon,
  TableIcon,
  TableOfContentsIcon,
} from 'lucide-react';

import {
  insertBlock,
  insertInlineElement,
} from '@/components/editor/transforms';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';

type Group = {
  group: string;
  items: Item[];
};

interface Item {
  icon: React.ReactNode;
  value: string;
  onSelect: (editor: PlateEditor, value: string) => void;
  focusEditor?: boolean;
  label?: string;
}

const groups: Group[] = [
  {
    group: '基本块',
    items: [
      {
        icon: <PilcrowIcon />,
        label: '段落',
        value: ParagraphPlugin.key,
      },
      {
        icon: <Heading1Icon />,
        label: '标题 1',
        value: HEADING_KEYS.h1,
      },
      {
        icon: <Heading2Icon />,
        label: '标题 2',
        value: HEADING_KEYS.h2,
      },
      {
        icon: <Heading3Icon />,
        label: '标题 3',
        value: HEADING_KEYS.h3,
      },
      {
        icon: <TableIcon />,
        label: '表格',
        value: TablePlugin.key,
      },
      {
        icon: <FileCodeIcon />,
        label: '代码',
        value: CodeBlockPlugin.key,
      },
      {
        icon: <QuoteIcon />,
        label: '引用',
        value: BlockquotePlugin.key,
      },
      {
        icon: <MinusIcon />,
        label: '分隔符',
        value: HorizontalRulePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: '列表',
    items: [
      {
        icon: <ListIcon />,
        label: '项目符号列表',
        value: ListStyleType.Disc,
      },
      {
        icon: <ListOrderedIcon />,
        label: '编号列表',
        value: ListStyleType.Decimal,
      },
      {
        icon: <SquareIcon />,
        label: '待办事项列表',
        value: INDENT_LIST_KEYS.todo,
      },
      {
        icon: <ChevronRightIcon />,
        label: '切换列表',
        value: TogglePlugin.key,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: '媒体',
    items: [
      {
        icon: <ImageIcon />,
        label: '图片',
        value: ImagePlugin.key,
      },
      {
        icon: <FilmIcon />,
        label: '嵌入',
        value: MediaEmbedPlugin.key,
      },
      {
        icon: <PenToolIcon />,
        label: 'Excalidraw',
        value: ExcalidrawPlugin.key,
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
    group: '行内',
    items: [
      {
        icon: <Link2Icon />,
        label: '链接',
        value: LinkPlugin.key,
      },
      {
        focusEditor: true,
        icon: <CalendarIcon />,
        label: '日期',
        value: DatePlugin.key,
      },
      {
        focusEditor: false,
        icon: <RadicalIcon />,
        label: '行内方程',
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

export function InsertDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="插入" isDropdown>
          <PlusIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex max-h-[500px] min-w-0 flex-col overflow-y-auto"
        align="start"
      >
        {groups.map(({ group, items: nestedItems }) => (
          <DropdownMenuGroup key={group} label={group}>
            {nestedItems.map(({ icon, label, value, onSelect }) => (
              <DropdownMenuItem
                key={value}
                className="min-w-[180px]"
                onSelect={() => {
                  onSelect(editor, value);
                  editor.tf.focus();
                }}
              >
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
