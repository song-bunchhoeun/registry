import AutoScaleImage from './AutoScaleImage.js';

export default function MoCaRPrimarySchoolBuddhistStudyCertificte(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={3508}
      height={2481}
      maxWidth={3508}
    />
  );
}
