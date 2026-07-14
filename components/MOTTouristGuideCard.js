import AutoScaleImage from './AutoScaleImage.js';

export default function MOTTouristGuideCard(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={638}
        height={2034}
        maxWidth={2034}
    />;
}