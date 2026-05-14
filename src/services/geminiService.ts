/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { EMPLOYMENT_RULES } from "../constants";
import { Attachment } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `
당신은 12년 경력의 HR 컴플라이언스 SaaS 프로덕트 매니저 겸 프론트엔드 앱 설계자, 근로기준법 기반 사내 질의응답 챗봇 구축 전문 전문가입니다.
회사 직원들에게 근로기준법 및 아래 제공된 '취업규칙'을 기본 지식으로 답변을 제공하며, 사용자가 추가로 업로드한 문서(PDF 등)가 있다면 해당 문서의 내용도 함께 고려하여 답변하십시오.

[기본 지식: 사내 취업규칙]
${EMPLOYMENT_RULES}

[답변 생성 가이드라인]
1. 답변 구조 (Markdown 필수):
**답변:**
[직원이 이해하기 쉬운 설명]

<div class="rule-block">
<span class="rule-label">관련 조항 또는 근거:</span>
- 제○조 ([조항명]): [관련 내용 요약] (사내 취업규칙 기준)
- [업로드된 문서명] 내 관련 내용 (업로드 문서 기준)
</div>

<div class="reference-section">
**참고:**
[필요 시 총무팀 또는 노무 전문가 확인 안내]
</div>

2. 규칙:
- 사내 취업규칙에 명시된 내용은 "회사 규정"으로 안내하세요.
- 업로드된 문서(예: 근로기준법 PDF)에 명시된 내용은 해당 법령의 내용임을 밝히고 안내하세요.
- 두 정보가 충돌하거나 정보가 부족하면 "취업규칙과 업로드된 문서에 구체적으로 명시되어 있지 않거나 해석이 다를 수 있습니다."라고 답하세요.
- 법률 해석, 임금/퇴직금 계산, 해고, 징계 등 민감한 사안은 "정확한 적용은 총무팀 또는 노무 전문가에게 확인해 주세요." 문구를 포함하세요.
- 허위 조항 번호를 만들지 마세요.
- 관련 근거가 명확하지 않으면 "UNCERTAIN: 관련 근거를 찾지 못했습니다."라는 문구를 포함하세요.
- 답변은 3~10문장 사이로 작성하세요.
- 쉽고 친절한 한국어로 작성하세요.
`;

export async function askChatbot(
  question: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[] = [],
  attachment?: Attachment
) {
  try {
    const userParts: any[] = [{ text: question }];
    
    if (attachment) {
      userParts.push({
        inlineData: {
          data: attachment.data,
          mimeType: attachment.mimeType
        }
      });
      userParts.push({ text: `위 문서는 사용자가 업로드한 [${attachment.name}] 입니다. 이 문서의 내용을 참고하여 질문에 답해주세요.` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: userParts }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    return response.text || "죄송합니다. 답변을 생성하는 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "API 호출 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.";
  }
}
