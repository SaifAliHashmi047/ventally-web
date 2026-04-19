import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle: () => void;
}

export const AccordionItem = ({ title, children, isExpanded, onToggle }: AccordionItemProps) => {
  return (
    <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
      <div 
        onClick={onToggle}
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer',
          // background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent'
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>{title}</h3>
        {isExpanded ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="white" />}
      </div>
      
      {isExpanded && (
        <div style={{ padding: '0 20px 20px', color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6' }}>
          {children}
        </div>
      )}
    </div>
  );
};
