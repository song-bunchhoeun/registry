import AutoScaleImage from "./AutoScaleImage.js";

export default function AUPPCertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={3805 / 4}
      height={3134 / 4}
      maxWidth={3805 / 4}
    />
  );
}
