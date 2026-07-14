import _ from "lodash";
import { createBIUIpMasterCertificate } from "./create-biu-ip-master-certificate";
import { createBIUNpMasterCertificate } from "./create-biu-np-master-certificate";

export async function createBIUMasterCertCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  let canvas;
  const program = _.get(certificateInfo, "certificate.program");

  program
    ? (canvas = createBIUIpMasterCertificate(certificateInfo, qrcodeContent))
    : (canvas = createBIUNpMasterCertificate(certificateInfo, qrcodeContent));

  return canvas;
}
