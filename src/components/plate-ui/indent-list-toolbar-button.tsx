'use client';

import React from 'react';

import {
  ListStyleType,
  someIndentList,
  toggleIndentList,
} from '@udecode/plate-indent-list';
import { useEditorRef, useEditorSelector } from '@udecode/plate/react';
import { List, ListOrdered } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import {
  ToolbarSplitButton,
  ToolbarSplitButtonPrimary,
  ToolbarSplitButtonSecondary,
} from './toolbar';

export function NumberedIndentListToolbarButton() {
  const editor = useEditorRef();
  const openState = useOpenState();

  const pressed = useEditorSelector(
    (editor) =>
      someIndentList(editor, [
        ListStyleType.Decimal,
        ListStyleType.LowerAlpha,
        ListStyleType.UpperAlpha,
        ListStyleType.LowerRoman,
        ListStyleType.UpperRoman,
      ]),
    []
  );

  return (
    <ToolbarSplitButton pressed={openState.open}>
      <ToolbarSplitButtonPrimary
        className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        onClick={() =>
          toggleIndentList(editor, {
            listStyleType: ListStyleType.Decimal,
          })
        }
        data-state={pressed ? 'on' : 'off'}
        tooltip="编号列表"
      >
        <ListOrdered className="size-4" />
      </ToolbarSplitButtonPrimary>

      <DropdownMenu {...openState} modal={false}>
        <DropdownMenuTrigger asChild>
          <ToolbarSplitButtonSecondary />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" alignOffset={-32}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.Decimal,
                })
              }
            >
              数字 (1, 2, 3)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.LowerAlpha,
                })
              }
            >
              小写字母 (a, b, c)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.UpperAlpha,
                })
              }
            >
              大写字母 (A, B, C)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.LowerRoman,
                })
              }
            >
              小写罗马数字 (i, ii, iii)
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.UpperRoman,
                })
              }
            >
              大写罗马数字 (I, II, III)
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ToolbarSplitButton>
  );
}

export function BulletedIndentListToolbarButton() {
  const editor = useEditorRef();
  const openState = useOpenState();

  const pressed = useEditorSelector(
    (editor) =>
      someIndentList(editor, [
        ListStyleType.Disc,
        ListStyleType.Circle,
        ListStyleType.Square,
      ]),
    []
  );

  return (
    <ToolbarSplitButton pressed={openState.open}>
      <ToolbarSplitButtonPrimary
        className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        onClick={() => {
          toggleIndentList(editor, {
            listStyleType: ListStyleType.Disc,
          });
        }}
        data-state={pressed ? 'on' : 'off'}
        tooltip="项目符号列表"
      >
        <List className="size-4" />
      </ToolbarSplitButtonPrimary>

      <DropdownMenu {...openState} modal={false}>
        <DropdownMenuTrigger asChild>
          <ToolbarSplitButtonSecondary />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" alignOffset={-32}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.Disc,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full border border-current bg-current" />
                默认
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.Circle,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full border border-current" />
                空心圆
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toggleIndentList(editor, {
                  listStyleType: ListStyleType.Square,
                })
              }
            >
              <div className="flex items-center gap-2">
                <div className="size-2 border border-current bg-current" />
                方块
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ToolbarSplitButton>
  );
}
