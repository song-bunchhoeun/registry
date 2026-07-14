import AutoScaleImage from "./AutoScaleImage.js";

export default function BACIICertificate(props) {
  return <AutoScaleImage
    qrcode={props.qrcode}
    documentUrl={props.document.documentUrl}
    wrappedDocument={props.wrappedDocument}
    width={1440}
    height={2037}
    maxWidth={720}
  />
}
