import AutoScaleImage from "./AutoScaleImage.js";

export default function NIACertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={1000}
      // height={750}
      maxWidth={3508}
    />
  );
}
