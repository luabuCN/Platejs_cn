'use client';

import React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import {
  useEditorRef,
  usePlateState,
  usePluginOption,
} from '@udecode/plate/react';
import { Eye, Pen, PencilLineIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from './dropdown-menu';
import { ToolbarButton } from './toolbar';

export function ModeDropdownMenu(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [readOnly, setReadOnly] = usePlateState('readOnly');
  const openState = useOpenState();

  const isSuggesting = usePluginOption(SuggestionPlugin, 'isSuggesting');

  let value = '编辑中';

  if (readOnly) value = '查看中';
  
  if (isSuggesting) value = '建议';

  const item: any = {
    editing: (
      <>
        <Pen />
        <span className="hidden lg:inline">编辑中</span>
      </>
    ),
    suggestion: (
      <>
        <PencilLineIcon />
        <span className="hidden lg:inline">建议</span>
      </>
    ),
    viewing: (
      <>
        <Eye />
        <span className="hidden lg:inline">查看中</span>
      </>
    ),
  };

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton
          pressed={openState.open}
          tooltip="编辑模式"
          isDropdown
        >
          {item[value]}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[180px]" align="start">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(newValue) => {
            if (newValue === '查看中') {
              setReadOnly(true);

              return;
            } else {
              setReadOnly(false);
            }

            if (newValue === '建议') {
              editor.setOption(SuggestionPlugin, 'isSuggesting', true);

              return;
            } else {
              editor.setOption(SuggestionPlugin, 'isSuggesting', false);
            }

            if (newValue === '编辑中') {
              editor.tf.focus();

              return;
            }
          }}
        >
          <DropdownMenuRadioItem value="编辑中">
            {item.editing}
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="查看中">
            {item.viewing}
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="建议">
            {item.suggestion}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
