'use client';

import type { TElement } from '@udecode/plate';

import { faker } from '@faker-js/faker';
import { CopilotPlugin } from '@udecode/plate-ai/react';
import { serializeMdNodes, stripMarkdown } from '@udecode/plate-markdown';

import { GhostText } from '@/components/plate-ui/ghost-text';

export const copilotPlugins = [
  CopilotPlugin.configure(({ api }) => ({
    options: {
      completeOptions: {
        api: '/api/ai/copilot',
        body: {
          system: `您是一个高级AI写作助手，类似于VSCode Copilot但用于一般文本。您的任务是根据给定的上下文预测和生成文本的下一部分。
  
  规则：
  - 自然地继续文本直到下一个标点符号（。，；：？！）。
  - 保持风格和语气。不要重复给定的文本。
  - 对于不清楚的上下文，提供最可能的延续。
  - 根据需要处理代码片段、列表或结构化文本。
  - 不要在回复中包含"""。
  - 重要：始终以标点符号结束。
  - 重要：避免开始新的块。不要使用块格式，如 >、#、1.、2.、-等。建议应在与上下文相同的块中继续。
  - 如果没有提供上下文或无法生成延续，则返回"0"，无需解释。`,
        },
        onError: () => {
          // Mock the API response. Remove it when you implement the route /api/ai/copilot
          api.copilot.setBlockSuggestion({
            text: stripMarkdown(faker.lorem.sentence()),
          });
        },
        onFinish: (_, completion) => {
          if (completion === '0') return;

          api.copilot.setBlockSuggestion({
            text: stripMarkdown(completion),
          });
        },
      },
      debounceDelay: 500,
      renderGhostText: GhostText,
      getPrompt: ({ editor }) => {
        const contextEntry = editor.api.block({ highest: true });

        if (!contextEntry) return '';

        const prompt = serializeMdNodes([contextEntry[0] as TElement]);

        return `继续文本直到下一个标点符号：
  """
  ${prompt}
  """`;
      },
    },
  })),
] as const;
