import _ from "lodash";
import { createRULEBachelorCert } from "./create-rule-bachelor-certificate";
import { createRULEBachelorCertSpecialize } from "./create-rule-bachelor-certificate-specialize";

export async function createRULEBachelorCertCanvas(
  certificateInfo = {},
  qrcodeContent
) {
  let canvas;
  const specializedIn = _.get(certificateInfo, "certificate.specialized");

  specializedIn
    ? (canvas = createRULEBachelorCertSpecialize(
        certificateInfo,
        qrcodeContent
      ))
    : (canvas = createRULEBachelorCert(certificateInfo, qrcodeContent));

  return canvas;
}
