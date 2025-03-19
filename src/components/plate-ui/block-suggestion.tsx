'use client';

import React, { useMemo, useState } from 'react';

import type {
  TResolvedSuggestion,
  TSuggestionElement,
  TSuggestionText,
} from '@udecode/plate-suggestion';

import { cn } from '@udecode/cn';
import {
  type NodeEntry,
  type Path,
  type TElement,
  ElementApi,
  PathApi,
  TextApi,
} from '@udecode/plate';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CalloutPlugin } from '@udecode/plate-callout/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { INDENT_LIST_KEYS, ListStyleType } from '@udecode/plate-indent-list';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import { EquationPlugin } from '@udecode/plate-math/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import {
  acceptSuggestion,
  getSuggestionKey,
  keyId2SuggestionId,
  rejectSuggestion,
} from '@udecode/plate-suggestion';
import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import { TablePlugin } from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
  ParagraphPlugin,
  useEditorPlugin,
  useStoreSelect,
} from '@udecode/plate/react';
import { CheckIcon, XIcon } from 'lucide-react';

import { suggestionPlugin } from '@/components/editor/plugins/suggestion-plugin';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import {
  type TDiscussion,
  discussionStore,
  useFakeUserInfo,
} from './block-discussion';
import { Button } from './button';
import { type TComment, Comment, formatCommentDate } from './comment';
import { CommentCreateForm } from './comment-create-form';

export interface ResolvedSuggestion extends TResolvedSuggestion {
  comments: TComment[];
}

export const BLOCK_SUGGESTION = '__block__';

export const TYPE_TEXT_MAP: Record<string, (node?: TElement) => string> = {
  [AudioPlugin.key]: () => '音频',
  [BlockquotePlugin.key]: () => '引用',
  [CalloutPlugin.key]: () => '标注',
  [CodeBlockPlugin.key]: () => '代码块',
  [ColumnPlugin.key]: () => '列',
  [EquationPlugin.key]: () => '公式',
  [FilePlugin.key]: () => '文件',
  [HEADING_KEYS.h1]: () => `标题 1`,
  [HEADING_KEYS.h2]: () => `标题 2`,
  [HEADING_KEYS.h3]: () => `标题 3`,
  [HEADING_KEYS.h4]: () => `标题 4`,
  [HEADING_KEYS.h5]: () => `标题 5`,
  [HEADING_KEYS.h6]: () => `标题 6`,
  [HorizontalRulePlugin.key]: () => '分割线',
  [ImagePlugin.key]: () => '图片',
  [MediaEmbedPlugin.key]: () => '媒体',
  [ParagraphPlugin.key]: (node) => {
    if (node?.[IndentListPlugin.key] === INDENT_LIST_KEYS.todo)
      return '待办事项';
    if (node?.[IndentListPlugin.key] === ListStyleType.Decimal)
      return '有序列表';
    if (node?.[IndentListPlugin.key] === ListStyleType.Disc) return '列表';

    return '段落';
  },
  [TablePlugin.key]: () => '表格',
  [TocPlugin.key]: () => '目录',
  [TogglePlugin.key]: () => '折叠',
  [VideoPlugin.key]: () => '视频',
};

