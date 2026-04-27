import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

// Import the exact same PNG icons as the RN app
import happyIcon   from '../../assets/icons/happy.png';
import neutralIcon from '../../assets/icons/neutral.png';
import sadIcon     from '../../assets/icons/sad.png';
import anxiousIcon from '../../assets/icons/anxious.png';
import madIcon     from '../../assets/icons/mad.png';

export type MoodType = 'happy' | 'neutral' | 'sad' | 'anxious' | 'mad';

/**
 * CSS filter strings that reproduce each mood's text color from #000000 base.
 * Generated to match: happy=#68BDA1, neutral=#75BFFF, sad=#85AFFF,
 *                     anxious=#FFD746, mad=#EA7B7B
 */
const MOOD_FILTERS: Record<MoodType, string> = {
  happy:   'invert(72%) sepia(18%) saturate(600%) hue-rotate(115deg) brightness(95%) contrast(90%)',
  neutral: 'invert(75%) sepia(30%) saturate(500%) hue-rotate(185deg) brightness(105%) contrast(95%)',
  sad:     'invert(70%) sepia(20%) saturate(500%) hue-rotate(200deg) brightness(105%) contrast(90%)',
  anxious: 'invert(85%) sepia(50%) saturate(600%) hue-rotate(10deg) brightness(105%) contrast(95%)',
  mad:     'invert(60%) sepia(30%) saturate(500%) hue-rotate(320deg) brightness(105%) contrast(90%)',
};

const getMoodFilter = (id: MoodType) => MOOD_FILTERS[id];

// Static config — labels resolved via i18n at render time
export const MOOD_CONFIG: Record<MoodType, {
  icon: string;
  labelKey: string;
  label: string;   // fallback
  bg: string;
  text: string;
}> = {
  happy:   { icon: happyIcon,   labelKey: 'VenterHome.moods.happy',   label: 'Happy',   bg: '#CFEDE3', text: '#68BDA1' },
  neutral: { icon: neutralIcon, labelKey: 'VenterHome.moods.neutral', label: 'Neutral', bg: '#E7EEF4', text: '#75BFFF' },
  sad:     { icon: sadIcon,     labelKey: 'VenterHome.moods.sad',     label: 'Sad',     bg: '#DCE8FF', text: '#85AFFF' },
  anxious: { icon: anxiousIcon, labelKey: 'VenterHome.moods.anxious', label: 'Anxious', bg: '#FFF4CC', text: '#FFD746' },
  mad:     { icon: madIcon,     labelKey: 'VenterHome.moods.mad',     label: 'Mad',     bg: '#FFD6D6', text: '#EA7B7B' },
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
  const { t } = useTranslation();

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
            {/* PNG icon with colored background — match app style */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-1 transition-all"
              style={{
                backgroundColor: isSelected ? config.text : 'transparent',
              }}
            >
              <img
                src={config.icon}
                alt={config.label}
                className="w-5 h-5 object-contain"
                style={{
                  filter: isSelected ? 'brightness(0) invert(1)' : 'brightness(0) invert(1)',
                  opacity: isSelected ? 1 : 0.85,
                }}
              />
            </div>
            <span
              className="text-xs font-medium"
              style={isSelected ? { color: config.text } : { color: 'rgba(255,255,255,0.7)' }}
            >
              {t(config.labelKey, config.label)}
            </span>
          </button>
        );
      })}
    </div>
  );
};
