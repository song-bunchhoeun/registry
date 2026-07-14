import _ from 'lodash';
import { createRUFABachelorCertChor } from './create-rufa-bachelor-cert-chor';
import { createRUFABachelorCertMusic } from './create-rufa-bachelor-cert-music';
import { createRUFABachelorCertArchi } from './create-rufa-bachelor-cert-archi';
import { createRUFABachelorCertPlastic } from './create-rufa-bachelor-cert-plastic';
import { createRUFABachelorCertArchae } from './create-rufa-bachelor-cert-archae';

export async function createRUFABachelorCertCanvas(certificateInfo = {}, qrcodeContent) {
    const degree = _.get(certificateInfo, 'certificate.degree', '').toLowerCase();
    
    switch (degree) {
        case 'faculty of choreographic arts':
            return createRUFABachelorCertChor(certificateInfo, qrcodeContent);
        case 'faculty of music':
            return createRUFABachelorCertMusic(certificateInfo, qrcodeContent);
        case 'faculty of architecture and urbanism':
            return createRUFABachelorCertArchi(certificateInfo, qrcodeContent);
        case 'faculty of plastic arts':
            return createRUFABachelorCertPlastic(certificateInfo, qrcodeContent);
        case 'faculty of archaeology':
            return createRUFABachelorCertArchae(certificateInfo, qrcodeContent);   
    }
}
