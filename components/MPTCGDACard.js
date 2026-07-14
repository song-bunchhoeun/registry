import AutoScaleImage from "./AutoScaleImage.js";

export default function MPTCGDACard(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={644 * 2}
      height={2032 * 2}
      maxWidth={644 * 2}
    />
  );
}
