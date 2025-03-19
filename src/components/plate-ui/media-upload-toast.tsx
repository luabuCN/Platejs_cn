'use client';

import { useEffect } from 'react';

import { PlaceholderPlugin, UploadErrorCode } from '@udecode/plate-media/react';
import { usePluginOption } from '@udecode/plate/react';
import { toast } from 'sonner';

export const useUploadErrorToast = () => {
  const uploadError = usePluginOption(PlaceholderPlugin, 'error');

  useEffect(() => {
    if (!uploadError) return;

    const { code, data } = uploadError;

    switch (code) {
      case UploadErrorCode.INVALID_FILE_SIZE: {
        toast.error(
          `文件的大小 ${data.files
            .map((f) => f.name)
            .join(', ')} 是无效的`
        );

        break;
      }
      case UploadErrorCode.INVALID_FILE_TYPE: {
        toast.error(
          `文件的类型 ${data.files
            .map((f) => f.name)
            .join(', ')} 是无效的`
        );

        break;
      }
      case UploadErrorCode.TOO_LARGE: {
        toast.error(
          `文件的大小 ${data.files
            .map((f) => f.name)
            .join(', ')} 超过了 ${data.maxFileSize}`
        );

        break;
      }
      case UploadErrorCode.TOO_LESS_FILES: {
        toast.error(
          `文件的最小数量是 ${data.minFileCount} 个，类型为 ${data.fileType}`
        );

        break;
      }
      case UploadErrorCode.TOO_MANY_FILES: {
        toast.error(
          `文件的最大数量是 ${data.maxFileCount} ${
            data.fileType ? `，类型为 ${data.fileType}` : ''
          }`
        );

        break;
      }
    }
  }, [uploadError]);
};

export const MediaUploadToast = () => {
  useUploadErrorToast();

  return null;
};
