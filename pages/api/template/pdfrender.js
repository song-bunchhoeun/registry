import { getData } from "@govtechsg/open-attestation";
import { registerFonts } from "../../../lib/shared.js";
import { createBacIICanvas } from "../../../lib/create-bacii-canvas.js";
import { createCADTCertCanvas } from "../../../lib/create-cadt-cert-canvas.js";
import _get from "lodash/get.js";
import { createAUPPCertCanvas } from "../../../lib/create-aupp-canvas.js";
import templates from "../../../lib/templates.js";

import utif from "utif";
import { createMPTCCertCanvas } from "../../../lib/create-mptc-canvas.js";
import { createNUMCertCanvas } from "../../../lib/create-num-cert-canvas.js";
import { createMPTCGDAWorkshopCertCanvas } from "../../../lib/create-mptc-gda-workshop-cert-canvas.js";
import { createMPTCTeachoDigitalTalentCertCanvas } from "../../../lib/cteate-mptc-techo-digital-talent-scholarship-canvas.js";
import { createMPTCGDAWorkshopPailinCertCanvas } from "../../../lib/create-mptc-gda-workshop-pailin-cert-canvas.js";
import { createMoEYSStudentCardKhCanvas } from "../../../lib/create-moeys-student-card-kh-convas.js";
import { createMPTCGDAWorkshopKampongThomCertCanvas } from "../../../lib/create-mptc-gda-workshop-kampong-thom-cert-canvas.js";
import { createITCEngineerCertCanvas } from "../../../lib/cteate-itc-engineer-cert-canvas.js";
import { createMPTCDataGovernanceCertCanvas } from "../../../lib/cteate-mptc-gda-data-covernance-workshop-canvas.js";
import { createCadtBachelorCertCanvas } from "../../../lib/create-cadt-bachelor-cert-canvas.js";
import { createITCBachelorEngineerCertCanvas } from "../../../lib/cteate-itc-bachelor-engineer-cert-canvas.js";
import { createNUMMasterCertCanvas } from "../../../lib/create-num-master-cert-canvas.js";
import { createNUMPhdCertCanvas } from "../../../lib/create-num-phd-cert-canvas.js";
import { createMPTCGDACoordinatorThanksLetterCanvas } from "../../../lib/create-mptc-gda-coordinator-thanks-letter-canvas.js";
import { createMPTCGDAGuestSpeakerThanksLetterCanvas } from "../../../lib/create-mptc-gda-guest-speaker-thanks-letter-canvas.js";
import { createMPTCGDAWorkshopPreahSihanoukCertCanvas } from "../../../lib/create-mptc-gda-workshop-preah-sihanouk-cert-canvas.js";
import { createMPTCUndesaCertCanvas } from "../../../lib/create-mptc-undesa-cert.js";
import { createCadtOECDCertCanvas } from "../../../lib/create-cadt-oecd-cert-canvas.js";
import { createMPTCGDAWorkshopLevelFourCertCanvas } from "../../../lib/create-mptc-gda-workshop-ewp-level-four-cert-canvas.js";
import { createMPTCAdminCfInternCanvas } from "../../../lib/create-mptc-admin-cf-intern-canvas.js";

