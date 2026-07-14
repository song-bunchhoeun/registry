import AutoScaleImage from './AutoScaleImage.js';

export default function SSFAProvisionalCertificateArtDegree(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={2480/3}
      height={3506/3}
      maxWidth={2480/3}
    />
  )
}