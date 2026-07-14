import AutoScaleImage from './AutoScaleImage.js';

export default function NUMCertificate(props) {
  return <AutoScaleImage
    wrappedDocument={props.wrappedDocument}
    width={4096}
    height={2827}
    maxWidth={4096}
  />
}
