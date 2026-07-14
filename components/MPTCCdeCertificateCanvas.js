import _ from "lodash";
import { createMPTCCDACertificateOfAppreciationSemiFinalJudge } from "../lib/create-mptc-cda-certificate-of-appreciation-semi-final-judge";
import { createMPTCCDACertificateOfAppreciationOrganizingCommitteeMember } from "../lib/create-mptc-cda-certificate-of-appreciation-organizing-committee-member";
import { createMPTCCDACertificateOfAppreciationMedia } from "../lib/create-mptc-cda-certificate-of-appreciation-media";
import { createMPTCCDACertificateOfAppreciationMediaPartner } from "../lib/create-mptc-cda-certificate-of-appreciation-media-partner";
import { createMPTCCDACertificateOfAppreciationFinalJudge } from "../lib/create-mptc-cda-certificate-of-appreciation-final-judge";
import { createMPTCCDACertificateOfAppreciationSponsor } from "../lib/create-mptc-cda-certificate-of-appreciation-sponsor";
import { createMPTCCDACertificateOfAppreciationAwardDigitalContent } from "../lib/create-mptc-cda-certificate-of-appreciation-award-digital-content";
import { createMPTCCDACertificateOfAppreciationBestWomen } from "../lib/create-mptc-cda-certificate-of-appreciation-award-best-women";
import { createMPTCCDACertificateOfAppreciationBestDigitalInclusion } from "../lib/create-mptc-cda-certificate-of-appreciation-award-digital-inclusion";
import { createMPTCCDACertificateOfAppreciationBestDigitalResearchAndInnovation } from "../lib/create-mptc-cda-certificate-of-appreciation-award-digital-research";
import { createMPTCCDACertificateOfAppreciationBestDigitalPrivateSector } from "../lib/create-mptc-cda-certificate-of-appreciation-award-digital-private-sector";
import { createMPTCCDACertificateOfAppreciationBestDigitalMinisterStartup } from "../lib/create-mptc-cda-certificate-of-appreciation-award-digital-minister-startup";

export async function createMPTCCdeCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  let canvas;
  const certificateType = _.get(certificateInfo, "certificate.type");
  const award = _.get(certificateInfo, "certificate.award");

  switch (certificateType) {
    case "semi_final_judge":
      canvas = createMPTCCDACertificateOfAppreciationSemiFinalJudge(
        certificateInfo,
        qrcodeContent
      );
      break;
    case "oc":
      canvas = createMPTCCDACertificateOfAppreciationOrganizingCommitteeMember(
        certificateInfo,
        qrcodeContent
      );
      break;
    case "media":
      canvas = createMPTCCDACertificateOfAppreciationMedia(
        certificateInfo,
        qrcodeContent
      );
      break;
    case "media_partner":
      canvas = createMPTCCDACertificateOfAppreciationMediaPartner(
        certificateInfo,
        qrcodeContent
      );
      break;
    case "final_judge":
      canvas = createMPTCCDACertificateOfAppreciationFinalJudge(
        certificateInfo,
        qrcodeContent
      );
      break;
    case "sponsor":
      canvas = createMPTCCDACertificateOfAppreciationSponsor(
        certificateInfo,
        qrcodeContent
      );
      break;
    case "award":
      if (award === "Best Women in Tech of the Year 2024") {
        canvas = createMPTCCDACertificateOfAppreciationBestWomen(
          certificateInfo,
          qrcodeContent
        );
      }
      if (award === "Best Digital Content of the Year 2024") {
        canvas = createMPTCCDACertificateOfAppreciationAwardDigitalContent(
          certificateInfo,
          qrcodeContent
        );
      }
      if (award === "Best Digital Inclusion of the Year 2024") {
        canvas = createMPTCCDACertificateOfAppreciationBestDigitalInclusion(
          certificateInfo,
          qrcodeContent
        );
      }
      if (award === "Best Digital Research & Innovation of the Year 2024") {
        canvas =
          createMPTCCDACertificateOfAppreciationBestDigitalResearchAndInnovation(
            certificateInfo,
            qrcodeContent
          );
      }
      if (award === "Best Private Sector of the Year 2024") {
        canvas = createMPTCCDACertificateOfAppreciationBestDigitalPrivateSector(
          certificateInfo,
          qrcodeContent
        );
      }
      if (award === "Best Minister Startup of the Year 2024") {
        canvas =
          createMPTCCDACertificateOfAppreciationBestDigitalMinisterStartup(
            certificateInfo,
            qrcodeContent
          );
      }
      break;
    default:
      "";
      break;
  }
  return canvas;
}
