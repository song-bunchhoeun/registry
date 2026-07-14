import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMoEYSCertificateAppreciateYearly(certificateInfo = {}, qrcodeContent) {
    const COLORS = {
        blue: '#003399',
        darkBlue: '#002060',
        red: '#FF0000'
    };

    const FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Khmer OS Siemreap'
    };

    const MPTC_TEMPLATE_IMAGE = 'certificate-moeys-appreciate-yearly.png';

    const MPTC_TEXTS = [
        {
            dataKeys: ['certificate.type'],
            text: 'ប័ណ្ណសរសើរ',
            textSize: 50,
            textStyle: 'bold',
            textColor: COLORS.red,
            y: 434,
            align: 'center',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['certificate.province'],
            text: '{certificate.province}',
            textSize: 20,
            textStyle: 'bold',
            textColor: COLORS.blue,
            x: 275,
            y: 418,
            align: 'left',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['certificate.school'],
            text: '{certificate.school}',
            textSize: 21,
            textColor: COLORS.blue,
            x: 164,
            y: 494,
            align: 'left',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['certificate.school'],
            text: '{certificate.school}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 625,
            y: 697,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.toPrefix'],
            text: 'សរសើរចំពោះសិស្សឈ្មោះ',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 239,
            y: 747,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 645,
            y: 747,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.classPrefix'],
            text: 'រៀននៅថ្នាក់ទី៖',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1116,
            y: 745,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.class'],
            text: '{certificate.class}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1344,
            y: 745,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.rank'],
            text: '1',
            textSize: 33.3,
            textColor: COLORS.red,
            x: 1175,
            y: 803,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.rankPrefix'],
            text: 'ដែលបានទទួលលទ្ធផលក្នុងការសិក្សា ហើយត្រូវបានចំណាត់ថ្នាក់លេខ៖',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 239,
            y: 803,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.gradePrefix'],
            text: ',និទ្ទេស៖',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1237,
            y: 803,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.grade'],
            text: 'A',
            textSize: 33.3,
            textColor: COLORS.red,
            x: 1385,
            y: 803,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.annoulYearPrefix'],
            text: 'នៅ៖',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 239,
            y: 861,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.annoulYear'],
            text: 'ប្រចាំឆ្នាំសិក្សា',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 358,
            y: 861,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.yearOfStudyPrefix'],
            text: 'នៃឆ្នាំសិក្សា៖',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 812,
            y: 861,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.yearOfStudy'],
            text: '{certificate.yearOfStudy}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1006,
            y: 861,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.issueDate'],
            text: '{certificate.issueDate}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1092,
            y: 916,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.classLeader'],
            text: '{certificate.classLeader}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1291,
            y: 1051,
            align: 'left',
            textFont: FONTS.secondary
        },
    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    // Draw Caption 

    for (const text of MPTC_TEXTS) {

        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || MPTC_TEXT_COLORS.blue,
            align: text.align,
            font: resolveFont(FONTS.primary, 24, text),
        });
    }

    // Test static sample first
    // if (qrcodeContent) {
    //     // await drawQrCodeStandard(qrcodeContent, ctx, 450, 866, 140); //buttom
    //     // await drawQrCodeStandard(qrcodeContent, ctx, 577, 216, 140); //center
    //     // await drawQrCodeStandard(qrcodeContent, ctx, 598, 23, 120); //top
    //     await drawQrCodeStandard(qrcodeContent, ctx, 573, 866, 140); //buttom right
    // }

    // draw profile photo
    // certificateInfo.certificate.photoUrl = "https://storage.verifykh.com/moeys/2022/9190f943-7b91-43d9-9b9b-f378646eaec8.jpg";
    // if (certificateInfo.certificate.photoUrl) {
    //     const profileImage = await loadRemoteResource(certificateInfo.certificate.photoUrl);
    //     if (profileImage) {
    //         const profileMaxWidth = 206;
    //         const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
    //         const profileX = 23;
    //         const profileY = 307;
    //         ctx.drawImage(profileImage, profileX, profileY, profileMaxWidth, profileHeight);
    //     }
    // }

    return canvas;
}
export async function drawQrCodeStandard(qrcodeContent, ctx, x = 0, y = 0, width = 120) {
    // ration: 120/148 of QR Standard
    const logoPath = path.join(process.cwd(), 'assets', 'qr-bg.png');
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