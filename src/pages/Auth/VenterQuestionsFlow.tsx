import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthLayout } from '../../components/Layout/AuthLayout';
import { QuestionStep } from '../../components/Shared/QuestionStep';
import { updateUser } from '../../store/slices/userSlice';

const QUESTIONS_CONFIG: Record<string, { step: number; titleKey: string; next: string; options: any[] }> = {
  gender: {
    step: 1,
    titleKey: 'GenderIdentity.title',
    next: 'race',
    options: [
      { id: 'Man', labelKey: 'GenderIdentity.man' },
      { id: 'Woman', labelKey: 'GenderIdentity.woman' },
      { id: 'Non-binary', labelKey: 'GenderIdentity.nonBinary' },
      { id: 'Gender non-conforming', labelKey: 'GenderIdentity.genderNonConforming' },
      { id: 'Questioning', labelKey: 'GenderIdentity.questioning' },
      { id: 'Prefer not to say', labelKey: 'GenderIdentity.preferNotToSay' },
    ]
  },
  race: {
    step: 2,
    titleKey: 'RacialIdentity.title',
    next: 'ethnicity',
    options: [
      { id: 'Asian', labelKey: 'RacialIdentity.asian' },
      { id: 'Black', labelKey: 'RacialIdentity.black' },
      { id: 'Hispanic', labelKey: 'RacialIdentity.hispanic' },
      { id: 'White', labelKey: 'RacialIdentity.white' },
      { id: 'Mixed', labelKey: 'RacialIdentity.mixed' },
      { id: 'Other', labelKey: 'RacialIdentity.other' },
      { id: 'Prefer not to say', labelKey: 'RacialIdentity.preferNotToSay' },
    ]
  },
  // Adding placeholders for others to show the pattern, I'll fill them as I go
  ethnicity: { step: 3, titleKey: 'Ethnicity.title', next: 'age', options: [] },
  age: { step: 4, titleKey: 'AgeGroup.title', next: 'lgbtq', options: [] },
  lgbtq: { step: 5, titleKey: 'LGBTQIdentity.title', next: 'topics', options: [] },
  topics: { step: 6, titleKey: 'SpecialTopics.title', next: 'faith', options: [] },
  faith: { step: 7, titleKey: 'FaithOrBelief.title', next: 'finish', options: [] },
};

export const VenterQuestionsFlow = () => {
  const { stepId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const config = QUESTIONS_CONFIG[stepId || 'gender'];

  const handleSelect = (value: string) => {
    // Update local state
    const update: any = {};
    if (stepId === 'gender') update.gender = value;
    // ... add more logic for other fields
    dispatch(updateUser(update));

    if (config.next === 'finish') {
      navigate('/signup/choose-plan');
    } else {
      navigate(`/signup/questions/${config.next}`);
    }
  };

  const handleSkip = () => {
    if (config.next === 'finish') {
      navigate('/signup/choose-plan');
    } else {
      navigate(`/signup/questions/${config.next}`);
    }
  };

  if (!config) return null;

  return (
    <AuthLayout>
      <QuestionStep 
        step={config.step}
        totalSteps={7}
        titleKey={config.titleKey}
        options={config.options}
        selectedValue={(user as any)[stepId || 'gender']}
        onSelect={handleSelect}
        onBack={() => navigate(-1)}
        onSkip={handleSkip}
      />
    </AuthLayout>
  );
};
