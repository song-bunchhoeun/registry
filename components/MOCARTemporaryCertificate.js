import AutoScaleImage from './AutoScaleImage.js';

export default function MOCARTemporaryCertificate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        documentUrl={props.document.documentUrl}
        wrappedDocument={props.wrappedDocument}
        width={2481 / 3}
        height={3508 / 3}
        width={2481 / 3}
    />
}