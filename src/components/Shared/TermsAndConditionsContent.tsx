import { useTranslation } from "react-i18next";

export const TermsAndConditionsContent = ({ title }: { title?: string }) => {
    const { t } = useTranslation();

    // Mapping React Native StyleSheet to constant tailwind/inline objects
    const styles = {
        container: { flex: 1, paddingRight: '4px' },
        section: { marginBottom: '32px' },
        mainTitle: { fontSize: '18px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '8px' },
        subheading: { fontSize: '15px', fontWeight: 600, color: 'var(--text-pure)', marginTop: '20px', marginBottom: '12px' },
        text: { color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px', opacity: 0.9 },
        bulletPoint: { color: 'var(--text-dim)', fontSize: '14px', lineHeight: '1.6', marginBottom: '10px', marginLeft: '16px', opacity: 0.9, display: 'list-item', listStyleType: 'disc' },
        mainHeading: { fontSize: '18px', fontWeight: 600, color: 'var(--text-pure)', marginBottom: '8px', textAlign: 'center' as const }
    };

    return (
        <div style={{ height: '450px', overflowY: 'auto', paddingRight: '12px', marginBottom: '24px' }}>
            {!title && <h2 style={styles.mainHeading}>
                {t('TermsAndConditions.title')}
            </h2>}
            
            <div style={styles.section}>
                <h3 style={styles.subheading}>{t('TermsAndConditions.purpose')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.purposeText')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.enforcementSteps')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.firstOffense')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.secondOffense')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.thirdOffense')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.severeViolations')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.severeViolationsText1')}</p>
                <p style={styles.text}>{t('TermsAndConditions.severeViolationsText2')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.transparency')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.transparencyText')}</p>
            </div>

            {/* Ventally Safety & Crisis Policy Section */}
            <div style={styles.section}>
                <h2 style={{ ...styles.mainTitle, textAlign: 'left' }}>{t('TermsAndConditions.safetyPolicyTitle')}</h2>

                <h3 style={styles.subheading}>{t('TermsAndConditions.safetyPurpose')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.safetyPurposeText')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.crisisProtocol')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.crisisProtocol1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.crisisProtocol2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.crisisProtocol3')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.limitations')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.limitationsText')}</li>
                </ul>

                <h2 style={{ ...styles.mainTitle, textAlign: 'left', marginTop: '24px' }}>{t('TermsAndConditions.confidentialityPolicyTitle')}</h2>

                <h3 style={styles.subheading}>{t('TermsAndConditions.confidentialityPurpose')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.confidentialityPurposeText')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.prohibitedConduct')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.prohibitedConduct1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.prohibitedConduct2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.prohibitedConduct3')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.repercussions')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.repercussionsText')}</li>
                </ul>

                <h2 style={{ ...styles.mainTitle, textAlign: 'left', marginTop: '24px' }}>{t('TermsAndConditions.bullyingPolicyTitle')}</h2>

                <h3 style={styles.subheading}>{t('TermsAndConditions.bullyingPurpose')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.bullyingPurposeText')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.bullyingProhibitedConduct')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.bullyingProhibitedConduct1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.bullyingProhibitedConduct2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.bullyingProhibitedConduct3')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.bullyingReporting')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.bullyingReporting1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.bullyingReporting2')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.bullyingRepercussions')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.bullyingRepercussions1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.bullyingRepercussions2')}</li>
                </ul>

                <h2 style={{ ...styles.mainTitle, textAlign: 'left', marginTop: '24px' }}>{t('TermsAndConditions.antiDiscriminationPolicyTitle')}</h2>

                <h3 style={styles.subheading}>{t('TermsAndConditions.antiDiscriminationPurpose')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.antiDiscriminationPurpose1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.antiDiscriminationPurpose2')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.antiDiscriminationProhibitedConduct')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.antiDiscriminationProhibitedConduct1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.antiDiscriminationProhibitedConduct2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.antiDiscriminationProhibitedConduct3')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.antiDiscriminationRepercussions')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.antiDiscriminationRepercussionsText')}</li>
                </ul>

                <h2 style={{ ...styles.mainTitle, textAlign: 'left', marginTop: '24px' }}>{t('TermsAndConditions.codeOfConductTitle')}</h2>

                <h3 style={styles.subheading}>{t('TermsAndConditions.codeOfConductPurpose')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.codeOfConductPurpose1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.codeOfConductPurpose2')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.standardsOfBehavior')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.standardRespect')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.standardNoHarassment')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.standardNoHateSpeech')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.standardNoExploitation')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.standardNoThreats')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.standardConfidentiality')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.reportingMisconduct')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.reportingMisconduct1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.reportingMisconduct2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.reportingMisconduct3')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.repercussionsForViolations')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.repercussionsZeroTolerance')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.repercussionsFirstOffense')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.repercussionsSecondOffense')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.repercussionsThirdOffense')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.repercussionsSevereViolations')}</li>
                </ul>

                <h2 style={{ ...styles.mainTitle, textAlign: 'left', marginTop: '24px' }}>{t('TermsAndConditions.communityCommitmentTitle')}</h2>

                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.communityCommitmentIntro')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.communityCommitment1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.communityCommitment2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.communityCommitment3')}</li>
                </ul>

                <h2 style={{ ...styles.mainTitle, textAlign: 'left', marginTop: '24px' }}>{t('TermsAndConditions.sexualHarassmentPolicyTitle')}</h2>

                <h3 style={styles.subheading}>{t('TermsAndConditions.sexualHarassmentPurpose')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentPurpose1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentPurpose2')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.definitionOfSexualHarassment')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentDefinition')}</li>
                </ul>
                <p style={{ ...styles.text, marginLeft: '16px', marginTop: '8px' }}>{t('TermsAndConditions.examplesProhibitedConduct')}</p>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentExample1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentExample2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentExample3')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentExample4')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentExample5')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.scopeTitle')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.scopeText')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.scopeVoice')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.scopeTextSessions')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.scopeInApp')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.reportingHarassment')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.reportingHarassment1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.reportingHarassment2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.reportingHarassment3')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.sexualHarassmentRepercussions')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentZeroTolerance')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentFirstOffense')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentSecondOffense')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentThirdOffense')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.sexualHarassmentSevereViolations')}</li>
                </ul>

                <h2 style={{ ...styles.mainTitle, textAlign: 'left', marginTop: '24px' }}>{t('TermsAndConditions.privacyTitle')}</h2>

                <p style={styles.text}>{t('TermsAndConditions.privacyEffectiveDate')}</p>
                <p style={styles.text}>{t('TermsAndConditions.privacyContact')}</p>
                <p style={styles.text}>{t('TermsAndConditions.privacyIntro')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.informationWeCollect')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.informationWeCollectIntro')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.informationYouProvide')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.informationYouProvide1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.informationYouProvide2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.informationYouProvide3')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.informationYouProvide4')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.informationCollectedAutomatically')}</h3>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.informationCollectedAutomatically1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.informationCollectedAutomatically2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.informationCollectedAutomatically3')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.specialCategories')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.specialCategoriesText')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.howWeUseYourInformation')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.howWeUseYourInformationIntro')}</p>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeUse1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeUse2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeUse3')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeUse4')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeUse5')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeUse6')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeUse7')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.legalBasesForProcessing')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.legalBasesIntro')}</p>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.legalBases1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.legalBases2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.legalBases3')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.legalBases4')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.howWeShareYourInformation')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.howWeShareIntro')}</p>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeShare1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeShare2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.howWeShare3')}</li>
                </ul>

                <h3 style={styles.subheading}>{t('TermsAndConditions.internationalDataTransfers')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.internationalDataTransfers1')}</p>
                <p style={styles.text}>{t('TermsAndConditions.internationalDataTransfers2')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.dataRetention')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.dataRetention1')}</p>
                <p style={styles.text}>{t('TermsAndConditions.dataRetention2')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.yourRights')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.yourRightsIntro')}</p>
                <ul style={{ paddingLeft: '16px' }}>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.yourRights1')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.yourRights2')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.yourRights3')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.yourRights4')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.yourRights5')}</li>
                    <li style={styles.bulletPoint}>{t('TermsAndConditions.yourRights6')}</li>
                </ul>
                <p style={styles.text}>{t('TermsAndConditions.yourRightsContact')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.cookiesAndTracking')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.cookiesAndTrackingText')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.securityMeasures')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.securityMeasuresText')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.childrensPrivacy')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.childrensPrivacyText')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.thirdPartyLinks')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.thirdPartyLinksText')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.changesToThisPolicy')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.changesToThisPolicyText')}</p>

                <h3 style={styles.subheading}>{t('TermsAndConditions.contactUs')}</h3>
                <p style={styles.text}>{t('TermsAndConditions.contactUsIntro')}</p>
                <p style={styles.text}>{t('TermsAndConditions.contactUsTeam')}</p>
                <p style={styles.text}>{t('TermsAndConditions.contactUsEmail')}</p>
            </div>
        </div>
    );
};
