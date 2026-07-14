import AutoScaleImage from "./AutoScaleImage.js";

export default function PPCACertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={3508 / 3}
      height={2480 / 3}
      maxWidth={3508 /3}
    />
  );
}
