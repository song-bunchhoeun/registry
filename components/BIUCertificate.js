import AutoScaleImage from "./AutoScaleImage.js";

export default function BIUCertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={846}
      height={1191}
      maxWidth={2480}
    />
  );
}
