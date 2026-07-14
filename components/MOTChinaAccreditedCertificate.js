import AutoScaleImage from './AutoScaleImage.js';

export default function MOTChinaAccreditedCertificate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={3508 / 2}
        height={2480 / 2}
        maxWidth={3508 / 2}
    />;
}