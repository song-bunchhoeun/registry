import AutoScaleImage from "./AutoScaleImage.js";

export default function MOINSPECTIONOfficialIDCard(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={1533}
      height={2334}
      maxWidth={1533}
    />
  );
}
