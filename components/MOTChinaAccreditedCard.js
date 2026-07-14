import AutoScaleImage from './AutoScaleImage.js';

export default function MOTChinaAccreditedCard(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={4961 / 4}
        height={7016 / 4}
        maxWidth={4916 / 4}
    />;
}