import AutoScaleImage from './AutoScaleImage.js';

export default function SSFACertificate(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        documentUrl={props.document.documentUrl}
        wrappedDocument={props.wrappedDocument}
        width={1500}
        height={1075}
        maxWidth={2508}
    />
}