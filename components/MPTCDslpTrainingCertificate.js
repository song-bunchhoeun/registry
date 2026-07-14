import AutoScaleImage from './AutoScaleImage.js';

export default function MPTCDslpTrainingCertificate(props) {
    return (
        <AutoScaleImage
            qrcode={props.qrcode}
            wrappedDocument={props.wrappedDocument}
            width={2479}
            height={3508}
            maxWidth={2479}
        />
    );
}
