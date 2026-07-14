import _ from "lodash";
import { createBIUIpAssociateCertificate } from "./create-biu-ip-associate-certificate";
import { createBIUNpAssociateCertificate } from "./create-biu-np-associate-certificate";

export async function createBIUAssociateCertCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  let canvas;
  const program = _.get(certificateInfo, "certificate.program");

  program
    ? (canvas = createBIUIpAssociateCertificate(certificateInfo, qrcodeContent))
    : (canvas = createBIUNpAssociateCertificate(certificateInfo, qrcodeContent));

  return canvas;
}
