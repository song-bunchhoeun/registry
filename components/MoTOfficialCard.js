import AutoScaleImage from './AutoScaleImage.js';

export default function MoTOfficialCard(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={2200}
        height={3508}
        maxWidth={2200}
    />;
}