export const BlockSuggestionCard = ({
  idx,
  isLast,
  suggestion,
}: {
  idx: number;
  isLast: boolean;
  suggestion: ResolvedSuggestion;
}) => {
  const { api, editor } = useEditorPlugin(SuggestionPlugin);

  const userInfo = useFakeUserInfo(suggestion.userId);

  const accept = (suggestion: ResolvedSuggestion) => {
    api.suggestion.withoutSuggestions(() => {
      acceptSuggestion(editor, suggestion);
    });
  };

  const reject = (suggestion: ResolvedSuggestion) => {
    api.suggestion.withoutSuggestions(() => {
      rejectSuggestion(editor, suggestion);
    });
  };

  const [hovering, setHovering] = useState(false);

  const suggestionText2Array = (text: string) => {
    if (text === BLOCK_SUGGESTION) return ['换行'];

    return text.split(BLOCK_SUGGESTION).filter(Boolean);
  };

  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div
      key={`${suggestion.suggestionId}-${idx}`}
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="flex flex-col p-4">
        <div className="relative flex items-center">
          {/* 替换为你自己的后端或参考 potion */}
          <Avatar className="size-6">
            <AvatarImage
              alt={userInfo?.name}
              src={userInfo?.avatarUrl}
            />
            <AvatarFallback>
              {userInfo?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <h4 className="mx-2 text-sm leading-none font-semibold">
            {userInfo?.name}
          </h4>
          <div className="text-xs leading-none text-muted-foreground/80">
            <span className="mr-1">
              {formatCommentDate(new Date(suggestion.createdAt))}
            </span>
          </div>
        </div>

        <div className="relative mt-1 mb-4 pl-[32px]">
          <div className="flex flex-col gap-2">
            {suggestion.type === 'remove' && (
              <React.Fragment>
                {suggestionText2Array(suggestion.text!).map((text, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      删除:
                    </span>

                    <span key={index} className="text-sm">
                      {text}
                    </span>
                  </div>
                ))}
              </React.Fragment>
            )}

            {suggestion.type === 'insert' && (
              <React.Fragment>
                {suggestionText2Array(suggestion.newText!).map(
                  (text, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        添加:
                      </span>

                      <span key={index} className="text-sm">
                        {text || '换行'}
                      </span>
                    </div>
                  )
                )}
              </React.Fragment>
            )}

            {suggestion.type === 'replace' && (
              <div className="flex flex-col gap-2">
                {suggestionText2Array(suggestion.newText!).map(
                  (text, index) => (
                    <React.Fragment key={index}>
                      <div
                        key={index}
                        className="flex items-center text-brand/80"
                      >
                        <span className="text-sm">替换为:</span>
                        <span className="text-sm">{text || '换行'}</span>
                      </div>
                    </React.Fragment>
                  )
                )}

                {suggestionText2Array(suggestion.text!).map((text, index) => (
                  <React.Fragment key={index}>
                    <div key={index} className="flex items-center">
                      <span className="text-sm text-muted-foreground">
                        {index === 0 ? '替换:' : '删除:'}
                      </span>
                      <span className="text-sm">{text || '换行'}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}

            {suggestion.type === 'update' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {Object.keys(suggestion.properties).map((key) => (
                    <span key={key}>取消{key}</span>
                  ))}

                  {Object.keys(suggestion.newProperties).map((key) => (
                    <span key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  ))}
                </span>
                <span className="text-sm">{suggestion.newText}</span>
              </div>
            )}
          </div>
        </div>

        {suggestion.comments.map((comment, index) => (
          <Comment
            key={comment.id ?? index}
            comment={comment}
            discussionLength={suggestion.comments.length}
            documentContent="__suggestion__"
            editingId={editingId}
            index={index}
            setEditingId={setEditingId}
          />
        ))}

        {hovering && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              className="h-6 p-1 text-muted-foreground"
              onClick={() => accept(suggestion)}
            >
              <CheckIcon className="size-4" />
            </Button>

            <Button
              variant="ghost"
              className="h-6 p-1 text-muted-foreground"
              onClick={() => reject(suggestion)}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        )}

        <CommentCreateForm
          discussionId={suggestion.suggestionId}
          isSuggesting={suggestion.comments.length === 0}
        />
      </div>

      {!isLast && <div className="h-px w-full bg-muted" />}
    </div>
  );
};

export const useResolveSuggestion = (
  suggestionNodes: NodeEntry<TElement | TSuggestionText>[],
  blockPath: Path
) => {
  const discussions = useStoreSelect(
    discussionStore,
    (state) => state.discussions
  );

  const { api, editor, getOption, setOption } =
    useEditorPlugin(suggestionPlugin);

  suggestionNodes.forEach(([node]) => {
    const id = api.suggestion.nodeId(node);
    const map = getOption('uniquePathMap');

    if (!id) return;

    const previousPath = map.get(id);

    // 如果映射中相应路径没有建议节点，则更新它
    if (PathApi.isPath(previousPath)) {
      const nodes = api.suggestion.node({ id, at: previousPath, isText: true });
      const parentNode = api.node(previousPath);
      let lineBreakId: string | null = null;

      if (parentNode && ElementApi.isElement(parentNode[0])) {
        lineBreakId = api.suggestion.nodeId(parentNode[0]) ?? null;
      }

      if (!nodes && lineBreakId !== id) {
        return setOption('uniquePathMap', new Map(map).set(id, blockPath));
      }

      return;
    }
    setOption('uniquePathMap', new Map(map).set(id, blockPath));
  });

  const resolvedSuggestion: ResolvedSuggestion[] = useMemo(() => {
    const map = getOption('uniquePathMap');

    if (suggestionNodes.length === 0) return [];

    const suggestionIds = new Set(
      suggestionNodes
        .flatMap(([node]) => {
          if (TextApi.isText(node)) {
            const dataList = api.suggestion.dataList(node);
            const includeUpdate = dataList.some(
              (data) => data.type === 'update'
            );

            if (!includeUpdate) return api.suggestion.nodeId(node);

            return dataList
              .filter((data) => data.type === 'update')
              .map((d) => d.id);
          }
          if (ElementApi.isElement(node)) {
            return api.suggestion.nodeId(node);
          }
        })
        .filter(Boolean)
    );

    const res: ResolvedSuggestion[] = [];

    suggestionIds.forEach((id) => {
      if (!id) return;

      const path = map.get(id);

      if (!path || !PathApi.isPath(path)) return;
      if (!PathApi.equals(path, blockPath)) return;

      const entries = [
        ...editor.api.nodes<TElement | TSuggestionText>({
          at: [],
          mode: 'all',
          match: (n) =>
            (n[SuggestionPlugin.key] && n[getSuggestionKey(id)]) ||
            api.suggestion.nodeId(n as TElement) === id,
        }),
      ];

      // 将换行移到末尾
      entries.sort(([, path1], [, path2]) => {
        return PathApi.isChild(path1, path2) ? -1 : 1;
      });

      let newText = '';
      let text = '';
      let properties: any = {};
      let newProperties: any = {};

      // 重叠建议
      entries.forEach(([node]) => {
        if (TextApi.isText(node)) {
          const dataList = api.suggestion.dataList(node);

          dataList.forEach((data) => {
            if (data.id !== id) return;

            switch (data.type) {
              case 'insert': {
                newText += node.text;

                break;
              }
              case 'remove': {
                text += node.text;

                break;
              }
              case 'update': {
                properties = {
                  ...properties,
                  ...data.properties,
                };

                newProperties = {
                  ...newProperties,
                  ...data.newProperties,
                };

                newText += node.text;

                break;
              }
              // 无默认值
            }
          });
        } else {
          const lineBreakData = api.suggestion.isBlockSuggestion(node)
            ? node.suggestion
            : undefined;

          if (lineBreakData?.id !== keyId2SuggestionId(id)) return;
          if (lineBreakData.type === 'insert') {
            newText += lineBreakData.isLineBreak
              ? BLOCK_SUGGESTION
              : BLOCK_SUGGESTION + TYPE_TEXT_MAP[node.type](node);
          } else if (lineBreakData.type === 'remove') {
            text += lineBreakData.isLineBreak
              ? BLOCK_SUGGESTION
              : BLOCK_SUGGESTION + TYPE_TEXT_MAP[node.type](node);
          }
        }
      });

      if (entries.length === 0) return;

      const nodeData = api.suggestion.suggestionData(entries[0][0]);

      if (!nodeData) return;

      // const comments = data?.discussions.find((d) => d.id === id)?.comments;
      const comments =
        discussions.find((s: TDiscussion) => s.id === id)?.comments || [];
      const createdAt = new Date(nodeData.createdAt);

      const keyId = getSuggestionKey(id);

      if (nodeData.type === 'update') {
        return res.push({
          comments,
          createdAt,
          keyId,
          newProperties,
          newText,
          properties,
          suggestionId: keyId2SuggestionId(id),
          type: 'update',
          userId: nodeData.userId,
        });
      }
      if (newText.length > 0 && text.length > 0) {
        return res.push({
          comments,
          createdAt,
          keyId,
          newText,
          suggestionId: keyId2SuggestionId(id),
          text,
          type: 'replace',
          userId: nodeData.userId,
        });
      }
      if (newText.length > 0) {
        return res.push({
          comments,
          createdAt,
          keyId,
          newText,
          suggestionId: keyId2SuggestionId(id),
          type: 'insert',
          userId: nodeData.userId,
        });
      }
      if (text.length > 0) {
        return res.push({
          comments,
          createdAt,
          keyId,
          suggestionId: keyId2SuggestionId(id),
          text,
          type: 'remove',
          userId: nodeData.userId,
        });
      }
    });

    return res;
  }, [
    api.suggestion,
    blockPath,
    discussions,
    editor.api,
    getOption,
    suggestionNodes,
  ]);

  return resolvedSuggestion;
};

export const isResolvedSuggestion = (
  suggestion: ResolvedSuggestion | TDiscussion
): suggestion is ResolvedSuggestion => {
  return 'suggestionId' in suggestion;
};

export function BlockSuggestion({ element }: { element: TSuggestionElement }) {
  const suggestionData = element.suggestion;

  if (suggestionData?.isLineBreak) return null;

  const isRemove = suggestionData?.type === 'remove';

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-1 border-2 border-brand/[0.8] transition-opacity',
        isRemove && 'border-gray-300'
      )}
      contentEditable={false}
    />
  );
}
