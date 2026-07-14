import AutoScaleImage from "./AutoScaleImage.js";

export default function RULEBachelorCertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={2993}
      height={2117}
      maxWidth={2993}
    />
  );
}
