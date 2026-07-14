import AutoScaleImage from './AutoScaleImage.js';

export default function MoEYSStudentCard(props) {
    return <AutoScaleImage
        qrcode={props.qrcode}
        documentUrl={props.document.documentUrl}
        wrappedDocument={props.wrappedDocument}
        width={528}
        height={858}
        maxWidth={528}
    />; // will need to do actual size
    // TODO: resize the image
}
