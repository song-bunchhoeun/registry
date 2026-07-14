import AutoScaleImage from "./AutoScaleImage.js";

export default function AUPPInnovationEcosystemMentorCompletionCertificate(
  props
) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={3508 / 3}
      height={2480 / 3}
      maxWidth={3508 / 3}
    />
  );
}
