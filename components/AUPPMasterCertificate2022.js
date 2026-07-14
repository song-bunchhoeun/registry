import AutoScaleImage from './AutoScaleImage.js';

export default function AUPPMasterCertificate2022(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        wrappedDocument={props.wrappedDocument}
        width={3805}
        height={3134}
        maxWidth={3805}
    />;
}
