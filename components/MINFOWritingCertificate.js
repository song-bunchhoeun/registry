import AutoScaleImage from './AutoScaleImage.js';

export default function MINFOWritingCertificate(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={3508}
    height={2497}
    maxWidth={3508}
  />
}
