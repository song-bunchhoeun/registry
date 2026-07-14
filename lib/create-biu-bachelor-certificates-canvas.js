import _ from "lodash";
import { createBIUIpBachelorCertificate } from "./create-biu-ip-bachelor-certificate";
import { createBIUNpBachelorCertificate } from "./create-biu-np-bachelor-certificate";

export async function createBIUBachelorCertCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  let canvas;
  const program = _.get(certificateInfo, "certificate.program");

  program
    ? (canvas = createBIUIpBachelorCertificate(certificateInfo, qrcodeContent))
    : (canvas = createBIUNpBachelorCertificate(certificateInfo, qrcodeContent));

  return canvas;
}
