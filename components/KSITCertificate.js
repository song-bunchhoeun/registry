import AutoScaleImage from "./AutoScaleImage.js";

export default function KSITCertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={3450 / 3}
      height={2419 / 3}
      maxWidth={3450 / 3}
    />
  );
}
