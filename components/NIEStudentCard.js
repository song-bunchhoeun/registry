import AutoScaleImage from './AutoScaleImage.js';

export default function NIEStudentCard(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={2655}
    height={1620}
    maxWidth={2655}
  />
}

