import AutoScaleImage from "./AutoScaleImage.js";

export default function CPFACAnnouncementCertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={2480 / 4}
      height={3508 / 4}
      maxWidth={2480 / 4}
    />
  );
}
