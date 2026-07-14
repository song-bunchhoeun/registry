import AutoScaleImage from './AutoScaleImage.js';

export default function AUPPSummerCertificate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={3508}
        height={2756}
        maxWidth={3508}
    />;
}
