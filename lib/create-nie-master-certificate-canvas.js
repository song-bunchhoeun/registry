import _ from "lodash";
import { createNIEMasterUpperSecondaryDegreeTwoLineCertificate } from "./create-nie-master-upper-secondary-degree-2-lines-certificate.js";
import { createNIEMasterUpperSecondaryCertificate } from "./create-nie-master-upper-secondary-certificate.js";
import { createNIEMasterThesisCertificate } from "./create-nie-master-thesis-certificate.js";

export async function createNIEMasterCertificateCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  let canvas;
  const type = _.get(certificateInfo, "certificate.type");
  const degree = _.get(certificateInfo, "certificate.degree");

  switch (type) {
    case "exam":
      switch (degree) {
        case "MASTER OF EDUCATION IN UPPER SECONDARY SCHOOL TEACHER":
          canvas = createNIEMasterUpperSecondaryDegreeTwoLineCertificate(
            certificateInfo,
            qrcodeContent
          );
          break;
        default:
          canvas = createNIEMasterUpperSecondaryCertificate(
            certificateInfo,
            qrcodeContent
          );
          break;
      }
      break;
    default:
      canvas = createNIEMasterThesisCertificate(certificateInfo, qrcodeContent);
      break;
  }

  return canvas;
}