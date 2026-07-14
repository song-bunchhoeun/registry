import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMoINFOFreelancerCard(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        blue: '#2e3192',
        red: "#f00000"
    };

    const MPTC_FONTS = {
        primary: 'Khmer M1',
        secondary: 'Kh Muol',
        thirdly: 'Khmer OS Muol Light',
    };
    
    const MPTC_TEMPLATE_IMAGE ='moinfo-freelancer-card-front-only-v4.0.png'
    // const MPTC_TEMPLATE_IMAGE ='moinfo-freelancer-card-front-only.png'
    
    let MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 92,
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.secondary,
            x: 2083,
            y: 467,
            align: 'left',
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 92,
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.secondary,
            x: 2082,
            y: 617,
            align: 'left',
        },
        {
            dataKeys: ['recipient.mediaId'],
            text: '{recipient.mediaId}',
            textSize: 100,
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.fourly,
            textStyle: 'bold',
            x: 644,
            y: 1957,
            align: 'center',
        },
        {
            dataKeys: ['certificate.year'],
            text: '{certificate.year}',
            textSize: 154,
            textColor: MPTC_TEXT_COLORS.red,
            textFont: MPTC_FONTS.thirdly,
            x: 1682,
            y: 3613,
            align: 'center',
        },
    ];
    let postionLabel = [
        {
            dataKeys: ['recipient.positionKm', 'recipient.position'],
            text: '{recipient.positionKm} / {recipient.position}',
            textSize: 92,
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.thirdly,
            x: 1488,
            y: 1219,
            align: 'left',
        },
    ]
    if (certificateInfo.recipient ?.position === "Deputy Director of Department") {
        postionLabel[0].textSize= 68.8
    }
    if  (certificateInfo.recipient ?.position === "Director of Department") {
        postionLabel[0].textSize= 86.7
    }

    let organizationKm = certificateInfo.recipient.organizationKm;
    let organizationLable = [
        {
            dataKeys: ['recipient.organization', 'recipient.organizationKm'],
            text: '{recipient.organization}',
            textSize: 92.2,
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.thirdly,
            x: 1490,
            y: 920,
            align: 'left',
        }
    ]
    if(organizationKm){
        organizationLable[0].text='{recipient.organizationKm} / {recipient.organization}'
    }
    else{
        organizationLable[0].text = '{recipient.organization}'
    }

    MPTC_TEXTS = [...MPTC_TEXTS, ...postionLabel, ...organizationLable];

    // if (recipient.institution !== "") {
    //     MPTC_TEXTS.push(
    //         {
    //             dataKeys: ['certificate.institutionKm', 'certificate.institution'],
    //             text: '{certificate.institutionKm} / {certificate.institution}',
    //             textSize: 94,
    //             textColor: MPTC_TEXT_COLORS.blue,
    //             textFont: MPTC_FONTS.secondary,
    //             x: 1485,
    //             y: 1051,
    //             align: 'left',
    //         }
    //     )
    // }

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    
    // Draw Caption 
    for (const text of MPTC_TEXTS) {

        const value = _.get(certificateInfo, text.key, '');
        if (value !== 'null' && value !== null) {
            if (text.dataKeys && text.dataKeys.length > 0) {
                for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
            }

            if (text.text === 'null' || text.text === null) continue;

            drawText(canvas, ctx, text.text, {
                x: text.x,
                y: text.y,
                textColor: text.textColor || MPTC_TEXT_COLORS.black,
                align: text.align,
                font: resolveFont(MPTC_FONTS.primary, 24, text),
            });
        }
    }
    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1392, 1289, 547);
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const maxImgBoxWidth = 1034;
            const maxImgBoxHeight = 1325;

            // get the scale
            // it is the min of the 2 ratios
            let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

            // Lets get the new width and height based on the scale factor
            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;

            // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 131;
            const profileY = 425;
            ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
        }
    }
    return canvas;
}

export async function drawQrCodeStandard(qrcodeContent, ctx, x = 0, y = 0, width = 120) {
    // ration: 120/148 of QR Standard
    const logoPath = path.join(process.cwd(), 'assets', 'qr-bg-v2.png');
    const qrcodeLogoImage = await loadImage(logoPath);
    const gapSize = (width * 10) / 120;        // 
    const qrcodeSize = width - (gapSize * 2); // exclude margin x,y
    const height = (width * 148) / 120;
    ctx.drawImage(
        qrcodeLogoImage,
        x,
        y,
        width,
        height
    );
    const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, { margin: 0, width: qrcodeSize });
    const qrcodeImage = await loadImage(qrcodeBuffer);
    ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}
// 'style size fontName' ex:'bold 20px Arial'
function resolveFont(defaultFont, defaultSize, text) {
    const space = ' ';
    let font = '';
    const fontName = text.textFont ? text.textFont : defaultFont;

    font += text.textStyle ? text.textStyle + space : '';
    font += text.textSize ? text.textSize : defaultSize;
    font += 'px' + space;
    font += fontName;
    return font;
}
