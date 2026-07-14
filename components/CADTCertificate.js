import AutoScaleImage from './AutoScaleImage.js';

export default function CADTCertificate(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={3354}
    height={2332}
    maxWidth={1080}
  />
}


