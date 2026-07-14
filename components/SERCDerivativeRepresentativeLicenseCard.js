import AutoScaleImage from "./AutoScaleImage.js";

export default function SERCDerivativeRepresentativeLicenseCard(props) {
    return (
        <AutoScaleImage
            qrcode={props.qrcode}
            documentUrl={props.document.documentUrl}
            wrappedDocument={props.wrappedDocument}
            width={1500}
            height={4500}
            maxWidth={1500}
        />
    );
}
