/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { FileUp, X, FileText } from 'lucide-react';
import { Attachment } from '../types';

interface PDFUploadProps {
  attachment: Attachment | null;
  onUpload: (attachment: Attachment | null) => void;
}

export default function PDFUpload({ attachment, onUpload }: PDFUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = (event.target?.result as string).split(',')[1];
        onUpload({
          name: file.name,
          data: base64Data,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2" id="pdf-upload-container">
      {!attachment ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition-colors border border-slate-200"
          id="upload-button"
        >
          <FileUp className="w-4 h-4" />
          <span>문서 업로드 (PDF)</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100 animate-in fade-in slide-in-from-left-2 shadow-sm">
          <FileText className="w-4 h-4" />
          <span className="max-w-[120px] truncate">{attachment.name}</span>
          <button 
            onClick={handleRemove}
            className="p-0.5 hover:bg-blue-100 rounded-full transition-colors"
            id="remove-upload-button"
          >
            <X className="w-3 h-3 text-blue-500" />
          </button>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
        id="pdf-input"
      />
    </div>
  );
}
