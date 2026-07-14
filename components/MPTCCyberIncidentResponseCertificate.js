import AutoScaleImage from './AutoScaleImage.js';

export default function MPTCCyberIncidentResponseCertificate(props) {
    return (
        <AutoScaleImage
            qrcode={props.qrcode}
            documentUrl={props.document.documentUrl}
            wrappedDocument={props.wrappedDocument}
            width={3508 / 3}
            maxWidth={2479 / 3}
        />
    );
}
