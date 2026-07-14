import AutoScaleImage from "./AutoScaleImage.js";

export default function RUPPMasterDegree(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={842}
      height={595}
      maxWidth={842}
    />
  );
}
