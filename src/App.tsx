/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Message, Attachment } from './types';
import { askChatbot } from './services/geminiService';
import ChatList from './components/ChatList';
import ChatInput from './components/ChatInput';
import SuggestionButtons from './components/SuggestionButtons';
import PDFUpload from './components/PDFUpload';
import { ShieldCheck, Info, Bot } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState<Attachment | null>(null);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: Date.now(),
      documentName: currentAttachment?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }]
    }));

    const responseText = await askChatbot(text, history, currentAttachment || undefined);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      content: responseText,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  }, [messages, currentAttachment]);

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA] text-slate-800 font-sans" id="main-app">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 shadow-sm" id="header">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-xl flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">근로기준법·취업규칙 챗봇</h1>
              <p className="text-sm text-slate-500 md:block hidden">
                회사 취업규칙을 기준으로 근로시간, 연차, 수당, 퇴직 관련 질문에 답변합니다.
              </p>
            </div>
          </div>
          <div className="hidden sm:block">
            <PDFUpload attachment={currentAttachment} onUpload={setCurrentAttachment} />
          </div>
        </div>
      </header>

      {/* Mobile PDF Upload Bar */}
      <div className="sm:hidden px-4 py-2 bg-white border-b border-slate-100 flex justify-center">
        <PDFUpload attachment={currentAttachment} onUpload={setCurrentAttachment} />
      </div>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-4 overflow-hidden max-w-4xl mx-auto w-full" id="chat-container">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white rounded-3xl border border-slate-200 shadow-inner" id="welcome-view">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Bot className="w-10 h-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">궁금한 내용을 입력하거나 아래 예시 질문을 선택해 주세요.</p>
              <h2 className="text-xl font-bold text-slate-800">사내 인사 지원 서비스</h2>
              <p className="text-sm text-slate-500">
                인사/노무 관련 궁금한 점을 물어보시면 실시간으로 답변해 드립니다. 문서 업로드 기능을 통해 근로기준법 PDF 등을 추가로 참고할 수 있습니다.
              </p>
            </div>
          </div>
        )}
        
        {messages.length > 0 && (
          <div className="flex-grow bg-white rounded-3xl border border-slate-200 shadow-inner overflow-hidden flex flex-col">
            <ChatList messages={messages} isTyping={isTyping} />
          </div>
        )}
        
        <div className="shrink-0 flex flex-col gap-3 mt-auto">
          <SuggestionButtons onSelect={handleSendMessage} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          
          <div className="text-[10px] text-center text-slate-400 flex flex-col items-center gap-1">
            <p>© 2024 HR Compliance Suite | Built for Employee Experience</p>
          </div>
        </div>
      </main>
    </div>
  );
}


