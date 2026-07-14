import AutoScaleImage from "./AutoScaleImage";

export default function CADTAppreciationCertificate(props) {
    return (
        <AutoScaleImage
            qrcode={props.qrcode}
            documentUrl={props.document.documentUrl}
            wrappedDocument={props.wrappedDocument}
            width={2481}
            height={3508}
            maxWidth={2481}
        />
    );
}
