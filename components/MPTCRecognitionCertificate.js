import AutoScaleImage from './AutoScaleImage.js';

export default function MPTCRecognitionCertificate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        documentUrl={props.document.documentUrl}
        wrappedDocument={props.wrappedDocument}
        width={595*4}
        height={842*4}
        maxWidth={595*4}
    />;
}
