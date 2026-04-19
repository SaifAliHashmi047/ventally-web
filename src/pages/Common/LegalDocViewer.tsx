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
      'TermsAndConditions.safetyPolicyTitle',
      'TermsAndConditions.safetyPurpose',
      'TermsAndConditions.safetyPurposeText',
      'TermsAndConditions.crisisProtocol',
      'TermsAndConditions.crisisProtocol1',
      'TermsAndConditions.crisisProtocol2',
      'TermsAndConditions.crisisProtocol3',
      'TermsAndConditions.limitations',
      'TermsAndConditions.limitationsText',
      'TermsAndConditions.confidentialityPolicyTitle',
      'TermsAndConditions.confidentialityPurpose',
      'TermsAndConditions.confidentialityPurposeText',
      'TermsAndConditions.prohibitedConduct',
      'TermsAndConditions.prohibitedConduct1',
      'TermsAndConditions.prohibitedConduct2',
      'TermsAndConditions.prohibitedConduct3',
      'TermsAndConditions.repercussions',
      'TermsAndConditions.repercussionsText',
      'TermsAndConditions.bullyingPolicyTitle',
      'TermsAndConditions.bullyingPurpose',
      'TermsAndConditions.bullyingPurposeText',
      'TermsAndConditions.bullyingProhibitedConduct',
      'TermsAndConditions.bullyingProhibitedConduct1',
      'TermsAndConditions.bullyingProhibitedConduct2',
      'TermsAndConditions.bullyingProhibitedConduct3',
      'TermsAndConditions.bullyingReporting',
      'TermsAndConditions.bullyingReporting1',
      'TermsAndConditions.bullyingReporting2',
      'TermsAndConditions.bullyingRepercussions',
      'TermsAndConditions.bullyingRepercussions1',
      'TermsAndConditions.bullyingRepercussions2',
      'TermsAndConditions.antiDiscriminationPolicyTitle',
      'TermsAndConditions.antiDiscriminationPurpose',
      'TermsAndConditions.antiDiscriminationPurpose1',
      'TermsAndConditions.antiDiscriminationPurpose2',
      'TermsAndConditions.antiDiscriminationProhibitedConduct',
      'TermsAndConditions.antiDiscriminationProhibitedConduct1',
      'TermsAndConditions.antiDiscriminationProhibitedConduct2',
      'TermsAndConditions.antiDiscriminationProhibitedConduct3',
      'TermsAndConditions.antiDiscriminationRepercussions',
      'TermsAndConditions.antiDiscriminationRepercussionsText',
      'TermsAndConditions.codeOfConductTitle',
      'TermsAndConditions.codeOfConductPurpose',
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
      'TermsAndConditions.repercussionsForViolations',
      'TermsAndConditions.repercussionsZeroTolerance',
      'TermsAndConditions.repercussionsFirstOffense',
      'TermsAndConditions.repercussionsSecondOffense',
      'TermsAndConditions.repercussionsThirdOffense',
      'TermsAndConditions.repercussionsSevereViolations',
      'TermsAndConditions.communityCommitmentTitle',
      'TermsAndConditions.communityCommitmentIntro',
      'TermsAndConditions.communityCommitment1',
      'TermsAndConditions.communityCommitment2',
      'TermsAndConditions.communityCommitment3',
      'TermsAndConditions.sexualHarassmentPolicyTitle',
      'TermsAndConditions.sexualHarassmentPurpose',
      'TermsAndConditions.sexualHarassmentPurpose1',
      'TermsAndConditions.sexualHarassmentPurpose2',
      'TermsAndConditions.definitionOfSexualHarassment',
      'TermsAndConditions.sexualHarassmentDefinition',
      'TermsAndConditions.examplesProhibitedConduct',
      'TermsAndConditions.sexualHarassmentExample1',
      'TermsAndConditions.sexualHarassmentExample2',
      'TermsAndConditions.sexualHarassmentExample3',
      'TermsAndConditions.sexualHarassmentExample4',
      'TermsAndConditions.sexualHarassmentExample5',
      'TermsAndConditions.scopeTitle',
      'TermsAndConditions.scopeText',
      'TermsAndConditions.scopeVoice',
      'TermsAndConditions.scopeTextSessions',
      'TermsAndConditions.scopeInApp',
      'TermsAndConditions.reportingHarassment',
      'TermsAndConditions.reportingHarassment1',
      'TermsAndConditions.reportingHarassment2',
      'TermsAndConditions.reportingHarassment3',
      'TermsAndConditions.sexualHarassmentRepercussions',
      'TermsAndConditions.sexualHarassmentZeroTolerance',
      'TermsAndConditions.sexualHarassmentFirstOffense',
      'TermsAndConditions.sexualHarassmentSecondOffense',
      'TermsAndConditions.sexualHarassmentThirdOffense',
      'TermsAndConditions.sexualHarassmentSevereViolations',
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
      'TermsAndConditions.informationWeCollectIntro',
      'TermsAndConditions.informationYouProvide',
      'TermsAndConditions.informationYouProvide1',
      'TermsAndConditions.informationYouProvide2',
      'TermsAndConditions.informationYouProvide3',
      'TermsAndConditions.informationYouProvide4',
      'TermsAndConditions.informationCollectedAutomatically',
      'TermsAndConditions.informationCollectedAutomatically1',
      'TermsAndConditions.informationCollectedAutomatically2',
      'TermsAndConditions.informationCollectedAutomatically3',
      'TermsAndConditions.specialCategories',
      'TermsAndConditions.specialCategoriesText',
      'TermsAndConditions.howWeUseYourInformation',
      'TermsAndConditions.howWeUseYourInformationIntro',
      'TermsAndConditions.howWeUse1',
      'TermsAndConditions.howWeUse2',
      'TermsAndConditions.howWeUse3',
      'TermsAndConditions.howWeUse4',
      'TermsAndConditions.howWeUse5',
      'TermsAndConditions.howWeUse6',
      'TermsAndConditions.howWeUse7',
      'TermsAndConditions.legalBasesForProcessing',
      'TermsAndConditions.legalBasesIntro',
      'TermsAndConditions.legalBases1',
      'TermsAndConditions.legalBases2',
      'TermsAndConditions.legalBases3',
      'TermsAndConditions.legalBases4',
      'TermsAndConditions.howWeShareYourInformation',
      'TermsAndConditions.howWeShareIntro',
      'TermsAndConditions.howWeShare1',
      'TermsAndConditions.howWeShare2',
      'TermsAndConditions.howWeShare3',
      'TermsAndConditions.internationalDataTransfers',
      'TermsAndConditions.internationalDataTransfers1',
      'TermsAndConditions.internationalDataTransfers2',
      'TermsAndConditions.dataRetention',
      'TermsAndConditions.dataRetention1',
      'TermsAndConditions.dataRetention2',
      'TermsAndConditions.yourRights',
      'TermsAndConditions.yourRightsIntro',
      'TermsAndConditions.yourRights1',
      'TermsAndConditions.yourRights2',
      'TermsAndConditions.yourRights3',
      'TermsAndConditions.yourRights4',
      'TermsAndConditions.yourRights5',
      'TermsAndConditions.yourRights6',
      'TermsAndConditions.yourRightsContact',
      'TermsAndConditions.cookiesAndTracking',
      'TermsAndConditions.cookiesAndTrackingText',
      'TermsAndConditions.securityMeasures',
      'TermsAndConditions.securityMeasuresText',
      'TermsAndConditions.childrensPrivacy',
      'TermsAndConditions.childrensPrivacyText',
      'TermsAndConditions.thirdPartyLinks',
      'TermsAndConditions.thirdPartyLinksText',
      'TermsAndConditions.changesToThisPolicy',
      'TermsAndConditions.changesToThisPolicyText',
      'TermsAndConditions.contactUs',
      'TermsAndConditions.contactUsIntro',
      'TermsAndConditions.contactUsTeam',
      'TermsAndConditions.contactUsEmail',
    ],
  },
  guidelines: {
    titleKey: 'Legal.listenerGuidelines',
    contentKey: 'ListenerCodeOfConduct',
  },
  'liability-waiver': {
    titleKey: 'Legal.liabilityWaiver',
    contentKey: 'ListenerLiabilityWaiver',
  },
  'payment-terms': {
    titleKey: 'Legal.paymentTerms',
    contentKey: 'PaymentTermsAcknowledgment',
  },
  'listener-agreement': {
    titleKey: 'Legal.listenerAgreement',
    contentKey: 'ListenerAgreement',
  },
  nda: {
    titleKey: 'Legal.nda',
    contentKey: 'ListenerNDA',
  },
  'code-of-conduct': {
    titleKey: 'Legal.codeOfConduct',
    contentKey: 'ListenerCodeOfConduct',
  },
  safety: {
    titleKey: 'Legal.safetyPolicy',
    contentKey: 'ListenerSafetyPolicy',
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
    k === 'informationYouProvide' ||
    k === 'informationCollectedAutomatically' ||
    k === 'specialCategories' ||
    k === 'howWeUseYourInformation' ||
    k === 'legalBasesForProcessing' ||
    k === 'howWeShareYourInformation' ||
    k === 'internationalDataTransfers' ||
    k === 'dataRetention' ||
    k === 'yourRights' ||
    k === 'cookiesAndTracking' ||
    k === 'securityMeasures' ||
    k === 'childrensPrivacy' ||
    k === 'thirdPartyLinks' ||
    k === 'changesToThisPolicy' ||
    k === 'contactUs' ||
    k === 'crisisProtocol' ||
    k === 'limitations' ||
    k === 'prohibitedConduct' ||
    k === 'repercussions' ||
    k === 'bullyingProhibitedConduct' ||
    k === 'bullyingReporting' ||
    k === 'bullyingRepercussions' ||
    k === 'antiDiscriminationProhibitedConduct' ||
    k === 'antiDiscriminationRepercussions' ||
    k === 'standardsOfBehavior' ||
    k === 'reportingMisconduct' ||
    k === 'repercussionsForViolations' ||
    k === 'definitionOfSexualHarassment' ||
    k === 'reportingHarassment' ||
    k === 'sexualHarassmentRepercussions'
  );
};

