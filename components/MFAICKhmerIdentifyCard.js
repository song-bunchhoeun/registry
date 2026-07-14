import AutoScaleImage from './AutoScaleImage.js';

export default function MFAICKhmerIdentifyCard(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={2480}
        height={3508}
        maxWidth={2480}
    />;
}
