import AutoScaleImage from './AutoScaleImage.js';

export default function MPTCDataDrivenCertificate(props) {
    return (
        <AutoScaleImage
            qrcode={props.qrcode}
            documentUrl={props.document.documentUrl}
            wrappedDocument={props.wrappedDocument}
            width={3508 / 3.5}
            maxWidth={3508 / 3.5}
        />
    );
}
