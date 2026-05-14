/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  createdAt: number;
  documentName?: string; // Track which document this message was sent with
}

export interface Attachment {
  name: string;
  data: string; // base64
  mimeType: string;
}

export const INITIAL_SUGGESTIONS = [
  '입사 3년차 연차 며칠?',
  '야근 수당 기준이 뭐예요?',
  '퇴직금 계산법 알려주세요',
  '주 52시간 넘으면 어떻게 되나요?',
];
