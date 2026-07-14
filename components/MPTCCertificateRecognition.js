import AutoScaleImage from './AutoScaleImage.js';

export default function MPTCCertificateRecognition(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        documentUrl={props.document.documentUrl}
        wrappedDocument={props.wrappedDocument}
        width={2481}
        height={3508}
        maxWidth={2481}
    />;
}
