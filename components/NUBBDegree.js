import AutoScaleImage from './AutoScaleImage.js';

export default function NUBBDegree(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={3480}
    height={2425}
    maxWidth={3480}
  />
}
