import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, Phone, Shield, X, ChevronRight, Heart } from 'lucide-react';

const CRISIS_STEPS = [
  {
    id: 'warning',
    title: 'We\'re here for you',
    description: 'It looks like you might be going through something very difficult. That\'s okay. You are not alone.',
    icon: Heart,
    color: '#C2AEBF',
  },
  {
    id: 'disclaimer',
    title: 'Important Information',
    description: 'Ventally is a peer support platform and not a substitute for professional mental health care. In a mental health emergency, please contact emergency services.',
    icon: Shield,
    color: '#FFD746',
  },
  {
    id: 'options',
    title: 'Get Immediate Support',
    description: 'Choose how you\'d like to get help right now.',
    icon: AlertTriangle,
    color: '#FF453A',
  },
];

export const VenterCrisisFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const currentStep = CRISIS_STEPS[step];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm text-center animate-fade-in">
        {/* Close */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl glass text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: `${currentStep.color}20`, border: `2px solid ${currentStep.color}40` }}
        >
          <Icon size={32} style={{ color: currentStep.color }} />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">{currentStep.title}</h1>
        <p className="text-sm text-gray-400 leading-relaxed mb-8">{currentStep.description}</p>

        {step < 2 ? (
          <Button variant="primary" size="lg" fullWidth onClick={() => setStep(s => s + 1)}>
            Continue
          </Button>
        ) : (
          <div className="space-y-3">
            {/* Call 988 */}
            <a href="tel:988" className="block">
              <Button variant="danger" size="lg" fullWidth leftIcon={<Phone size={18} />}>
                Call 988 (Suicide & Crisis Lifeline)
              </Button>
            </a>

            {/* Crisis Text Line */}
            <a href="sms:741741" className="block">
              <Button variant="glass" size="lg" fullWidth leftIcon={<Phone size={18} />}>
                Text HOME to 741741
              </Button>
            </a>

            {/* Connect with Listener */}
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={() => navigate('/venter/finding-listener', { state: { type: 'call', crisis: true } })}
            >
              Talk to a Listener
            </Button>

            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              I'm safe, go back
            </Button>
          </div>
        )}

        {step < 2 && (
          <button className="text-xs text-gray-600 mt-4 hover:text-gray-400" onClick={() => navigate(-1)}>
            I'm safe, go back
          </button>
        )}
      </div>
    </div>
  );
};
