import AutoScaleImage from './AutoScaleImage.js';

export default function FSAOfficialIDCard(props) {
    return (
        <AutoScaleImage
            qrcode={props.qrcode}
            documentUrl={props.document.documentUrl}
            wrappedDocument={props.wrappedDocument}
            width={3012 / 3}
            height={3824 / 3}
            maxWidth={3012 / 3}
        />
    );
}
