import AutoScaleImage from './AutoScaleImage.js';

export default function DGCWorkshopCertificate(props) {
    return (
        <AutoScaleImage
            qrcode={props.qrcode}
            documentUrl={props.document.documentUrl}
            wrappedDocument={props.wrappedDocument}
            width={3508 / 3.5}
            // height={2479 / 3.5}
            maxWidth={3508 / 3.5}
        />
    );
}
