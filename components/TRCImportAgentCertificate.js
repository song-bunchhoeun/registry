import AutoScaleImage from './AutoScaleImage.js';

export default function TRCImportAgentCertificate(props) {
  return (
    <AutoScaleImage
      qrcode={props.qrcode}
      documentUrl={props.document.documentUrl}
      wrappedDocument={props.wrappedDocument}
      width={3508/3}
      height={2637/3}
      maxWidth={3508/3}
    />
  )
}