import AutoScaleImage from './AutoScaleImage.js';

export default function KCITTemporaryCertificate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={1052}
        height={1476}
        maxWidth={1052}
    />;
}
