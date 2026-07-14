import AutoScaleImage from './AutoScaleImage.js';

export default function MOCCertificateOfIncorporate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={1950}
        height={1380}
        maxWidth={1950}
    />;
}
