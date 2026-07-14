import AutoScaleImage from './AutoScaleImage.js';

export default function RUFABachelor(props) {
    return (
        <AutoScaleImage
            qrcode={props.qrcode}
            documentUrl={props.document.documentUrl}
            wrappedDocument={props.wrappedDocument}
            width={3509}
            height={2481}
            maxWidth={3509}
        />
    );
}
