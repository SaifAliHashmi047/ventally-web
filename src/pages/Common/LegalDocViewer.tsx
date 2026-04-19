import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';

// Map route param → { titleKey, contentSections }
const DOC_CONFIG: Record<string, { titleKey: string; contentKey?: string; sections?: string[] }> = {
  terms: {
    titleKey: 'Legal.termsOfUse',
    sections: [
      'TermsAndConditions.purpose',
      'TermsAndConditions.purposeText',
      'TermsAndConditions.enforcementSteps',
      'TermsAndConditions.firstOffense',
      'TermsAndConditions.secondOffense',
      'TermsAndConditions.thirdOffense',
      'TermsAndConditions.severeViolations',
      'TermsAndConditions.severeViolationsText1',
      'TermsAndConditions.severeViolationsText2',
      'TermsAndConditions.transparency',
      'TermsAndConditions.transparencyText',
    ],
  },
  privacy: {
    titleKey: 'Legal.privacyPolicy',
    sections: [
      'TermsAndConditions.privacyTitle',
      'TermsAndConditions.privacyEffectiveDate',
      'TermsAndConditions.privacyContact',
      'TermsAndConditions.privacyIntro',
      'TermsAndConditions.informationWeCollect',
      'TermsAndConditions.informationYouProvide',
      'TermsAndConditions.informationYouProvide1',
      'TermsAndConditions.informationYouProvide2',
      'TermsAndConditions.informationYouProvide3',
      'TermsAndConditions.informationYouProvide4',
      'TermsAndConditions.howWeUseYourInformation',
      'TermsAndConditions.howWeUse1',
      'TermsAndConditions.howWeUse2',
      'TermsAndConditions.howWeUse3',
      'TermsAndConditions.howWeUse4',
      'TermsAndConditions.howWeUse5',
      'TermsAndConditions.howWeUse6',
      'TermsAndConditions.howWeUse7',
      'TermsAndConditions.yourRights',
      'TermsAndConditions.yourRights1',
      'TermsAndConditions.yourRights2',
      'TermsAndConditions.yourRights3',
      'TermsAndConditions.yourRights4',
      'TermsAndConditions.yourRights5',
      'TermsAndConditions.yourRights6',
      'TermsAndConditions.yourRightsContact',
      'TermsAndConditions.securityMeasures',
      'TermsAndConditions.securityMeasuresText',
      'TermsAndConditions.contactUs',
      'TermsAndConditions.contactUsTeam',
      'TermsAndConditions.contactUsEmail',
    ],
  },
  safety: {
    titleKey: 'Legal.safetyPolicy',
    sections: [
      'TermsAndConditions.safetyPolicyTitle',
      'TermsAndConditions.safetyPurpose',
      'TermsAndConditions.safetyPurposeText',
      'TermsAndConditions.crisisProtocol',
      'TermsAndConditions.crisisProtocol1',
      'TermsAndConditions.crisisProtocol2',
      'TermsAndConditions.crisisProtocol3',
      'TermsAndConditions.limitations',
      'TermsAndConditions.limitationsText',
    ],
  },
  guidelines: {
    titleKey: 'Legal.listenerGuidelines',
    sections: [
      'TermsAndConditions.codeOfConductTitle',
      'TermsAndConditions.codeOfConductPurpose1',
      'TermsAndConditions.codeOfConductPurpose2',
      'TermsAndConditions.standardsOfBehavior',
      'TermsAndConditions.standardRespect',
      'TermsAndConditions.standardNoHarassment',
      'TermsAndConditions.standardNoHateSpeech',
      'TermsAndConditions.standardNoExploitation',
      'TermsAndConditions.standardNoThreats',
      'TermsAndConditions.standardConfidentiality',
      'TermsAndConditions.reportingMisconduct',
      'TermsAndConditions.reportingMisconduct1',
      'TermsAndConditions.reportingMisconduct2',
      'TermsAndConditions.reportingMisconduct3',
    ],
  },
};

const isHeading = (key: string) => {
  const k = key.split('.').pop() || '';
  return (
    k.endsWith('Title') ||
    k === 'purpose' ||
    k === 'enforcementSteps' ||
    k === 'severeViolations' ||
    k === 'transparency' ||
    k === 'informationWeCollect' ||
    k === 'howWeUseYourInformation' ||
    k === 'yourRights' ||
    k === 'securityMeasures' ||
    k === 'contactUs' ||
    k === 'crisisProtocol' ||
    k === 'limitations' ||
    k === 'standardsOfBehavior' ||
    k === 'reportingMisconduct'
  );
};

export const LegalDocViewer = () => {
  const { docId } = useParams<{ docId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const config = docId ? DOC_CONFIG[docId] : null;
  const title = config ? t(config.titleKey) : t('Legal.title');

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={title} onBack={() => navigate(-1)} />

      <GlassCard bordered>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto scrollbar-hide pr-2">
          {config?.sections?.map((key, i) => {
            const text = t(key);
            if (!text || text === key) return null; // skip missing keys
            const heading = isHeading(key);
            return heading ? (
              <h3 key={i} className="text-base font-semibold text-white mt-4 first:mt-0">
                {text}
              </h3>
            ) : (
              <p key={i} className="text-sm text-gray-400 leading-relaxed">
                {text}
              </p>
            );
          })}
          {!config && (
            <p className="text-sm text-gray-400">{t('Common.noData')}</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
