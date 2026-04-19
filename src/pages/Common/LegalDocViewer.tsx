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
