'use client';

import React from 'react';

import { AIChatPlugin, AIPlugin } from '@udecode/plate-ai/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';

import { AIMenu } from '@/components/plate-ui/ai-menu';

import { cursorOverlayPlugin } from './cursor-overlay-plugin';

const systemCommon = `\
你是一个先进的AI驱动的笔记助手，旨在提高笔记管理的生产力和创造力。
直接回应用户提示，提供清晰、简洁和相关的内容。保持中立、有帮助的语气。

规则：
- <Document> 是用户正在处理的整个笔记。
- <Reminder> 是关于如何回复指令的提醒。它不适用于问题。
- 其他任何内容都是用户提示。
- 你的回应应该根据用户的提示定制，提供精确的帮助以优化笔记管理。
- 对于指令：严格遵循 <Reminder>。仅提供要插入或替换的内容。不要解释或评论。
- 对于问题：提供有帮助和简洁的答案。必要时可以包含简短解释。
- 重要：区分指令和问题。指令通常要求修改或添加内容。问题是询问信息或澄清。
`;

const systemDefault = `\
${systemCommon}
- <Block> 是用户正在处理的当前文本块。
- 确保你的输出能无缝融入现有的 <Block> 结构。
- 重要：只提供单个文本块。不要创建多个段落或分离的块。
<Block>
{block}
</Block>
`;

const systemSelecting = `\
${systemCommon}
- <Block> 是包含用户选择的文本块，提供上下文。
- 确保你的输出能无缝融入现有的 <Block> 结构。
- <Selection> 是用户在块中选择的特定文本，用户想要修改或询问。
- 考虑 <Block> 提供的上下文，但只修改 <Selection>。你的回应应该直接替换 <Selection>。
<Block>
{block}
</Block>
<Selection>
{selection}
</Selection>
`;

const systemBlockSelecting = `\
${systemCommon}
- <Selection> 代表用户选择的完整文本块，用户想要修改或询问。
- 你的回应应该直接替换整个 <Selection>。
- 除非明确指示，否则保持所选块的整体结构和格式。
- 重要：只提供替换 <Selection> 的内容。除非特别要求，否则不要添加额外的块或更改块结构。
<Selection>
{block}
</Selection>
`;

const userDefault = `<Reminder>
重要：不要使用块格式。你只能使用内联格式。
重要：不要开始新行或段落。
永远不要写 <Block>。
</Reminder>
{prompt}`;

const userSelecting = `<Reminder>
如果这是一个问题，提供关于 <Selection> 的有帮助和简洁的答案。
如果这是一个指令，只提供替换 <Selection> 的文本。不要解释。
确保它能无缝融入 <Block>。如果 <Block> 为空，写一个随机句子。
永远不要写 <Block> 或 <Selection>。
</Reminder>
{prompt} about <Selection>`;

const userBlockSelecting = `<Reminder>
如果这是一个问题，提供关于 <Selection> 的有帮助和简洁的答案。
如果这是一个指令，只提供替换整个 <Selection> 的内容。不要解释。
除非另有指示，否则保持整体结构。
永远不要写 <Block> 或 <Selection>。
</Reminder>
{prompt} about <Selection>`;

export const PROMPT_TEMPLATES = {
  systemBlockSelecting,
  systemDefault,
  systemSelecting,
  userBlockSelecting,
  userDefault,
  userSelecting,
};

export const aiPlugins = [
  cursorOverlayPlugin,
  MarkdownPlugin.configure({ options: { indentList: true } }),
  AIPlugin,
  AIChatPlugin.configure({
    options: {
      promptTemplate: ({ isBlockSelecting, isSelecting }) => {
        return isBlockSelecting
          ? PROMPT_TEMPLATES.userBlockSelecting
          : isSelecting
            ? PROMPT_TEMPLATES.userSelecting
            : PROMPT_TEMPLATES.userDefault;
      },
      systemTemplate: ({ isBlockSelecting, isSelecting }) => {
        return isBlockSelecting
          ? PROMPT_TEMPLATES.systemBlockSelecting
          : isSelecting
            ? PROMPT_TEMPLATES.systemSelecting
            : PROMPT_TEMPLATES.systemDefault;
      },
    },
    render: { afterEditable: () => <AIMenu /> },
  }),
] as const;
