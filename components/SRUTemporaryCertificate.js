import AutoScaleImage from './AutoScaleImage.js';

export default function SRUTemporaryCertificate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={595.32}
        height={841.92}
        maxWidth={595.32}
    />;
}
