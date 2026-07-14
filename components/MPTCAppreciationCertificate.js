import AutoScaleImage from "./AutoScaleImage";

export default function MPTCAppreciationCertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={595}
      height={842}
      maxWidth={595}
    />
  );
}
