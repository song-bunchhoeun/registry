import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMoEYSCertificateCommendation(certificateInfo = {}, qrcodeContent) {
    const COLORS = {
        blue: '#003399',
        darkBlue: '#002060',
        red: '#FF0000'
    };

    const FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Khmer OS Siemreap'
    };

    const TEMPLATE_IMAGE = 'certificate-moeys-appreciate-commendation-motivation.png';
    const space = " ";

    const TEXTS = [
        {
            text: 'លិខិតសរសើរ',
            textSize: 50,
            textStyle: 'normal',
            textColor: COLORS.red,
            y: 434,
            align: 'center',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['certificate.province'],
            text: '{certificate.province}',
            textSize: 21,
            textStyle: 'medium',
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
            textStyle: 'medium',
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
            dataKeys: ['recipient.name'],
            text: 'សរសើរចំពោះសិស្សឈ្មោះ' + space.repeat(8) + '{recipient.name}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 236,
            y: 747,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.classGrade'],
            text: 'រៀននៅថ្នាក់ទី៖' + space.repeat(6) + '{certificate.classGrade}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1158,
            y: 743,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            text: 'ដែលបានទទួលលទ្ធផលក្នុងការសិក្សា ហើយត្រូវបានចំណាត់ថ្នាក់លេខ៖',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 236,
            y: 803,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.rank'],
            text: space.repeat(6) + '{certificate.rank}',
            textSize: 33.3,
            textColor: COLORS.red,
            x: 1105,
            y: 803,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
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
            text: '{certificate.grade}',
            textSize: 33.3,
            textColor: COLORS.red,
            x: 1385,
            y: 803,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.periodTitle','certificate.periodValue'],
            text: '{certificate.periodTitle}' + space.repeat(4) + '{certificate.periodValue}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 236,
            y: 861,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.yearOfStudy'],
            text: 'នៃឆ្នាំសិក្សា៖' + space.repeat(3) + '{certificate.yearOfStudy}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 877,
            y: 861,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: 'ថ្ងៃទី {certificate.signatureDate}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1112,
            y: 916,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.classTeacher'],
            text: '{certificate.classTeacher}',
            textSize: 33.3,
            textColor: COLORS.darkBlue,
            x: 1291,
            y: 1051,
            align: 'left',
            textFont: FONTS.secondary
        },
    ];

    const bg = await createTemplateImage(TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // Draw Caption 
    for (const text of TEXTS) {

        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || TEXT_COLORS.blue,
            align: text.align,
            font: resolveFont(FONTS.primary, 24, text),
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1430, 815, 160);
    }

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
