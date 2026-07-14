import AutoScaleImage from './AutoScaleImage.js';

export default function MoEYSCertificateAppreciate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={1280}
        height={901}
        maxWidth={1280} />; // will need to do actual size
}
