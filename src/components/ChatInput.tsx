/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0" id="chat-input-wrapper">
      <div className="flex gap-3 bg-[#F8F9FA] p-1.5 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-blue focus-within:border-transparent transition-all">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력해 주세요..."
          disabled={disabled}
          className="flex-grow bg-transparent border-none focus:ring-0 px-4 text-sm disabled:cursor-not-allowed h-11"
          id="question-input"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="bg-brand-blue hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
          id="send-button"
        >
          <span>전송</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
