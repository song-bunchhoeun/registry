import _ from 'lodash';
import { createMPTCCda2025FinalJudgesCertificateCanvas } from '../lib/create-mptc-cda-2025-final-judges-certificate-canvas';
import { createMPTCCda2025SemifinalJudgesCertificateCanvas } from '../lib/create-mptc-cda-2025-semifinal-judges-certificate-canvas';
import { createMPTCCda2025SponsorCertificateCanvas } from '../lib/create-mptc-cda-2025-sponsor-certificate-canvas';

export async function createMPTCCda2025CertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    let canvas;
    const certificateType = _.get(certificateInfo, 'certificate.type');

    switch (certificateType) {
        case 'semi_final_judge':
            canvas = createMPTCCda2025SemifinalJudgesCertificateCanvas(
                certificateInfo,
                qrcodeContent
            );
            break;
        case 'final_judge':
            canvas = createMPTCCda2025FinalJudgesCertificateCanvas(
                certificateInfo,
                qrcodeContent
            );
            break;
        case 'sponsor':
            canvas = createMPTCCda2025SponsorCertificateCanvas(
                certificateInfo,
                qrcodeContent
            );
            break;
        default:
            break;
    }
    return canvas;
}
