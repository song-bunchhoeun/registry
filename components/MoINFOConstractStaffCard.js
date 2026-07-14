import AutoScaleImage from "./AutoScaleImage.js";

export default function MoINFOConstractStaffCard(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={3368 / 3}
      height={4220 / 3}
      maxWidth={3368 / 3}
    />
  );
}
