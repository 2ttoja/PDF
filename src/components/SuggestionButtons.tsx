/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { INITIAL_SUGGESTIONS } from '../types';
import { MessageCircle } from 'lucide-react';

interface SuggestionButtonsProps {
  onSelect: (question: string) => void;
}

export default function SuggestionButtons({ onSelect }: SuggestionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-1" id="suggestions-container">
      {INITIAL_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 bg-white border border-slate-200 hover:border-brand-blue hover:text-brand-blue rounded-full text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          id={`suggestion-${suggestion.replace(/\s+/g, '-')}`}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
