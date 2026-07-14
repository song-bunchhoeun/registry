import AutoScaleImage from './AutoScaleImage.js';

export default function NIPHCertificate(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={1754}
    height={1230}
    maxWidth={1754}
  />
}

