import AutoScaleImage from './AutoScaleImage.js';

export default function MoINFOCardPressCard(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      wrappedDocument={props.wrappedDocument}
      width={2095 / 2}
      height={2857 / 2}
      maxWidth={2095 / 2}
    />
  );
}
