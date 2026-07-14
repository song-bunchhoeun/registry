import AutoScaleImage from './AutoScaleImage.js';

export default function RUFAStudentCard(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={5102}
        height={8126}
        maxWidth={5102}
  />
}

