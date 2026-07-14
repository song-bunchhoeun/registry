import AutoScaleImage from "./AutoScaleImage";

export default function MPTCCamCertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={2480}
      height={3508}
      maxWidth={2480}
    />
  );
}