import PDFDocument from "pdfkit";
import { createMPTCRuppInternCanvas } from "../../../lib/create-mptc-rupp-intern-convas.js";
import { createCADTTrainingCertCanvas } from "../../../lib/create-cadt-training-cert-canvas.js";
import { createCADTTrainingCertificate } from "../../../lib/create-cadt-training-certificate.js";
import { createKCITTemporaryBachelorCertificate } from "../../../lib/create-kcit-temporary-bachelor-certificate.js";
import { createKCITTemporaryCertificate } from "../../../lib/create-kcit-temporary-certificate.js";
import { createCADTGovTechCertificateCanvas } from "../../../lib/create-cadt-govtech-appreciation-canvas.js";
import { createRUFABachelorCertCanvas } from "../../../lib/create-rufa-bachelor-cert-canvas.js";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";
import { createSRUAssociateTemCertCanvas } from "../../../lib/create-sru-associate-tem-cert-canvas.js";
import { createSRUBachelorTemCertCanvas } from "../../../lib/create-sru-bachelor-tem-cert-canvas.js";
import { createBacIICanvas2023 } from "../../../lib/create-bacii-canvas-2023.js";
import { createRUFAStudentCard } from "../../../lib/create-rufa-student-card-canvas.js";
import { createRULEBachelorCert } from "../../../lib/create-rule-bachelor-certificate.js";
import { createRUPPBachelorDegreeCanvas } from "../../../lib/create-rupp-ba-cerrt-canvas.js";
import { createRUPPBachelorFrancDegreeCanvas } from "../../../lib/create-rupp-ba-cerrt-franc-canvas.js";
import { createAUPPBachelorCertificate2024 } from "../../../lib/create-aupp-bachelor-certificate-2024.js";
import { createAUPPMasterCertificate2024 } from "../../../lib/create-aupp-master-certificate-2024.js";
import { createMoINFOPressCard } from "../../../lib/create-moinfo-press-card.js";
import { createMoINFOFreelancerCard } from "../../../lib/create-moinfo-freelancer-card.js";
import { createMoINFOStaffCard } from "../../../lib/create-moinfo-staff-card.js";
import { createKSITAssociateCertificate } from "../../../lib/create-ksit-associate-certificate.js";
import { createKSITBachelorCertificate } from "../../../lib/create-ksit-bachelor-certificate.js";
import { validateSchema } from "@govtechsg/open-attestation";
import { createRULEBachelorCertCanvas } from "../../../lib/create-rule-bachelor-cert-canvas.js";
import { createMOCCertificateOfIncorporation } from "../../../lib/create-moc-certificate-of-incorporation.js";
import { createKCNIABachelorCert } from "../../../lib/create-kcnia-ba-certificate.js";
import { createKCNIAAssociateCert } from "../../../lib/create-kcnia-as-certificate.js";
import { createMPTCitcInternCertCanvas } from "../../../lib/create-mptc-itc-intern-canvas.js";
import { createMinfoWritingNews2024Certificate } from "../../../lib/create-minfo-writing-cert-2024-canvas.js";
import { createMoinspectorGenerationSixCertCanvas } from "../../../lib/create-moinspector-generation-six-cert-canvas.js";
import { createBIUBachelorCertCanvas } from "../../../lib/create-biu-bachelor-certificates-canvas.js";
import { createMptcGdaWorkshopStep32024Canvas } from "../../../lib/create-mptc-gda-workshop-step3-2024-canvas.js";
import { createNIABachelorCertificate } from "../../../lib/create-nia-bachelor-certificate.js";
import { createNIAAssociateCertificate } from "../../../lib/create-nia-associate-certificate.js";
import { createNIAMasterCertificate } from "../../../lib/create-nia-master-certificate.js";
import { createMptcWorkshopParticipatePPCanvas } from "../../../lib/create-mptc-workshop-participate-pp-certificate.js";
import { createMptcWorkshopParticipateCanvas } from "../../../lib/create-mptc-workshop-participate-speaker-canvas.js";
import { createDGCWorkshopCertificate } from "../../../lib/create-dgc-workshop-certificate.js";
import { createBIUIpDoctorCertificate } from "../../../lib/create-biu-ip-doctor-certificate.js";
import { createRUABachelorCertificate } from "../../../lib/create-rua-bachelor-certificate.js";
import { createRUAMasterCertificate } from "../../../lib/create-rua-master-certificate.js";
import { createRUAAssociateCertificate } from "../../../lib/create-rua-associate-certificate.js";
import { createRUAPHDCertificate } from "../../../lib/create-rua-phd-certificate.js";
import { createMptcGdaWorkshopWorkCertCanvas } from "../../../lib/create-mptc-gda-workshop-work-cert-canvas.js";
import { createMptcCertificateOfAppreciation } from "../../../lib/create-mptc-certificate-of-appreciation.js";
import { createMptcCertificateRecognitionCanvas } from "../../../lib/create-mptc-recognition-certificate.js";
import { createAUPPBachelorCertificateSummer2024 } from "../../../lib/create-aupp-bachelor-certificate-summer-2024.js";
import { createMptcDslpTrainingCertificate } from "../../../lib/create-mptc-dslp-training-certificate.js";
import { createRUADoctorCertificate } from "../../../lib/create-rua-doctor-certificate.js";
import { createCanvasSSFAProvisionalCertificateArtDegree } from "../../../lib/create-canvas-ssfa-provisional-certificate-art-degree.js";
import { createCanvasSSFATemporaryCertificateArtDegree } from "../../../lib/create-canvas-ssfa-temporary-certificate-art-degree.js";
import { createCadtCertificateOfAppreciation } from "../../../lib/create-cadt-certificate-of-appreciation.js";
import { createCadtCertificateRecognition } from "../../../lib/create-cadt-recognition-certificate.js";
import { createMFAICKhmerIdentifyCard } from "../../../lib/create-mfaic-khmer-identify-card.js";
import { createDGCGovTeachCertificateCanvas } from "../../../lib/create-dgc-govtech-certificate-appreciation.js";
import { createMptcAIForum2024Cert } from "../../../lib/create-mptc-ai-forum-2024-cert.js";
import { createMPTCCdeCertificateCanvas } from "../../../components/MPTCCdeCertificateCanvas.js";
import { createRUPPMasterDegreeCanvas } from "../../../lib/create-rupp-master-cerrt-canvas.js";
import { createMPTCITCInternComplationCanvas } from "../../../lib/create-mptc-itc-intern-complation-convas.js";
import { createMoTOfficialCard } from "../../../lib/create-mot-official-card.js";
import { createMptcCamSpeakerCertificate } from "../../../lib/create-mtpc-cam-speaker-certificate.js";
import { createMoINFOPressCardCamdx } from "../../../lib/create-moinfo-press-card-camdx.js";
import { createMptcGdaWorkshopLeadershipInnovationCertCanvas } from "../../../lib/create-mptc-gda-workshop-leadership-innovation-cert-canvas.js";
import { createSsfaBaccalaureateCertificate } from "../../../lib/create-ssfa-baccalaureate-cert-canvas.js";
import { createBIUMasterCertCanvas } from "../../../lib/create-biu-master-certificates-canvas.js";
import { createMptcRIATrainingRecognitionCanvas } from "../../../lib/create-mptc-ria-training-recognition-cert-canva.js";
import { createMPTCTeachoDigitalCert2025Canvas } from "../../../lib/create-mptc-techo-digital-scholarship-2025-canvas.js";
import { createBIUAssociateCertCanvas } from "../../../lib/create-biu-associate-certificates-canvas.js";
import { createMptccybersecuritytrainerCanvas } from "../../../lib/create-mptc-cybersecurity-trainer-recognition-cert-canva.js";
import { createPPCATourismLicenseCertificate } from "../../../lib/create-ppca-tourism-license.js";
import { createAUPPMasterCertificate2025 } from "../../../lib/create-aupp-master-certificate-2025.js";
import { createNIEPhdCertificateCanvas } from "../../../lib/create-nie-phd-certificate-canvas.js";
import { createAUPPInnovationEcosystemMentorCompletionCertificate } from "../../../lib/create-aupp-innovation-ecosystem-mentor-completion-certificate.js";
import { createRULEMasterCertificate } from "../../../lib/create-rule-master-certificate.js";
import { createMinfoWritingNews2025Certificate } from "../../../lib/create-minfo-writing-cert-2025-canvas.js";
import { createMptcIctCnccCanvas } from "../../../lib/create-mptc-ict-cncc-canvas.js";
import { createCADTCyberResilienceAndSafetyCultureCanvas } from "../../../lib/create-cadt-cyber-resilience-and-safety-culture-canvas.js";
import { createRUPPPhdDegreeCanvas } from "../../../lib/create-rupp-phd-cerrt-canvas.js";
import { createMPTCPromotingDigitalAdoptionCertificateCanvas } from "../../../lib/create-mptc-promoting-digital-adoption-recognition-certificate-canvas.js";
import { createMptcWrtingCompetitionCanvas } from "../../../lib/create-mptc-writing-competition-canvas.js";
import { createMPTCDigitalSkillTrainerCompletionCertificateCanvas } from "../../../lib/create-mptc-digital-tech-skill-trainer-completion-certificate-canvas.js";
import { createMoTTouristGuideCard } from "../../../lib/create-mot-tourist-guide-card.js";
import { createMoTContractualCard } from "../../../lib/create-mot-contractual-card.js";
import { createDichiAppreciationCertificateCanvas } from "../../../lib/create-dichi-certificate-canvas.js";
import { createMPTCDataDrivenWorkCompletionCanvas } from "../../../lib/create-mptc-data-driven-work-completion.js";
import { createMPTCDigitalAdoptionAppreciationCertificateCanvas } from "../../../lib/create-mptc-digital-adoption-appreciation-certificate-canvas.js";
import { createSERCDerivativesRepresentativeLicenseCardCanvas } from "../../../lib/create-serc-derivatives-representative-license-card-canvas.js";
import { createSercCentralCounterpartyLicenceCertificateCanvas } from "../../../lib/create-serc-central-license-counterparty-certificate-canvas.js";
import { createSercProviderAuthorizationCertificateCanvas } from "../../../lib/create-serc-provider-authorization-certificate-canvas.js";
import { createMptcOnlineForum2025Canvas } from "../../../lib/create-mptc-online-safety-forum-2025-canvas.js";
import { createSercDerivativesBrokerLicenceCertificateCanvas } from "../../../lib/create-serc-derivatives-broker-license-certificate-canvas.js";
import { createSercFinancialAdvisoryLicenceCertificateCanvas } from "../../../lib/create-serc-financial-advisory-license-certificate-canvas.js";
import { createSercFundManagementLicenceCertificateCanvas } from "../../../lib/create-serc-fund-management-license-certificate-canvas.js";
import { createSercDerivateBrokerAuthorizationCertificateCanvas } from "../../../lib/create-serc-derivative-broker-authorization-certificate-canvas.js";
import { createSercParticipationAuthorizationCertificateCanvas } from "../../../lib/create-serc-participation-financial-technology-regulatory-sandbox-authorization-certificate-canvas.js";
import { createSercFundDistributionAuthorizationCertificateCanvas } from "../../../lib/create-serc-fund-distribution-authorization-certificate-canvas.js";
import { createSercFinancialAdvisoryAuthorizationCertificateCanvas } from "../../../lib/create-serc-financial-advisory-company-authorization-certificate-canvas.js";
import { createSercInvestmentAdvisoryAuthorizationCertificateCanvas } from "../../../lib/create-serc-investment-advisory-company-authorization-certificate-canvas.js";
import { createSercFundTrusteeAuthorizationCertificateCanvas } from "../../../lib/create-serc-fund-trustee-company-authorization-certificate-canvas.js";
import { createSercGovernmentSecuritiesDealerAuthorizationCertificateCanvas } from "../../../lib/create-serc-government-securities-dealer-authorization-certificate-canvas.js";
import { createSercSecuritiesClearingSettlementAuthorizationCertificateCanvas } from "../../../lib/create-serc-securities-clearing-settlement-authorization-certificate-canvas.js";
import { createSercSecuritiesCustodianAuthorizationCertificateCanvas } from "../../../lib/create-serc-securities-custodian-authorization-certificate-canvas.js";
import { createSercSecuritiesDistributionAuthorizationCertificateCanvas } from "../../../lib/create-serc-securities-distribution-authorization-certificate-canvas.js";
import { createSercSecuritiesMarketAuthorizationCertificateCanvas } from "../../../lib/create-serc-securities-market-authorization-certificate-canvas.js";
import { createSRUMasterCertificateCanvas } from "../../../lib/create-sru-master-cert-canvas.js";
import { createSRUAssociateCertificateCanvas } from "../../../lib/create-sru-associate-cert-canvas.js";
import { createSRUBachelorCertificateCanvas } from "../../../lib/create-sru-bachelor-cert-canvas.js";
import { createKCITBachelorCertificate } from "../../../lib/create-kcit-bachelor-certificate.js";
import { createKCITAssociateCertificate } from "../../../lib/create-kcit-associate-certificate.js";
import { createMOCARHighschoolBuddhistStudyTemporaryCertificateCanvas } from "../../../lib/create-mocar-highschool-buddhist-study-temporary-certificate-canvas.js";
import { createMoCaRPharmaDisciplineCertficate } from "../../../lib/create-mocar-pharma-discipline-certificate.js";
import { createMoCaRPrimarySchoolBuddhistStudyCertificte } from "../../../lib/create-mocar-primary-school-buddhist-study-certificate.js";
import { createNMUAssociateCertificate } from "../../../lib/create-nmu-associate-certificate.js";
import { createNMUBachelorCertificate } from "../../../lib/create-nmu-bachelor-certificate.js";
import { createNMUMasterCertificate } from "../../../lib/create-nmu-master-certificate.js";
import { createSERCITProviderRepresentativeAuthorizationLicenceCardCanvas } from "../../../lib/create-serc-it-provider-representative-authorization-licence-card-canvas.js";
import { createMOCARHighschoolBuddhistStudyCertificateCanvas } from "../../../lib/create-mocar-highschool-buddhist-study-certificate-canvas.js";
import { createSERCCrownfundingRepresentativeLicenseCardCanvas } from "../../../lib/create-serc-crownfunding-representative-license-card-canvas.js";
import { createSERCFinancialAdvisoryRepresentativeLicenseCardCanvas } from "../../../lib/create-serc-financial-advisory-representative-license-card-canvas.js";
import { createSERCFundManagementRepresentativeLicenseCardCanvas } from "../../../lib/create-serc-fund-management-representative-license-card-canvas.js";
import { createSERCFundSellingRepresentativeLicenseCardCanvas } from "../../../lib/create-serc-fund-selling-representative-license-card-canvas.js";
import { createSERCSecuritiesRepresentativeLicenseCardCanvas } from "../../../lib/create-serc-securities-representative-license-card-canvas.js";
import { createMoCaRLowerSecondarySchoolBuddhistStudyDegree } from "../../../lib/create-mocar-lower-secondary-school-buddhist-study-degree.js";
import { createMoCaRUpperSecondarySchoolBuddhistStudyDegree } from "../../../lib/create-mocar-upper-secondary-school-buddhist-study-degree.js";
import { createTRCImportAgentRecognitionCertificate } from "../../../lib/create-trc-import-agent-recognition-certificate.js";
import { createAUPPMasterCertificate2022 } from "../../../lib/create-aupp-master-certificate-2022.js";
import { createAUPPMasterCertificateSummer2025 } from "../../../lib/create-aupp-master-certificate-summer-2025.js";
import { createAUPPBachelorCertificateSummer2025 } from "../../../lib/create-aupp-bachelor-certificate-summer-2025.js";
import { createMptcLmcCertificateCanvas } from "../../../lib/create-mptc-lmc-certificate-canvas.js";
import { createMptcPersonalDataProtectionAppreciationCertificateCanvas } from "../../../lib/create-mptc-personal-data-protection-appreciation-certificate-canvas.js";
import { createNIEInspectorCertificate } from "../../../lib/create-nie-inspector-certificate.js";
import { createNIEMasterFrenchCertificate } from "../../../lib/create-nie-master-french-certificate.js";
import { createNIEMasterCertificateCanvas } from "../../../lib/create-nie-master-certificate-canvas.js";
import { createMPTCCda2025CertificateCanvas } from "../../../components/MPTCCDA2025CertificateCanvas.js";
import { createMPTCCda2025WinnerCertificateCanvas } from "../../../lib/create-mptc-cda-2025-winner-certificate-canvas.js";
import { createCamTechBachelorCertificateCanvas } from "../../../lib/create-camtech-bachelor-certificate-canvas.js";
import { createCamTechMasterCertificateCanvas } from "../../../lib/create-camtech-master-certificate-canvas.js";
import { createCamTechPHDCertificateCanvas } from "../../../lib/create-camtech-phd-certificate-canvas.js";
import { createCamTechTrainingCertificateCanvas } from "../../../lib/create-camtech-training-certificate-canvas.js";
import { createMPTCDGFVolunteerAppreciationCertificateCanvas } from "../../../lib/create-mptc-dgf-volunteer-appreciation-certificate-canvas.js";
import { createMoINFOPressCardV2 } from "../../../lib/create-moinfo-press-card-v2.js";
import { createMptcTrainingOfTrainerCertificateCanvas } from "../../../lib/create-mptc-training-of-trainer-certificate-canvas.js";
import { createMptcPDPRecognitionCanvas } from "../../../lib/create-mptc-pdp-recognition-certificate.js";
import { createCpfacPermitRegister } from "../../../lib/create-cpfac-permit-register.js";
import { createAuppBachelorCertificateFall2025Canvas } from "../../../lib/create-aupp-bachelor-certificate-fall-2025-canvas.js";
import { createAuppMasterCertificateFall2025Canvas } from "../../../lib/create-aupp-master-certificate-fall-2025-canvas.js";
import { createCpfacProductSpecificationCertificateCanvas } from "../../../lib/create-cpfac-product-specification-certificate-canvas.js";
import { createMPTCCybersecurityWorkshop2026CertificateCanvas } from "../../../lib/create-mptc-cybersecurity-workshop-2026-certificate-canvas.js";
import { createMoTChinaAccreditedCard } from "../../../lib/create-mot-china-accredited-card.js";
import { createMPTCTrainingBDSCertificateCanvas } from "../../../lib/create-mptc-training-bds-certificate-canvas.js";
import { createMOTChinaAccreditedCertificateCanvas } from "../../../lib/create-mot-china-accredited-certificate-canvas.js";
import { createAUPPNewCertificateCanvas } from "../../../lib/create-aupp-new-certificate.js";
import { createMPTCInternship2026CertificateCanvas } from "../../../lib/create-mptc-internship-2026-certificate-canvas.js";
import { createMptcCompletionUnidirCertificate } from "../../../lib/create-mptc-completion-unidir-certificate.js";
import { createMPTCGDABackCard } from "../../../lib/create-mptc-teacher-digital-back-card.js";
import { createMPTCGDAFrontCard } from "../../../lib/create-mptc-teacher-digital-front-card.js";
import { createSSFADiplomaCertificateCanvas } from "../../../lib/create-ssfa-diploma-certificate-canvas.js";
import { createMoInspectionOfficialIDFrontCard } from "../../../lib/create-moinspection-staff-id-front-card.js";
import { createMOPNSPParticipationCertificateCanvas } from "../../../lib/create-mop-nsps-participation-certificate-canvas.js";
import { createMoINFOConstractStaffCardFront } from "../../../lib/create-moinfo-constract-staff-card-front.js";
import { createMoINFOConstractStaffCardBack } from "../../../lib/create-moinfo-constract-staff-card-back.js";
import { createAUPPPostgraduateCertificateCanvas } from "../../../lib/create-aupp-postgraduate-certificate-canvas.js";
import { createMptcWritingCompetition2026Canvas } from "../../../lib/create-mptc-writing-competition-2026-canvas.js";
import { createMptcAdvanceDigitalSkillsCertificate } from "../../../lib/create-mtpc-advance-digital-skills-certificate.js";
import { createMptcWrtingCompetitionAppreciationCanvas } from "../../../lib/create-mptc-writing-competition-2026-appreciation-canvas.js";
import { createFSAOfficialIDCardBack } from "../../../lib/create-fsa-official-id-card-back.js";
import { createFSAOfficialIDCardFront } from "../../../lib/create-fsa-official-id-card-front.js";
import { createMPTCCyberIncidentResponseCertificateCanvas } from "../../../lib/create-mptc-cyber-incident-response-certificate-canvas.js";
import { createPPCAHealthHygieneCertificateCanvas } from "../../../lib/create-ppca-health-hygiene-certificate-canvas.js";
import { createPPCAOWSChamkarmornTourismLicenseCertificateCanvas } from "../../../lib/create-ppca-ows-chamkarmorn-tourism-license-certificate-canvas.js";
import { createMPTCICTLancangRegionalCybersecurityCertificateCanvas } from "../../../lib/create-mptc-ict-lancang-mekong-regional-cybersecurity-certificate-canvas.js";

