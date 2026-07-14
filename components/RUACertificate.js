import AutoScaleImage from "./AutoScaleImage.js";

export default function RUACertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={3508}
      height={2480}
      maxWidth={3508}
    />
  );
}
