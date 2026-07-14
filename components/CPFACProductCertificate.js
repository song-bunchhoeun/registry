import AutoScaleImage from './AutoScaleImage.js';

export default function CPFACProductCertificate(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={2479 / 3}
    height={3508 / 3}
    maxWidth={2479 / 3}
  />
}


