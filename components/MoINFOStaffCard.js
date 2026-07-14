import AutoScaleImage from './AutoScaleImage.js';

export default function MoINFOStaffCard(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={3368/3}
        height={2126/3}
        maxWidth={3368/3}
    />;
}