interface StructuredSection {
  title?: string;
  text?: string;
  subsections?: Array<{
    title?: string;
    text?: string;
    bullets?: string[];
  }>;
  bullets?: string[];
}

export const LegalDocViewer = () => {
  const { docId } = useParams<{ docId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const config = docId ? DOC_CONFIG[docId] : null;
  const title = config ? t(config.titleKey) : t('Legal.title');

  // Helper to render structured sections (matching native ListenerAgreement logic)
  const renderStructuredSections = (rootKey: string) => {
    const data = t(rootKey, { returnObjects: true }) as any;
    if (!data || typeof data === 'string') return null;

    return (
      <div className="space-y-8">
        {data.effectiveDate && (
          <p className="text-sm font-medium text-white mb-6">
            {data.effectiveDate}
          </p>
        )}

        {data.introText1 && (
          <p className="text-[15px] text-gray-300 leading-relaxed mb-8">
            {data.introText1}
          </p>
        )}

        <div className="space-y-8">
          {data.sections?.map((section: StructuredSection, sIdx: number) => (
            <div key={sIdx} className="space-y-4">
              {section.title && (
                <h3 className="text-lg font-bold text-white tracking-tight pt-4 first:pt-0">
                  {section.title}
                </h3>
              )}
              
              {section.text && (
                <p className="text-[15px] text-gray-400 leading-relaxed">
                  {section.text}
                </p>
              )}

              {section.subsections?.map((sub, ssIdx) => (
                <div key={ssIdx} className="space-y-3 ml-1">
                  {sub.title && (
                    <h4 className="text-[16px] font-semibold text-white">
                      {sub.title}
                    </h4>
                  )}
                  {sub.text && (
                    <p className="text-[15px] text-gray-400 leading-relaxed">
                      {sub.text}
                    </p>
                  )}
                  {sub.bullets?.map((bullet, bIdx) => (
                    <p key={bIdx} className="text-sm text-gray-400 leading-relaxed flex items-start gap-2 pl-2">
                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                       {bullet}
                    </p>
                  ))}
                </div>
              ))}

              {section.bullets?.map((bullet, bIdx) => (
                <p key={bIdx} className="text-sm text-gray-400 leading-relaxed flex items-start gap-2 pl-2">
                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                   {bullet}
                </p>
              ))}
            </div>
          ))}
        </div>

        {data.signatures && (
          <div className="pt-8 border-t border-white/5 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {data.signatures.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {data.signatures.text}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <PageHeader title={title} onBack={() => navigate(-1)} />

      <GlassCard bordered className="mb-8">
        <div className="max-h-[75vh] overflow-y-auto scrollbar-hide pr-2 p-2">
          {config?.contentKey ? (
            // Structured Mode
            renderStructuredSections(config.contentKey)
          ) : (
            // Flat Mode (Legacy)
            <div className="space-y-3">
              {config?.sections?.map((key, i) => {
                const text = t(key);
                if (!text || text === key) return null;
                const heading = isHeading(key);
                return heading ? (
                  <h3 key={i} className="text-base font-semibold text-white mt-6 first:mt-0">
                    {text}
                  </h3>
                ) : (
                  <p key={i} className="text-sm text-gray-400 leading-relaxed">
                    {text}
                  </p>
                );
              })}
            </div>
          )}
          
          {!config && (
            <p className="text-sm text-gray-400 text-center py-8">
              {t('Common.noData')}
            </p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