registerFonts();

/**
 * Renderer Handler
 * @param {import('next').NextApiRequest} request
 * @param {import('next').NextApiResponse} response
 */

export default async function (request, response) {
  const { qrcode, wrappedDocument: wrappedDocumentString } =
    request.method === "POST" ? request.body : request.query;

  const wrappedDocument =
    typeof wrappedDocumentString === "string"
      ? JSON.parse(wrappedDocumentString)
      : wrappedDocumentString;

  /* const { qrcode, wrappedDocument: wrappedDocumentString } = request.query;
  const wrappedDocument = JSON.parse(wrappedDocumentString); */
  /*
if (!verifySignature(wrappedDocument)) {
  response.status(400).json({ msg: 'invalid signature or document has been tampered with' });
  return;
}*/

  const responseType = request.body.type || "pdf";
  const preview =
    request.body.preview === true || request.body.preview === "true";
  let data;
  try {
    data = getData(wrappedDocument);
    // FROM OA
  } catch (err) {
    data = wrappedDocument;
    // RAW
  }
  if (data === undefined) data = wrappedDocument;

  const templateName = data.$template.name;

  if (typeof templateName !== "string") {
    response.status(400).end();
    return;
  }

  // handle nullish field
  const get = (fieldPath, fallback = "") => _get(data, fieldPath, fallback);

  let canvas;

  if (templateName === templates.MOEYS_BACII_CERTIFICATE_2023) {
    const signatureDate = get("certificate.signatureDate", "").split("\n");
    const certificateInfo = {
      id: get("certificate.id"),
      name: get("recipient.name"),
      gender: get("recipient.gender"),
      dateOfBirth: get("recipient.dateOfBirth"),
      placeOfBirth: get("recipient.placeOfBirth"),
      fatherName: get("recipient.fatherName"),
      motherName: get("recipient.motherName"),
      photoUrl: get("recipient.photoUrl"),
      program: get("certificate.program"),
      grade: get("certificate.grade"),
      rank: get("certificate.rank"),
      seat: get("certificate.center.seat"),
      room: get("certificate.center.room"),
      examDate: get("certificate.examDate"),
      centerName: get("certificate.center.id"),
      grades: get("certificate.subjectGrades", []),
      dates: signatureDate,
      barcode: get("certificate.barcode"),
      metadata: get("certificate.metadata"),
      originalPhotoPath: get("recipient.originalPhotoPath") || "",
    };

    // change examCenter with whitelist
    const metadata = get("certificate.metadata");
    const centerId = metadata.slice(2, 20);
    const examCenters = (
      await import("../../../assets/data/ExamCenter2023.json")
    ).default;
    const newCenterName = examCenters[centerId];
    if (newCenterName) certificateInfo.centerName = newCenterName;

    // change metadata format dd/mm/yyyy
    const splitted = metadata.split(" ");
    const metaDate = splitted[1].replace("(", "").split("/");
    const changeDate = [metaDate[1], metaDate[0], metaDate[2]];
    const dmyDate = "(" + changeDate.join("/");
    splitted[1] = dmyDate;
    certificateInfo.metadata = splitted.join(" ");

    if (templateName === templates.CADT_DSE_ERA_CERTIFICATE) {
      canvas = await createCADTCertCanvas(data, qrcode);
    }
    if (
      templateName === templates.MPTC_GDA_TECHO_DIGITAL_SCHOLARSHIP_CERTIFICATE
    ) {
      canvas = await createMPTCTeachoDigitalTalentCertCanvas(data, qrcode);
    }
    if (templateName === templates.MPTC_GDA_WORKSHOP_PAILIN_CERTIFICATE) {
      canvas = await createMPTCGDAWorkshopPailinCertCanvas(data, qrcode);
    }
    if (templateName === templates.MPTC_GDA_WORKSHOP_KAMPONG_THOM_CERTIFICATE) {
      canvas = await createMPTCGDAWorkshopKampongThomCertCanvas(data, qrcode);
    }
    if (templateName === templates.ITC_ENGINEER_DEGREE_CERTIFICATE) {
      canvas = await createITCEngineerCertCanvas(data, qrcode);
    }
    if (
      templateName === templates.MPTC_GDA_DATA_GOVERNANCE_WORKSHOP_CERTIFICATE
    ) {
      canvas = await createMPTCDataGovernanceCertCanvas(data, qrcode);
    }
    if (templateName === templates.CADT_BACHELOR_CERTIFICATE) {
      canvas = await createCadtBachelorCertCanvas(data, qrcode);
    }
    if (templateName === templates.ITC_BACHELOR_ENGINEER_DEGREE_CERTIFICATE) {
      canvas = await createITCBachelorEngineerCertCanvas(data, qrcode);
    }
    if (templateName === templates.NUM_MASTER_CERTIFICATE) {
      canvas = await createNUMMasterCertCanvas(data, qrcode);
    }
    if (templateName === templates.NUM_PHD_CERTIFICATE) {
      canvas = await createNUMPhdCertCanvas(data, qrcode);
    }
    if (templateName === templates.NUM_BACHELOR_CERTIFICATE) {
      canvas = await createNUMCertCanvas(data, qrcode);
    }
    if (templateName === templates.MPTC_GDA_WORKSHOP_COORDINATOR_CERTIFICATE) {
      canvas = await createMPTCGDACoordinatorThanksLetterCanvas(data, qrcode);
    }
    if (
      templateName === templates.MPTC_GDA_WORKSHOP_GUEST_SPEAKER_CERTIFICATE
    ) {
      canvas = await createMPTCGDAGuestSpeakerThanksLetterCanvas(data, qrcode);
    }
    if (
      templateName === templates.MPTC_GDA_WORKSHOP_PREAH_SIHANOUK_CERTIFICATE
    ) {
      canvas = await createMPTCGDAWorkshopPreahSihanoukCertCanvas(data, qrcode);
    }
    if (templateName === templates.MPTC_DG_UNDESA_WORKSHOP_CERTIFICATE) {
      canvas = await createMPTCUndesaCertCanvas(data, qrcode);
    }
    if (templateName === templates.MPTC_DG_OECD_WORKSHOP_CERTIFICATE) {
      canvas = await createCadtOECDCertCanvas(data, qrcode);
    }
    if (templateName === templates.MPTC_GDA_WORKSHOP_EXTERNAL_CERTIFICATE) {
      canvas = await createMPTCGDAWorkshopLevelFourCertCanvas(data, qrcode);
    }
    if (templateName === templates.MPTC_GDA_INTERNSHIP_CERTIFICATE) {
      canvas = await createMPTCAdminCfInternCanvas(data, qrcode);
    }
    if (templateName === templates.MPTC_RUPP_INTERNSHIP_CERTIFICATE) {
      canvas = await createMPTCRuppInternCanvas(data, qrcode);
    }
    if (templateName === templates.CADT_CERTIFICATE_OF_COMPLETION) {
      canvas = await createCADTTrainingCertificate(data, qrcode);
    }
    if (templateName === templates.CADT_BACHELOR_DEGREE) {
      canvas = await createCadtBachelorCertCanvas(data, qrcode);
    }
    if (templateName === templates.DGC_GOVTECH_CERTIFICATE_OF_APPRECIATION) {
      canvas = await createCADTGovTechCertificateCanvas(data, qrcode);
    }
    if (templateName === templates.RUPP_BACHELOR_DEGREE) {
      canvas = await createRUPPBachelorDegreeCanvas(data, qrcode);
    }
    if (templateName === templates.RUPP_FRANCE_BACHELOR_DEGREE) {
      canvas = await createRUPPBachelorFrancDegreeCanvas(data, qrcode);
    }

    canvas = await createBacIICanvas2023(certificateInfo, qrcode);
  }

  if (templateName === templates.CADT_DSE_ERA_CERTIFICATE) {
    canvas = await createCADTCertCanvas(data, qrcode);
  }
  if (
    templateName === templates.MPTC_GDA_TECHO_DIGITAL_SCHOLARSHIP_CERTIFICATE
  ) {
    canvas = await createMPTCTeachoDigitalTalentCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_PAILIN_CERTIFICATE) {
    canvas = await createMPTCGDAWorkshopPailinCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_KAMPONG_THOM_CERTIFICATE) {
    canvas = await createMPTCGDAWorkshopKampongThomCertCanvas(data, qrcode);
  }
  if (templateName === templates.ITC_ENGINEER_DEGREE_CERTIFICATE) {
    canvas = await createITCEngineerCertCanvas(data, qrcode);
  }
  if (
    templateName === templates.MPTC_GDA_DATA_GOVERNANCE_WORKSHOP_CERTIFICATE
  ) {
    canvas = await createMPTCDataGovernanceCertCanvas(data, qrcode);
  }
  if (templateName === templates.CADT_BACHELOR_CERTIFICATE) {
    canvas = await createCadtBachelorCertCanvas(data, qrcode);
  }
  if (templateName === templates.ITC_BACHELOR_ENGINEER_DEGREE_CERTIFICATE) {
    canvas = await createITCBachelorEngineerCertCanvas(data, qrcode);
  }
  if (templateName === templates.NUM_MASTER_CERTIFICATE) {
    canvas = await createNUMMasterCertCanvas(data, qrcode);
  }
  if (templateName === templates.NUM_PHD_CERTIFICATE) {
    canvas = await createNUMPhdCertCanvas(data, qrcode);
  }
  if (templateName === templates.NUM_BACHELOR_CERTIFICATE) {
    canvas = await createNUMCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_COORDINATOR_CERTIFICATE) {
    canvas = await createMPTCGDACoordinatorThanksLetterCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_GUEST_SPEAKER_CERTIFICATE) {
    canvas = await createMPTCGDAGuestSpeakerThanksLetterCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_PREAH_SIHANOUK_CERTIFICATE) {
    canvas = await createMPTCGDAWorkshopPreahSihanoukCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_DG_UNDESA_WORKSHOP_CERTIFICATE) {
    canvas = await createMPTCUndesaCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_DG_OECD_WORKSHOP_CERTIFICATE) {
    canvas = await createCadtOECDCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_EXTERNAL_CERTIFICATE) {
    canvas = await createMPTCGDAWorkshopLevelFourCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_INTERNSHIP_CERTIFICATE) {
    canvas = await createMPTCAdminCfInternCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_RUPP_INTERNSHIP_CERTIFICATE) {
    canvas = await createMPTCRuppInternCanvas(data, qrcode);
  }
  if (templateName === templates.CADT_CERTIFICATE_OF_COMPLETION) {
    canvas = await createCADTTrainingCertificate(data, qrcode);
  }
  if (templateName === templates.KCIT_TEMPORARY_BACHELOR_CERTIFICATE) {
    canvas = await createKCITTemporaryBachelorCertificate(data, qrcode);
  }
  if (templateName === templates.CADT_BACHELOR_DEGREE) {
    canvas = await createCadtBachelorCertCanvas(data, qrcode);
  }
  if (templateName === templates.KCIT_TEMPORARY_ASSOCIATE_CERTIFICATE) {
    canvas = await createKCITTemporaryCertificate(data, qrcode);
  }
  if (templateName === templates.DGC_GOVTECH_CERTIFICATE_OF_APPRECIATION) {
    canvas = await createCADTGovTechCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.RUPP_BACHELOR_DEGREE) {
    canvas = await createRUPPBachelorDegreeCanvas(data, qrcode);
  }
  if (templateName === templates.RUPP_FRANCE_BACHELOR_DEGREE) {
    canvas = await createRUPPBachelorFrancDegreeCanvas(data, qrcode);
  }

  if (templateName === templates.AUPP_BACHELOR_CERTIFICATE) {
    canvas = await createAUPPCertCanvas(data, qrcode);
  }

  if (templateName === templates.MPTC_RECOGNITION_CERTIFICATE) {
    canvas = await createMPTCCertCanvas(data, qrcode);
  }

  if (
    templateName === templates.MPTC_GDA_TECHO_DIGITAL_SCHOLARSHIP_CERTIFICATE
  ) {
    canvas = await createMPTCTeachoDigitalTalentCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_PAILIN_CERTIFICATE) {
    canvas = await createMPTCGDAWorkshopPailinCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_KAMPONG_THOM_CERTIFICATE) {
    canvas = await createMPTCGDAWorkshopKampongThomCertCanvas(data, qrcode);
  }
  if (templateName === templates.ITC_ENGINEER_DEGREE_CERTIFICATE) {
    canvas = await createITCEngineerCertCanvas(data, qrcode);
  }
  if (
    templateName === templates.MPTC_GDA_DATA_GOVERNANCE_WORKSHOP_CERTIFICATE
  ) {
    canvas = await createMPTCDataGovernanceCertCanvas(data, qrcode);
  }
  if (templateName === templates.CADT_BACHELOR_CERTIFICATE) {
    canvas = await createCadtBachelorCertCanvas(data, qrcode);
  }
  if (templateName === templates.ITC_BACHELOR_ENGINEER_DEGREE_CERTIFICATE) {
    canvas = await createITCBachelorEngineerCertCanvas(data, qrcode);
  }
  if (templateName === templates.NUM_MASTER_CERTIFICATE) {
    canvas = await createNUMMasterCertCanvas(data, qrcode);
  }
  if (templateName === templates.NUM_PHD_CERTIFICATE) {
    canvas = await createNUMPhdCertCanvas(data, qrcode);
  }
  if (templateName === templates.NUM_BACHELOR_CERTIFICATE) {
    canvas = await createNUMCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_COORDINATOR_CERTIFICATE) {
    canvas = await createMPTCGDACoordinatorThanksLetterCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_GUEST_SPEAKER_CERTIFICATE) {
    canvas = await createMPTCGDAGuestSpeakerThanksLetterCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_PREAH_SIHANOUK_CERTIFICATE) {
    canvas = await createMPTCGDAWorkshopPreahSihanoukCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_DG_UNDESA_WORKSHOP_CERTIFICATE) {
    canvas = await createMPTCUndesaCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_DG_OECD_WORKSHOP_CERTIFICATE) {
    canvas = await createCadtOECDCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_WORKSHOP_EXTERNAL_CERTIFICATE) {
    canvas = await createMPTCGDAWorkshopLevelFourCertCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_GDA_INTERNSHIP_CERTIFICATE) {
    canvas = await createMPTCAdminCfInternCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_RUPP_INTERNSHIP_CERTIFICATE) {
    canvas = await createMPTCRuppInternCanvas(data, qrcode);
  }
  if (templateName === templates.CADT_CERTIFICATE_OF_COMPLETION) {
    canvas = await createCADTTrainingCertificate(data, qrcode);
  }
  if (templateName === templates.KCIT_TEMPORARY_BACHELOR_CERTIFICATE) {
    canvas = await createKCITTemporaryBachelorCertificate(data, qrcode);
  }
  if (templateName === templates.CADT_BACHELOR_DEGREE) {
    canvas = await createCadtBachelorCertCanvas(data, qrcode);
  }
  if (templateName === templates.KCIT_TEMPORARY_ASSOCIATE_CERTIFICATE) {
    canvas = await createKCITTemporaryCertificate(data, qrcode);
  }
  if (templateName === templates.DGC_GOVTECH_CERTIFICATE_OF_APPRECIATION) {
    canvas = await createCADTGovTechCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.RUFA_BACHELOR_DEGREE) {
    canvas = await createRUFABachelorCertCanvas(data, qrcode);
  }

  if (templateName === templates.SRU_TEMPORARY_BACHELOR_CERTIFICATE) {
    canvas = await createSRUBachelorTemCertCanvas(data, qrcode);
  }
  if (templateName === templates.SRU_TEMPORARY_ASSOCIATE_CERTIFICATE) {
    canvas = await createSRUAssociateTemCertCanvas(data, qrcode);
  }
  if (templateName === templates.RUFA_STUDENT_ID_CARD) {
    canvas = await createRUFAStudentCard(data, qrcode);
  }
  if (templateName === templates.KSIT_BACHELOR_DEGREE) {
    canvas = await createKSITBachelorCertificate(data, qrcode);
  }
  if (templateName === templates.KSIT_ASSOCIATE_DEGREE) {
    canvas = await createKSITAssociateCertificate(data, qrcode);
  }
  if (templateName === templates.RULE_BACHELOR_DEGREE) {
    canvas = await createRULEBachelorCertCanvas(data, qrcode, preview);
  }
  if (templateName === templates.AUPP_BACHELOR_CERTIFICATE_2024) {
    canvas = await createAUPPBachelorCertificate2024(data, qrcode);
  }
  if (templateName === templates.AUPP_MASTER_CERTIFICATE_2024) {
    canvas = await createAUPPMasterCertificate2024(data, qrcode);
  }
  if (templateName === templates.MOINFO_GDINB_PRESS_CARD) {
    canvas = await createMoINFOPressCard(data, qrcode);
  }
  if (templateName === templates.MOINFO_GDINB_FREELANCER_CARD) {
    canvas = await createMoINFOFreelancerCard(data, qrcode);
  }
  if (templateName === templates.MOINFO_STAFF_CARD) {
    canvas = await createMoINFOStaffCard(data, qrcode);
  }
  if (templateName === templates.MPTC_TECHO_DIGITAL_SCHOLARSHIP_CERTIFICATE) {
    canvas = await createMPTCTeachoDigitalCertCanvas(data, qrcode);
  }
  if (templateName === templates.MOC_INCORPORATION_CERTIFICATE) {
    canvas = await createMOCCertificateOfIncorporation(data, qrcode);
  }
  if (templateName === templates.KCNIA_BACHELOR_DEGREE) {
    canvas = await createKCNIABachelorCert(data, qrcode);
  }
  if (templateName === templates.KCNIA_ASSOCIATE_DEGREE) {
    canvas = await createKCNIAAssociateCert(data, qrcode);
  }

  if (templateName === templates.MPTC_INTERNSHIP_CERTIFICATE) {
    canvas = await createMPTCitcInternCertCanvas(data, qrcode);
  }
  if (templateName === templates.MOINFO_TRAINING_CERTIFICATE_2024) {
    canvas = await createMinfoWritingNews2024Certificate(data, qrcode);
  }

  if (templateName === templates.MOINSPECTION_INSPECTION_TRAINING_CERTIFICATE) {
    canvas = await createMoinspectorGenerationSixCertCanvas(data, qrcode);
  }
  if (templateName === templates.NIA_ASSOCIATE_DEGREE) {
    canvas = await createNIAAssociateCertificate(data, qrcode);
  }
  if (templateName === templates.NIA_BACHELOR_DEGREE) {
    canvas = await createNIABachelorCertificate(data, qrcode);
  }
  if (templateName === templates.NIA_MASTER_DEGREE) {
    canvas = await createNIAMasterCertificate(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_GDA_3RD_WORKSHOP_WORK_PERFORMANCE_CERTIFICATE
  ) {
    canvas = await createMptcGdaWorkshopStep32024Canvas(data, qrcode);
  }
  if (templateName === templates.BIU_BACHELOR_DEGREE) {
    canvas = await createBIUBachelorCertCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_GDA_3RD_WORKSHOP_WORK_PERFORMANCE_CERTIFICATE_PP
  ) {
    canvas = await createMptcWorkshopParticipatePPCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_GDA_3RD_WORKSHOP_WORK_PERFORMANCE_COORDINATOR_CERTIFICATE
  ) {
    canvas = await createMptcWorkshopParticipateCanvas(data, qrcode);
  }
  if (templateName === templates.DGC_DCA_WORKSHOP_CERTIFICATE) {
    canvas = await createDGCWorkshopCertificate(data, qrcode);
  }
  if (templateName === templates.BIU_DOCTOR_DEGREE) {
    canvas = await createBIUIpDoctorCertificate(data, qrcode);
  }
  if (templateName === templates.MPTC_AUDIT_PERFORMANCE_WORKSHOP_CERTIFICATE) {
    canvas = await createMptcGdaWorkshopWorkCertCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_EMBRACING_DIGITAL_TRANSFORMATION_APPRECIATION_CERTIFICATE
  ) {
    canvas = await createMptcCertificateOfAppreciation(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_EMBRACING_DIGITAL_TRANSFORMATION_RECOGNITION_CERTIFICATE
  ) {
    canvas = await createMptcCertificateRecognitionCanvas(data, qrcode);
  }
  if (templateName === templates.AUPP_BACHELOR_DEGREE_SUMMER_2024) {
    canvas = await createAUPPBachelorCertificateSummer2024(data, qrcode);
  }
  if (templateName === templates.MPTC_DSLP_TRAINING_OF_TRAINERS_CERTIFICATE) {
    canvas = await createMptcDslpTrainingCertificate(data, qrcode);
  }
  if (templateName === templates.RUA_BACHELOR_DEGREE) {
    canvas = await createRUABachelorCertificate(data, qrcode, preview);
  }
  if (templateName === templates.RUA_MASTER_DEGREE) {
    canvas = await createRUAMasterCertificate(data, qrcode, preview);
  }
  if (templateName === templates.RUA_ASSOCIATE_DEGREE) {
    canvas = await createRUAAssociateCertificate(data, qrcode, preview);
  }
  if (templateName === templates.RUA_PHD_DEGREE) {
    canvas = await createRUAPHDCertificate(data, qrcode, preview);
  }
  if (templateName === templates.RUA_DOCTOR_DEGREE) {
    canvas = await createRUADoctorCertificate(data, qrcode, preview);
  }
  if (templateName === templates.SSFA_TEMPORARY_ART_CERTIFICATE) {
    canvas = await createCanvasSSFAProvisionalCertificateArtDegree(
      data,
      qrcode,
    );
  }
  if (templateName === templates.SSFA_TEMPORARY_BACCALUARATE_CERTIFICATE) {
    canvas = await createCanvasSSFATemporaryCertificateArtDegree(data, qrcode);
  }
  if (
    templateName ===
    templates.CADT_EMBRACING_DIGITAL_TRANSFORMATION_APPRECIATION_CERTIFICATE
  ) {
    canvas = await createCadtCertificateOfAppreciation(data, qrcode);
  }
  if (
    templateName ===
    templates.CADT_EMBRACING_DIGITAL_TRANSFORMATION_RECOGNITION_CERTIFICATE
  ) {
    canvas = await createCadtCertificateRecognition(data, qrcode);
  }
  if (templateName === templates.MFAIC_KHMER_IDENTITY_CARD) {
    canvas = await createMFAICKhmerIdentifyCard(data, qrcode);
  }
  if (
    templateName === templates.MPTC_GOVTECH_CONFERENCE_APPRECIATION_CERTIFICATE
  ) {
    canvas = await createDGCGovTeachCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_AI_FORUM_APPRECIATION_CERTIFICATE) {
    canvas = await createMptcAIForum2024Cert(data, qrcode);
  }
  if (templateName === templates.MPTC_CDA_APPRECIATION_CERTIFICATE) {
    canvas = await createMPTCCdeCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.RUPP_MASTER_DEGREE) {
    canvas = await createRUPPMasterDegreeCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_INTERNSHIP_COMPLETION_CERTIFICATE) {
    canvas = await createMPTCITCInternComplationCanvas(data, qrcode);
  }
  if (templateName === templates.MOT_OFFICIAL_ID_CARD) {
    canvas = await createMoTOfficialCard(data, qrcode, preview);
  }
  if (
    templateName ===
    templates.MPTC_CYBER_SECURITY_AWARENESS_MONTH_APPRECIATION_CERTIFICATE
  ) {
    canvas = await createMptcCamSpeakerCertificate(data, qrcode);
  }
  if (templateName === templates.MOINFO_GDINB_PRESS_CARD_CAMDX) {
    canvas = await createMoINFOPressCardCamdx(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_LEADERSHIP_INNOVATION_APPRECIATION_CERTIFICATE
  ) {
    canvas = await createMptcGdaWorkshopLeadershipInnovationCertCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.SSFA_BACCALAUREATE_ARTS_DEGREE) {
    canvas = await createSsfaBaccalaureateCertificate(data, qrcode);
  }
  if (templateName === templates.BIU_MASTER_DEGREE) {
    canvas = await createBIUMasterCertCanvas(data, qrcode);
  }
  if (
    templateName === templates.MPTC_TRC_RIA_TRAINING_RECOGNITION_CERTIFICATE
  ) {
    canvas = await createMptcRIATrainingRecognitionCanvas(data, qrcode);
  }
  if (
    templateName === templates.MPTC_TECHO_DIGITAL_SCHOLARSHIP_CERTIFICATE_2025
  ) {
    canvas = await createMPTCTeachoDigitalCert2025Canvas(data, qrcode);
  }
  if (templateName === templates.BIU_ASSOCIATE_DEGREE) {
    canvas = await createBIUAssociateCertCanvas(data, qrcode);
  }
  if (templateName === templates.PPCA_OWS_TOURISM_LICENSE_CERTIFICATE) {
    canvas = await createPPCATourismLicenseCertificate(data, qrcode, preview);
  }
  if (
    templateName ===
    templates.MPTC_CYBERSECURITY_TRAIN_THE_TRAINER_PROGRAM_RECOGNITION_CERTIFICATE
  ) {
    canvas = await createMptccybersecuritytrainerCanvas(data, qrcode);
  }
  if (templateName === templates.NIE_PHD_DEGREE) {
    canvas = await createNIEPhdCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.AUPP_MASTER_DEGREE_2025) {
    canvas = await createAUPPMasterCertificate2025(data, qrcode);
  }
  if (
    templateName ===
    templates.AUPP_ATC_INNOVATION_ECOSYSTEM_MENTOR_COMPLETION_CERTIFICATE
  ) {
    canvas = await createAUPPInnovationEcosystemMentorCompletionCertificate(
      data,
      qrcode,
    );
  }
  if (templateName === templates.RULE_MASTER_DEGREE) {
    canvas = await createRULEMasterCertificate(data, qrcode);
  }
  if (templateName === templates.MOINFO_BASIC_TECHNICAL_TRAINING_CERTIFICATE) {
    canvas = await createMinfoWritingNews2025Certificate(data, qrcode);
  }
  if (templateName === templates.MPTC_CNCC_ACHIEVEMENT_CERTIFICATE) {
    canvas = await createMptcIctCnccCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.CADT_CYBER_RESILIENCE_AND_SAFETY_CULTURE_CERTIFICATE
  ) {
    canvas = await createCADTCyberResilienceAndSafetyCultureCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.RUPP_PHD_DEGREE) {
    canvas = await createRUPPPhdDegreeCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_DIGITAL_ADOPTION_FOR_WORK_EFFICIENCY_RECOGNITION_CERTIFICATE
  ) {
    canvas = await createMPTCPromotingDigitalAdoptionCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.MPTC_NATIONAL_LETTER_WRITING_COMPETITION_RECOGNITION_CERTIFICATE
  ) {
    canvas = await createMptcWrtingCompetitionCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_DIGITAL_TECHNOLOGY_SKILLS_TRAINER_COMPLETION_CERTIFICATE
  ) {
    canvas = await createMPTCDigitalSkillTrainerCompletionCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.MOT_TOURIST_GUIDE_LICENSE_CARD) {
    canvas = await createMoTTouristGuideCard(data, qrcode, preview);
  }
  if (templateName === templates.MOT_CONTRACTUAL_STAFF_ID_CARD) {
    canvas = await createMoTContractualCard(data, qrcode, preview);
  }
  if (templateName === templates.DICHI_ELIX_COMPLETION_CERTIFICATE) {
    canvas = await createDichiAppreciationCertificateCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MOT_INTERPRETER_FROM_TOURIST_GUIDE_PERMISSION_CARD
  ) {
    canvas = await createMoTInterpreterCard(data, qrcode, preview);
  }
  if (templateName === templates.MPTC_DATA_DRIVEN_WORK_COMPLETION_CERTIFICATE) {
    canvas = await createMPTCDataDrivenWorkCompletionCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_DIGITAL_ADOPTION_FOR_WORK_EFFICIENCY_APPRECIATION_CERTIFICATE
  ) {
    canvas = await createMPTCDigitalAdoptionAppreciationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.KSIT_ASSOCIATE_CERTIFICATE) {
    canvas = await createKSITAssociateCertificate(data, qrcode);
  }
  if (templateName === templates.KSIT_BACHELOR_CERTIFICATE) {
    canvas = await createKSITBachelorCertificate(data, qrcode);
  }
  if (templateName === templates.SERC_DERIVATIVES_REPRESENTATIVE_LICENCE_CARD) {
    canvas = await createSERCDerivativesRepresentativeLicenseCardCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName === templates.SERC_CENTRAL_COUNTERPARTY_LICENCE_CERTIFICATE
  ) {
    canvas = await createSercCentralCounterpartyLicenceCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_IT_PROVIDER_SECURITIES_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercProviderAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.MPTC_ONLINE_SAFETY_FORUM_2025_CERTIFICATE) {
    canvas = await createMptcOnlineForum2025Canvas(data, qrcode);
  }
  if (templateName === templates.SERC_DERIVATIVES_BROKER_LICENCE_CERTIFICATE) {
    canvas = await createSercDerivativesBrokerLicenceCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.SERC_FINANCIAL_ADVISORY_LICENCE_CERTIFICATE) {
    canvas = await createSercFinancialAdvisoryLicenceCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.SERC_FUND_MANAGEMENT_LICENSE_CERTIFICATE) {
    canvas = await createSercFundManagementLicenceCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName === templates.SERC_DERIVATIVES_BROKER_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercDerivateBrokerAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_PARTICIPATION_FINANCIAL_TECHNOLOGY_REGULATORY_SANDBOX_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercParticipationAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_FUND_DISTRIBUTION_REDEMPTION_PAYMENT_COMPANY_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercFundDistributionAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_FINANCIAL_ADVISORY_COMPANY_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercFinancialAdvisoryAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_INVESTMENT_ADVISORY_COMPANY_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercInvestmentAdvisoryAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_FUND_TRUSTEE_COMPANY_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercFundTrusteeAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_GOVERNMENT_SECURITIES_DEALER_AUTHORIZATION_CERTIFICATE
  ) {
    canvas =
      await createSercGovernmentSecuritiesDealerAuthorizationCertificateCanvas(
        data,
        qrcode,
      );
  }
  if (
    templateName ===
    templates.SERC_SECURITIES_CLEARING_SETTLEMENT_SYSTEM_OPERATOR_AUTHORIZATION_CERTIFICATE
  ) {
    canvas =
      await createSercSecuritiesClearingSettlementAuthorizationCertificateCanvas(
        data,
        qrcode,
      );
  }
  if (
    templateName ===
    templates.SERC_SECURITIES_CUSTODIAN_OPERATOR_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercSecuritiesCustodianAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_SECURITIES_DISTRIBUTION_COMPANY_AUTHORIZATION_CERTIFICATE
  ) {
    canvas =
      await createSercSecuritiesDistributionAuthorizationCertificateCanvas(
        data,
        qrcode,
      );
  }
  if (
    templateName ===
    templates.SERC_SECURITIES_MARKET_OPERATOR_AUTHORIZATION_CERTIFICATE
  ) {
    canvas = await createSercSecuritiesMarketAuthorizationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.SRU_MASTER_DEGREE) {
    canvas = await createSRUMasterCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.SRU_ASSOCIATE_DEGREE) {
    canvas = await createSRUAssociateCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.SRU_BACHELOR_DEGREE) {
    canvas = await createSRUBachelorCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.KCIT_BACHELOR_DEGREE) {
    canvas = await createKCITBachelorCertificate(data, qrcode);
  }
  if (templateName === templates.KCIT_ASSOCIATE_DEGREE) {
    canvas = await createKCITAssociateCertificate(data, qrcode);
  }
  if (templateName === templates.MOCAR_DHARMA_DISCIPLINE_CERTIFICATE) {
    canvas = await createMoCaRPharmaDisciplineCertficate(data, qrcode);
  }
  if (
    templateName === templates.MOCAR_PRIMARY_SCHOOL_BUDDHIST_STUDY_CERTIFICATE
  ) {
    canvas = await createMoCaRPrimarySchoolBuddhistStudyCertificte(
      data,
      qrcode,
    );
  }
  if (templateName === templates.NMU_ASSOCIATE_DEGREE) {
    canvas = await createNMUAssociateCertificate(data, qrcode);
  }
  if (templateName === templates.NMU_BACHELOR_DEGREE) {
    canvas = await createNMUBachelorCertificate(data, qrcode);
  }
  if (templateName === templates.NMU_MASTER_DEGREE) {
    canvas = await createNMUMasterCertificate(data, qrcode);
  }
  if (
    templateName ===
    templates.SERC_IT_PROVIDER_REPRESENTATIVE_AUTHORIZATION_CARD
  ) {
    canvas =
      await createSERCITProviderRepresentativeAuthorizationLicenceCardCanvas(
        data,
        qrcode,
      );
  }
  if (
    templateName ===
    templates.MOCAR_HIGH_SCHOOL_BUDDHIST_STUDY_TEMPORARY_CERTIFICATE
  ) {
    canvas = await createMOCARHighschoolBuddhistStudyTemporaryCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.MOCAR_HIGH_SCHOOL_BUDDHIST_STUDY_CERTIFICATE) {
    canvas = await createMOCARHighschoolBuddhistStudyCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName === templates.SERC_CROWNFUNDING_REPRESENTATIVE_LICENCE_CARD
  ) {
    canvas = await createSERCCrownfundingRepresentativeLicenseCardCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.SERC_FINANCIAL_ADVISORY_REPRESENTATIVE_LICENCE_CARD
  ) {
    canvas = await createSERCFinancialAdvisoryRepresentativeLicenseCardCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName === templates.SERC_FUND_MANAGEMENT_REPRESENTATIVE_LICENSE_CARD
  ) {
    canvas = await createSERCFundManagementRepresentativeLicenseCardCanvas(
      data,
      qrcode,
    );
  }
  if (
    templateName === templates.SERC_FUND_SELLLING_REPRESENTATIVE_LICENCE_CARD
  ) {
    canvas = await createSERCFundSellingRepresentativeLicenseCardCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.SERC_SECURITIES_REPRESENTATIVE_LICENCE_CARD) {
    canvas = await createSERCSecuritiesRepresentativeLicenseCardCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.MOCAR_PRIMARY_SCHOOL_BUDDHIST_STUDY_DEGREE) {
    canvas = await createMoCaRLowerSecondarySchoolBuddhistStudyDegree(
      data,
      qrcode,
    );
  }
  if (
    templateName === templates.MOCAR_SECONDARY_SCHOOL_BUDDHIST_STUDY_CERTIFICATE
  ) {
    canvas = await createMoCaRUpperSecondarySchoolBuddhistStudyDegree(
      data,
      qrcode,
    );
  }
  if (
    templateName ===
    templates.TRC_RADIO_TELECOM_EQUIPMENT_RECOGNITION_CERTIFICATE
  ) {
    canvas = await createTRCImportAgentRecognitionCertificate(data, qrcode);
  }
  if (templateName === templates.AUPP_MASTER_CERTIFICATE_2022) {
    canvas = await createAUPPMasterCertificate2022(data, qrcode);
  }
  if (templateName === templates.AUPP_MASTER_DEGREE_SUMMER_2025) {
    canvas = await createAUPPMasterCertificateSummer2025(data, qrcode);
  }
  if (templateName === templates.AUPP_BACHELOR_DEGREE_SUMMER_2025) {
    canvas = await createAUPPBachelorCertificateSummer2025(data, qrcode);
  }
  if (templateName === templates.MPTC_ICT_LMC_CERTIFICATE) {
    canvas = await createMptcLmcCertificateCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_PERSONAL_DATA_PROTECTION_APPRECIATION_CERTIFICATE
  ) {
    canvas =
      await createMptcPersonalDataProtectionAppreciationCertificateCanvas(
        data,
        qrcode,
      );
  }
  if (templateName === templates.NIE_INSPECTOR_DEGREE) {
    canvas = await createNIEInspectorCertificate(data, qrcode);
  }
  if (templateName === templates.NIE_FRENCH_MASTER_DEGREE) {
    canvas = await createNIEMasterFrenchCertificate(data, qrcode);
  }
  if (templateName === templates.NIE_MASTER_DEGREE) {
    canvas = await createNIEMasterCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_CDA_2025_APPRECIATION_CERTIFICATE) {
    canvas = await createMPTCCda2025CertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_CDA_2025_AWARD_CERTIFICATE) {
    canvas = await createMPTCCda2025WinnerCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.CAMTECH_BACHELOR_DEGREE) {
    canvas = await createCamTechBachelorCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.CAMTECH_MASTER_DEGREE) {
    canvas = await createCamTechMasterCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.CAMTECH_PHD_DEGREE) {
    canvas = await createCamTechPHDCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.CAMTECH_TRAINING_CERTIFICATE) {
    canvas = await createCamTechTrainingCertificateCanvas(data, qrcode);
  }
  if (
    templateName === templates.MPTC_DGF_2025_VOLUNTEER_APPRECIATION_CERTIFICATE
  ) {
    canvas = await createMPTCDGFVolunteerAppreciationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.MOINFO_GDINB_PRESS_CARD_2026) {
    canvas = await createMoINFOPressCardV2(data, qrcode);
  }
  if (templateName === templates.MPTC_DSLP_RECOGNITION_CERTIFICATE) {
    canvas = await createMptcTrainingOfTrainerCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_PDP_WORKSHOP_CERTIFICATE) {
    canvas = await createMptcPDPRecognitionCanvas(data, qrcode);
  }
  if (templateName === templates.CPFAC_ANNOUNCEMENT) {
    canvas = await createCpfacPermitRegister(data, qrcode);
  }
  if (templateName === templates.CPFAC_PRODUCT_SPECIFICATION_CERTIFICATE) {
    canvas = await createCpfacPermitRegister(data, qrcode);
  }
  if (templateName === templates.AUPP_BACHELOR_DEGREE_FALL_2025) {
    canvas = await createAuppBachelorCertificateFall2025Canvas(data, qrcode);
  }
  if (templateName === templates.AUPP_MASTER_DEGREE_FALL_2025) {
    canvas = await createAuppMasterCertificateFall2025Canvas(data, qrcode);
  }
  if (templateName === templates.CPFCA_PRODUCT_SPECIFICATION_CERTIFICATE) {
    canvas = await createCpfacProductSpecificationCertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.MPTC_CYBERSECURITY_WORKSHOP_2026_CERTIFICATE) {
    canvas = await createMPTCCybersecurityWorkshop2026CertificateCanvas(
      data,
      qrcode,
    );
  }
  if (templateName === templates.MOT_CHINA_ACCREDITED_CARD) {
    canvas = await createMoTChinaAccreditedCard(data, qrcode, preview);
  }
  if (templateName === templates.MPTC_TRAINING_BDS_RECOGNITION_CERTIFICATE) {
    canvas = await createMPTCTrainingBDSCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MOT_CHINA_ACCREDITED_CERTIFICATE) {
    canvas = await createMOTChinaAccreditedCertificateCanvas(
      data,
      qrcode,
      preview,
    );
  }
  if (templateName === templates.AUPP_NEW_CERTIFICATE) {
    canvas = await createAUPPNewCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_UNIDIR_COMPLETION_CERTIFICATE) {
    canvas = await createMptcCompletionUnidirCertificate(data, qrcode);
  }
  if (templateName === templates.SSFA_DIPLOMA_DEGREE) {
    canvas = await createSSFADiplomaCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_INTERNSHIP_CERTIFICATE_2026) {
    canvas = await createMPTCInternship2026CertificateCanvas(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_NATIONAL_LETTER_WRITING_COMPETITION_RECOGNITION_CERTIFICATE_2026
  ) {
    canvas = await createMptcWritingCompetition2026Canvas(data, qrcode);
  }
  if (templateName === templates.MOINSPECTION_OFFICIAL_ID_CARD) {
    canvas = await createMoInspectionOfficialIDFrontCard(data, qrcode);
  }
  if (templateName === templates.MOINFO_CONTRACTUAL_STAFF_CARD) {
    canvas = await createMoINFOConstractStaffCardFront(data, qrcode);
  }
  if (templateName === templates.AUPP_POSTGRADUATE_CERTIFICATE) {
    canvas = await createAUPPPostgraduateCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_ADSEPSD_COMPLETION_CERTIFICATE) {
    canvas = await createMptcAdvanceDigitalSkillsCertificate(data, qrcode);
  }
  if (
    templateName ===
    templates.MPTC_NATIONAL_LETTER_WRITING_APPRECIATION_CERTIFICATE_2026
  ) {
    canvas = await createMptcWrtingCompetitionAppreciationCanvas(data, qrcode);
  }
  // render to tiff
  if (responseType === "tiff") {
    let _canvas = canvas;

    if ("canvas" in _canvas) {
      _canvas = canvas.canvas;
    }

    const rawBuffer = _canvas.data();
    const tiffBuffer = utif.encodeImage(
      rawBuffer,
      _canvas.width,
      _canvas.height,
    );

    response.setHeader(
      "Content-disposition",
      "attachment; filename=certificate.tiff",
    );

    response.setHeader("Content-Type", "image/tiff");
    response.send(Buffer.from(tiffBuffer));
  }

  // Handle MPTC_GDA_CARD (2-page template)
  if (templateName === templates.MPTC_GDA_CARD) {
    const front = await createMPTCGDAFrontCard(data);
    const back = await createMPTCGDABackCard(data, qrcode);
    canvas = { canvas: front, page2: back };
  }
  if (templateName === templates.FSA_OFFICIAL_ID_CARD) {
    const front = await createFSAOfficialIDCardFront(data, qrcode, preview);
    const back = await createFSAOfficialIDCardBack();
    canvas = { canvas: front, page2: back };
  }
  if (templateName === templates.MPTC_CYBER_INCIDENT_RESPONSE_CERTIFICATE) {
    canvas = await createMPTCCyberIncidentResponseCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.PPCA_OWS_HEALTH_HYGIENE_CERTIFICATE) {
    canvas = await createPPCAHealthHygieneCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.PPCA_OWS_CHAMKARMORN_TOURISM_LICENSE_CERTIFICATE) {
    canvas = await createPPCAOWSChamkarmornTourismLicenseCertificateCanvas(data, qrcode);
  }
  if (templateName === templates.MPTC_ICT_LANCANG_MEKONG_REGIONAL_CYBERSECURITY_FORUM_CERTIFICATE) {
    canvas = await createMPTCICTLancangRegionalCybersecurityCertificateCanvas(data, qrcode);
  }
  let imageBuffer;
  let page2Buffer = null;

  // Handle multi-page templates
  if (canvas.canvas && canvas.page2) {
    imageBuffer = canvas.canvas.toBuffer("image/jpeg", 100);
    page2Buffer = canvas.page2.toBuffer("image/jpeg", 100);
    canvas = canvas.canvas;
  } else if (templateName === templates.RUFA_BACHELOR_DEGREE) {
    imageBuffer = canvas.canvas.toBuffer("image/jpeg", 100);
  } else {
    imageBuffer = canvas.toBuffer("image/jpeg", 100);
  }

  // if (templateName === templates.RUFA_STUDENT_ID_CARD) {
  //   const newBuffer = await sharp(imageBuffer)
  //     .resize({ width: parseInt(637.795), fit: "contain" })
  //     .png({ quality: 100 })
  //     .toBuffer({ resolveWithObject: true });
  //   imageBuffer = newBuffer.data;
  // }

  if (responseType === "image") {
    response.setHeader(
      "Content-disposition",
      "attachment; filename=certificate.png",
    );
    response.setHeader("Content-Type", "image/png");
    response.send(imageBuffer);
    return;
  }

  response.setHeader(
    "Content-disposition",
    "attachment; filename=certificate.pdf",
  );
  response.setHeader("Content-Type", "application/pdf");
  let pdfSize =
    data.$template.name === "CADT_DSE_ERA_CERTIFICATE" ||
      data.$template.name === "MPTC_DG_UNDESA_WORKSHOP_CERTIFICATE" ||
      data.$template.name === "MPTC_DG_OECD_WORKSHOP_CERTIFICATE"
      ? [841.89, 595.28]
      : [595.28, 841.89];

  if (data.$template.name === "AUPP_BACHELOR_CERTIFICATE") {
    pdfSize = [963.78, 793.7];
  }

  if (data.$template.name === "MoEYS_STUDENT_CARD_KH") {
    pdfSize = [627.0, 1019.0];
  }

  if (
    data.$template.name === "NUM_BACHELOR_CERTIFICATE" ||
    data.$template.name === "NUM_MASTER_CERTIFICATE" ||
    data.$template.name === "NUM_PHD_CERTIFICATE"
  ) {
    pdfSize = [4096.0, 2827.0];
  }
  if (data.$template.name === "CADT_BACHELOR_DEGREE") {
    pdfSize = [3354, 2332];
  }
  if (data.$template.name === "KCIT_TEMPORARY_ASSOCIATE_CERTIFICATE") {
    pdfSize = [2481, 3511];
  }
  if (templateName === templates.RUFA_BACHELOR_DEGREE) {
    pdfSize = [3509, 2481];
  }

  if (data.$template.name === "SRU_TEMPORARY_BACHELOR_CERTIFICATE") {
    pdfSize = [595.32, 841.92];
  }
  if (data.$template.name === "SRU_TEMPORARY_ASSOCIATE_CERTIFICATE") {
    pdfSize = [595.32, 841.92];
  }
  if (data.$template.name === templates.RUFA_STUDENT_ID_CARD) {
    pdfSize = [637.795, 1011.023];
  }
  if (data.$template.name === templates.KSIT_BACHELOR_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.KSIT_ASSOCIATE_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.RULE_BACHELOR_DEGREE) {
    pdfSize = [2993, 2117];
  }
  if (data.$template.name === templates.MOC_INCORPORATION_CERTIFICATE) {
    pdfSize = [1950, 1380];
  }
  if (data.$template.name === "CADT_BACHELOR_DEGREE") {
    pdfSize = [3354, 2332];
  }
  if (data.$template.name === "KCIT_TEMPORARY_BACHELOR_CERTIFICATE") {
    pdfSize = [2481, 3511];
  }
  if (data.$template.name === "RUPP_BACHELOR_DEGREE") {
    pdfSize = [842.04, 595.32];
  }
  if (data.$template.name === "RUPP_FRANCE_BACHELOR_DEGREE") {
    pdfSize = [842.04, 595.32];
  }

  if (
    data.$template.name === "NUM_BACHELOR_CERTIFICATE" ||
    data.$template.name === "NUM_MASTER_CERTIFICATE" ||
    data.$template.name === "NUM_PHD_CERTIFICATE"
  ) {
    pdfSize = [4096.0, 2827.0];
  }
  if (data.$template.name === "CADT_BACHELOR_DEGREE") {
    pdfSize = [3354, 2332];
  }
  if (data.$template.name === "KCIT_TEMPORARY_BACHELOR_CERTIFICATE") {
    pdfSize = [2481, 3511];
  }
  if (data.$template.name === "KCIT_TEMPORARY_ASSOCIATE_CERTIFICATE") {
    pdfSize = [2481, 3511];
  }

  if (data.$template.name === templates.AUPP_MASTER_CERTIFICATE_2024) {
    pdfSize = [963.78, 793.7];
  }
  if (data.$template.name === templates.KCNIA_BACHELOR_DEGREE) {
    pdfSize = [3508, 2479];
  }
  if (data.$template.name === templates.KCNIA_ASSOCIATE_DEGREE) {
    pdfSize = [3508, 2479];
  }
  if (templateName === templates.MOINFO_TRAINING_CERTIFICATE_2024) {
    pdfSize = [841.89, 595.28];
  }
  if (
    data.$template.name ===
    templates.MOINSPECTION_INSPECTION_TRAINING_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.NIA_ASSOCIATE_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.NIA_BACHELOR_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.NIA_MASTER_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.BIU_BACHELOR_DEGREE) {
    pdfSize = [7016, 9923];
  }
  if (
    data.$template.name ===
    templates.MPTC_GDA_3RD_WORKSHOP_WORK_PERFORMANCE_CERTIFICATE_PP
  ) {
    pdfSize = [2479, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_GDA_3RD_WORKSHOP_WORK_PERFORMANCE_COORDINATOR_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (data.$template.name === templates.DGC_DCA_WORKSHOP_CERTIFICATE) {
    pdfSize = [3508, 2479];
  }
  if (data.$template.name === templates.BIU_DOCTOR_DEGREE) {
    pdfSize = [7016, 9923];
  }
  if (
    data.$template.name ===
    templates.MPTC_AUDIT_PERFORMANCE_WORKSHOP_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_EMBRACING_DIGITAL_TRANSFORMATION_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_EMBRACING_DIGITAL_TRANSFORMATION_RECOGNITION_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (data.$template.name === templates.AUPP_BACHELOR_DEGREE_SUMMER_2024) {
    pdfSize = [963.78, 793.7];
  }
  if (
    data.$template.name === templates.MPTC_DSLP_TRAINING_OF_TRAINERS_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (data.$template.name === templates.RUA_BACHELOR_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.RUA_MASTER_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.RUA_ASSOCIATE_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.RUA_PHD_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.RUA_DOCTOR_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.SSFA_TEMPORARY_ART_CERTIFICATE) {
    pdfSize = [2480, 3506];
  }
  if (
    data.$template.name === templates.SSFA_TEMPORARY_BACCALUARATE_CERTIFICATE
  ) {
    pdfSize = [2480, 3506];
  }
  if (
    data.$template.name ===
    templates.CADT_EMBRACING_DIGITAL_TRANSFORMATION_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [2481, 3508];
  }
  if (
    data.$template.name ===
    templates.CADT_EMBRACING_DIGITAL_TRANSFORMATION_RECOGNITION_CERTIFICATE
  ) {
    pdfSize = [2481, 3508];
  }
  if (data.$template.name === templates.MFAIC_KHMER_IDENTITY_CARD) {
    pdfSize = [2480, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_GOVTECH_CONFERENCE_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (
    data.$template.name === templates.MPTC_AI_FORUM_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [3508, 2481];
  }
  if (data.$template.name === templates.MPTC_CDA_APPRECIATION_CERTIFICATE) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === "RUPP_MASTER_DEGREE") {
    pdfSize = [842.04, 595.32];
  }
  if (data.$template.name === "MPTC_INTERNSHIP_COMPLETION_CERTIFICATE") {
    pdfSize = [3000, 4146];
  }
  if (data.$template.name === templates.MOT_OFFICIAL_ID_CARD) {
    pdfSize = [2200, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_CYBER_SECURITY_AWARENESS_MONTH_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.MOINFO_GDINB_PRESS_CARD_CAMDX) {
    pdfSize = [3368, 2095];
  }
  if (
    data.$template.name ===
    templates.MPTC_LEADERSHIP_INNOVATION_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.SSFA_BACCALAUREATE_ARTS_DEGREE) {
    // pdfSize = [2993, 2117];
    pdfSize = [841, 595];
  }
  if (data.$template.name === templates.BIU_MASTER_DEGREE) {
    pdfSize = [7016, 9923];
  }
  if (
    data.$template.name ===
    templates.MPTC_TRC_RIA_TRAINING_RECOGNITION_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_TECHO_DIGITAL_SCHOLARSHIP_CERTIFICATE_2025
  ) {
    pdfSize = [2479, 3508];
  }
  if (data.$template.name === templates.BIU_ASSOCIATE_DEGREE) {
    pdfSize = [7016, 9923];
  }
  if (data.$template.name === templates.PPCA_OWS_TOURISM_LICENSE_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.MPTC_CYBERSECURITY_TRAIN_THE_TRAINER_PROGRAM_RECOGNITION_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.AUPP_MASTER_DEGREE_2025) {
    pdfSize = [963.78, 793.7];
  }
  if (data.$template.name === templates.NIE_PHD_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.NIE_PHD_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.AUPP_ATC_INNOVATION_ECOSYSTEM_MENTOR_COMPLETION_CERTIFICATE
  ) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.RULE_MASTER_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.MOINFO_BASIC_TECHNICAL_TRAINING_CERTIFICATE
  ) {
    pdfSize = [3508, 2497];
  }

  if (data.$template.name === templates.MPTC_CNCC_ACHIEVEMENT_CERTIFICATE) {
    pdfSize = [2480, 3508];
  }
  if (
    data.$template.name ===
    templates.CADT_CYBER_RESILIENCE_AND_SAFETY_CULTURE_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === "RUPP_PHD_DEGREE") {
    pdfSize = [842.04, 595.32];
  }
  if (
    data.$template.name ===
    templates.MPTC_DIGITAL_ADOPTION_FOR_WORK_EFFICIENCY_RECOGNITION_CERTIFICATE
  ) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.MPTC_NATIONAL_LETTER_WRITING_COMPETITION_RECOGNITION_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_DIGITAL_TECHNOLOGY_SKILLS_TRAINER_COMPLETION_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (data.$template.name === templates.MOT_TOURIST_GUIDE_LICENSE_CARD) {
    pdfSize = [638, 2034];
  }
  if (data.$template.name === templates.MOT_CONTRACTUAL_STAFF_ID_CARD) {
    pdfSize = [2200, 3508];
  }

  if (
    data.$template.name ===
    templates.MPTC_DIGITAL_TECHNOLOGY_SKILLS_TRAINER_COMPLETION_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (data.$template.name === templates.DICHI_ELIX_COMPLETION_CERTIFICATE) {
    pdfSize = [3501, 2481];
  }
  if (
    data.$template.name ===
    templates.MOT_INTERPRETER_FROM_TOURIST_GUIDE_PERMISSION_CARD
  ) {
    pdfSize = [638, 2051];
  }
  if (
    data.$template.name ===
    templates.MPTC_DATA_DRIVEN_WORK_COMPLETION_CERTIFICATE
  ) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.MPTC_DIGITAL_ADOPTION_FOR_WORK_EFFICIENCY_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.KSIT_ASSOCIATE_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.KSIT_BACHELOR_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.SERC_IT_PROVIDER_SECURITIES_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_DERIVATIVES_BROKER_LICENCE_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_CENTRAL_COUNTERPARTY_LICENCE_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_FINANCIAL_ADVISORY_LICENCE_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_DERIVATIVES_BROKER_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_FUND_MANAGEMENT_LICENSE_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_PARTICIPATION_FINANCIAL_TECHNOLOGY_REGULATORY_SANDBOX_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_FUND_DISTRIBUTION_REDEMPTION_PAYMENT_COMPANY_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_FINANCIAL_ADVISORY_COMPANY_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_INVESTMENT_ADVISORY_COMPANY_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_FUND_TRUSTEE_COMPANY_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_GOVERNMENT_SECURITIES_DEALER_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_SECURITIES_CLEARING_SETTLEMENT_SYSTEM_OPERATOR_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_SECURITIES_CUSTODIAN_OPERATOR_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_SECURITIES_DISTRIBUTION_COMPANY_AUTHORIZATION_CERTIFICATE ||
    data.$template.name ===
    templates.SERC_SECURITIES_MARKET_OPERATOR_AUTHORIZATION_CERTIFICATE
  ) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.SERC_DERIVATIVES_REPRESENTATIVE_LICENCE_CARD ||
    data.$template.name ===
    templates.SERC_CROWNFUNDING_REPRESENTATIVE_LICENCE_CARD ||
    data.$template.name ===
    templates.SERC_FINANCIAL_ADVISORY_REPRESENTATIVE_LICENCE_CARD ||
    data.$template.name ===
    templates.SERC_FUND_MANAGEMENT_REPRESENTATIVE_LICENSE_CARD ||
    data.$template.name ===
    templates.SERC_FUND_SELLLING_REPRESENTATIVE_LICENCE_CARD ||
    data.$template.name ===
    templates.SERC_SECURITIES_REPRESENTATIVE_LICENCE_CARD ||
    data.$template.name ===
    templates.SERC_IT_PROVIDER_REPRESENTATIVE_AUTHORIZATION_CARD
  ) {
    pdfSize = [1500, 4500];
  }
  if (
    data.$template.name === templates.MPTC_ONLINE_SAFETY_FORUM_2025_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.SRU_MASTER_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.SRU_ASSOCIATE_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.SRU_BACHELOR_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.KCIT_BACHELOR_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.KCIT_ASSOCIATE_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.KCIT_BACHELOR_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.MOCAR_DHARMA_DISCIPLINE_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.MOCAR_PRIMARY_SCHOOL_BUDDHIST_STUDY_CERTIFICATE
  ) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.MOCAR_HIGH_SCHOOL_BUDDHIST_STUDY_TEMPORARY_CERTIFICATE
  ) {
    pdfSize = [2481, 3508];
  }
  if (
    data.$template.name ===
    templates.MOCAR_HIGH_SCHOOL_BUDDHIST_STUDY_CERTIFICATE
  ) {
    pdfSize = [2481, 3508];
  }
  if (data.$template.name === templates.NMU_ASSOCIATE_DEGREE) {
    pdfSize = [3508, 2481];
  }
  if (data.$template.name === templates.NMU_BACHELOR_DEGREE) {
    pdfSize = [3508, 2481];
  }
  if (data.$template.name === templates.NMU_MASTER_DEGREE) {
    pdfSize = [3508, 2481];
  }
  if (
    data.$template.name === templates.MOCAR_PRIMARY_SCHOOL_BUDDHIST_STUDY_DEGREE
  ) {
    pdfSize = [3508, 2481];
  }
  if (
    data.$template.name ===
    templates.MOCAR_SECONDARY_SCHOOL_BUDDHIST_STUDY_CERTIFICATE
  ) {
    pdfSize = [3508, 2481];
  }
  if (
    data.$template.name ===
    templates.TRC_RADIO_TELECOM_EQUIPMENT_RECOGNITION_CERTIFICATE
  ) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.AUPP_MASTER_CERTIFICATE_2022) {
    pdfSize = [963.78, 793.7];
  }
  if (data.$template.name === templates.AUPP_MASTER_DEGREE_SUMMER_2025) {
    pdfSize = [963.78, 793.7];
  }
  if (data.$template.name === templates.AUPP_BACHELOR_DEGREE_SUMMER_2025) {
    pdfSize = [963.78, 793.7];
  }
  if (data.$template.name === templates.MPTC_ICT_LMC_CERTIFICATE) {
    pdfSize = [2481, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_PERSONAL_DATA_PROTECTION_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [3508, 2479];
  }
  if (templateName === templates.MOINFO_GDINB_PRESS_CARD_2026) {
    pdfSize = [2095, 2857];
  }
  if (data.$template.name === templates.NIE_INSPECTOR_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.NIE_FRENCH_MASTER_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.NIE_MASTER_DEGREE) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name === templates.MPTC_CDA_2025_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [2481, 3508];
  }
  if (data.$template.name === templates.MPTC_CDA_2025_AWARD_CERTIFICATE) {
    pdfSize = [2481, 3508];
  }
  if (data.$template.name === templates.CAMTECH_BACHELOR_DEGREE) {
    pdfSize = [2481, 3508];
  }
  if (data.$template.name === templates.CAMTECH_MASTER_DEGREE) {
    pdfSize = [2481, 3508];
  }
  if (data.$template.name === templates.CAMTECH_PHD_DEGREE) {
    pdfSize = [2481, 3508];
  }
  if (data.$template.name === templates.CAMTECH_TRAINING_CERTIFICATE) {
    pdfSize = [2481, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_DGF_2025_VOLUNTEER_APPRECIATION_CERTIFICATE
  ) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.MPTC_DSLP_RECOGNITION_CERTIFICATE) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.MPTC_PDP_WORKSHOP_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.CPFAC_ANNOUNCEMENT) {
    pdfSize = [2480, 3508];
  }
  if (
    data.$template.name === templates.CPFAC_PRODUCT_SPECIFICATION_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.AUPP_BACHELOR_DEGREE_FALL_2025) {
    pdfSize = [3805, 3134];
  }
  if (data.$template.name === templates.AUPP_MASTER_DEGREE_FALL_2025) {
    pdfSize = [3805, 3134];
  }
  if (
    data.$template.name === templates.CPFCA_PRODUCT_SPECIFICATION_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (
    data.$template.name ===
    templates.MPTC_CYBERSECURITY_WORKSHOP_2026_CERTIFICATE
  ) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.MOT_CHINA_ACCREDITED_CARD) {
    pdfSize = [4961, 7016];
  }
  if (
    data.$template.name === templates.MPTC_TRAINING_BDS_RECOGNITION_CERTIFICATE
  ) {
    pdfSize = [2479, 3508];
  }
  if (data.$template.name === templates.MOT_CHINA_ACCREDITED_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.AUPP_NEW_CERTIFICATE) {
    pdfSize = [963.78, 793.7];
  }
  if (data.$template.name === templates.MPTC_INTERNSHIP_CERTIFICATE_2026) {
    pdfSize = [2480, 3508];
  }
  if (data.$template.name === templates.MPTC_UNIDIR_COMPLETION_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (data.$template.name === templates.MPTC_GDA_CARD) {
    pdfSize = [644, 1016];
  }
  if (data.$template.name === templates.SSFA_DIPLOMA_DEGREE) {
    pdfSize = [2480, 1747];
  }
  if (data.$template.name === templates.MOINSPECTION_OFFICIAL_ID_CARD) {
    pdfSize = [1533, 2334];
  }
  if (data.$template.name === templates.MOP_NSPS_PARTICIPATION_CERTIFICATE) {
    pdfSize = [2480, 3508];
  }
  if (templateName === templates.MOINFO_CONTRACTUAL_STAFF_CARD) {
    pdfSize = [3368, 2110];
  }
  if (templateName === templates.AUPP_POSTGRADUATE_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (
    data.$template.name ===
    templates.MPTC_NATIONAL_LETTER_WRITING_COMPETITION_RECOGNITION_CERTIFICATE_2026
  ) {
    pdfSize = [2480, 3508];
  }
  if (templateName === templates.MPTC_ADSEPSD_COMPLETION_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (templateName === templates.FSA_OFFICIAL_ID_CARD) {
    pdfSize = [3012, 1912];
  }
  if (templateName === templates.MPTC_CYBER_INCIDENT_RESPONSE_CERTIFICATE) {
    pdfSize = [3508, 2479];
  }
  if (templateName === templates.PPCA_OWS_HEALTH_HYGIENE_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (templateName === templates.PPCA_OWS_CHAMKARMORN_TOURISM_LICENSE_CERTIFICATE) {
    pdfSize = [3508, 2480];
  }
  if (templateName === templates.MPTC_ICT_LANCANG_MEKONG_REGIONAL_CYBERSECURITY_FORUM_CERTIFICATE) {
    pdfSize = [2480, 3508];
  }
  if (canvas == null) {
    response.status(400).json({ message: "The template is unsupported" });
    return;
  }

  const doc = new PDFDocument({
    margin: 0,
    size: pdfSize,
  });

  doc.image(imageBuffer, {
    align: "center",
    valign: "center",
    cover: [doc.page.width, doc.page.height],
  });

  if (page2Buffer) {
    doc.addPage().image(page2Buffer, {
      align: "center",
      valign: "center",
      cover: [doc.page.width, doc.page.height],
    });
  }

  doc.pipe(response);
  doc.end();
}
