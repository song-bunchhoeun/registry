import AutoScaleImage from './AutoScaleImage.js';

export default function MoINFOCardCamdx(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={3368}
        height={2095}
        maxWidth={3368}
    />;
}
