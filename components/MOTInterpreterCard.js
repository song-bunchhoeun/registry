import AutoScaleImage from './AutoScaleImage.js';

export default function MOTInterpreterCard(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={638}
        height={2051}
        maxWidth={638}
    />;
}