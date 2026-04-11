import React from 'react';
import { cn } from '../../utils/cn';

export type MoodType = 'happy' | 'neutral' | 'sad' | 'anxious' | 'mad';

export const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; bg: string; text: string }> = {
  happy: { emoji: '😊', label: 'Happy', bg: '#CFEDE3', text: '#68BDA1' },
  neutral: { emoji: '😐', label: 'Neutral', bg: '#E7EEF4', text: '#75BFFF' },
  sad: { emoji: '😢', label: 'Sad', bg: '#DCE8FF', text: '#85AFFF' },
  anxious: { emoji: '😰', label: 'Anxious', bg: '#FFF4CC', text: '#FFD746' },
  mad: { emoji: '😠', label: 'Mad', bg: '#FFD6D6', text: '#EA7B7B' },
};

interface MoodSelectorProps {
  selected: MoodType | null;
  onSelect: (mood: MoodType) => void;
  className?: string;
  disabled?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selected,
  onSelect,
  className,
  disabled = false,
}) => {
  return (
    <div className={cn('flex gap-2', className)}>
      {(Object.entries(MOOD_CONFIG) as [MoodType, typeof MOOD_CONFIG[MoodType]][]).map(([id, config]) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            disabled={disabled}
            onClick={() => onSelect(id)}
            className={cn(
              'mood-item flex-1',
              disabled && 'cursor-not-allowed opacity-60'
            )}
            style={isSelected ? {
              backgroundColor: config.bg,
              borderColor: config.bg,
            } : {}}
          >
            <span className="text-2xl mb-1 block">{config.emoji}</span>
            <span
              className="text-xs font-medium"
              style={isSelected ? { color: config.text } : { color: 'rgba(255,255,255,0.7)' }}
            >
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
