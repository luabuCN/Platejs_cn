'use client';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate, type PlateCorePlugin, type TPlateEditor } from '@udecode/plate/react';

import { useCreateEditor } from '@/components/editor/use-create-editor';
import { SettingsDialog } from '@/components/editor/settings';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import type { Value } from '@udecode/plate';

const value = '[{"children":[{"text":"测试"}],"type":"h1","id":"-8Cmr1OzE8"},{"children":[{"text":"A rich-text editor with AI capabilities. Try the "},{"bold":true,"text":"AI commands"},{"text":" or use "},{"kbd":true,"text":"Cmd+J"},{"text":" to open the AI menu."}],"type":"p","id":"zYi9mrLqjO"},{"type":"p","id":"J_aVjTGHTx","children":[{"text":""}]},{"children":[{"text":""}],"type":"p","id":"K34w553qRw"},{"children":[{"text":""}],"isUpload":true,"name":"","placeholderId":"Q-qrsOAcVlzDwFIRDXk3U","type":"img","url":"https://utfs.io/f/utsU4OeSn82t3qRqiKMBm8ZL9aiIueJzt5lEGphY0RQDncNP","id":"V4GabTePw4"},{"children":[{"text":""}],"type":"p","id":"klXcms2k_h"}]'

export function PlateEditor() {
  const editor = useCreateEditor();
  const handleChange = (value: {
    editor: TPlateEditor<Value, PlateCorePlugin>;
    value: Value;
  }) => {
    console.log('editor changed', JSON.stringify(value.editor.children));
  }


  return (
    <DndProvider backend={HTML5Backend}>
      <Plate onChange={handleChange}  editor={editor}>
        <EditorContainer >
          <Editor variant='fullWidth' placeholder='请输入文本或者询问 Ai'/>
        </EditorContainer>
        <SettingsDialog />
      </Plate> 
    </DndProvider>
  );
}
