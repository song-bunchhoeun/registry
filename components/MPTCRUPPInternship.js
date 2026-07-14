import AutoScaleImage from './AutoScaleImage.js';

export default function MPTCRUPPInternship(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={2480 / 2}
    height={3510 / 2}
    maxWidth={2480 / 2}
  />;
}
