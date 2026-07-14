import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMoEYSStudentCardEnCanvas(certificateInfo = {}, qrcodeContent) {
    const COLORS = {
        black: '#000000',
        blue: '#014283',
    };

    const FONTS = {
        primary: 'Khmer Os Muol Light',
        secondary: 'Khmer OS Siemreap'
    };

    const MPTC_TEMPLATE_IMAGE = 'certificate-moeys-student-card-en.png';

    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.department'],
            text: 'Kandal',
            textSize: 20,
            textStyle: 'bold',
            textColor: COLORS.black,
            x: 536,
            y: 195,
            align: 'left',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['recipient.id'],
            text: '{recipient.id}',
            textSize: 22,
            textColor: COLORS.black,
            x: 349,
            y: 343,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.yearstart'],
            text: '2023',
            textSize: 22,
            textStyle: 'bold',
            textColor: COLORS.black,
            x: 420,
            y: 394,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.yearend'],
            text: '2024',
            textSize: 22,
            textStyle: 'bold',
            textColor: COLORS.black,
            x: 498,
            y: 394,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 24,
            textColor: COLORS.black,
            x: 380,
            y: 454,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.gender'],
            text: '{recipient.gender}',
            textSize: 22,
            textColor: COLORS.black,
            x: 350,
            y: 515,
            align: 'left',
            textFont: FONTS.secondary
        },{
            dataKeys: ['recipient.nation'],
            text: '{recipient.nation}',
            textSize: 22,
            textColor: COLORS.black,
            x: 571,
            y: 505,
            textFont: FONTS.secondary
        },{
            dataKeys: ['certificate.class'],
            text: '{certificate.class}',
            textSize: 22,
            textColor: COLORS.black,
            x: 348,
            y: 556,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.id'],
            text: '{recipient.id}',
            textSize: 22,
            textColor: COLORS.black,
            x: 571,
            y: 556,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.dateOfBirth'],
            text: '{recipient.dateOfBirth}',
            textSize: 22,
            textColor: COLORS.black,
            x: 214,
            y: 616,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.permanentAddress'],
            text: '{recipient.permanentAddress}',
            textSize: 22,
            textColor: COLORS.black,
            x: 214,
            y: 660,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.fatherName'],
            text: '{recipient.fatherName}',
            textSize: 22,
            textColor: COLORS.black,
            x: 214,
            y: 702,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.fatherOccupation'],
            text: '{recipient.fatherOccupation}',
            textSize: 22,
            textColor: COLORS.black,
            x: 542,
            y: 702,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.motherName'],
            text: '{recipient.motherName}',
            textSize: 22,
            textColor: COLORS.black,
            x: 214,
            y: 745,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.motherOccupation'],
            text: '{recipient.motherOccupation}',
            textSize: 22,
            textColor: COLORS.black,
            x: 542,
            y: 745,
            align: 'left',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['recipient.currentAddress'],
            text: '{recipient.currentAddress}',
            textSize: 22,
            textColor: COLORS.black,
            x: 215,
            y: 790,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.day'],
            text: '30',
            textSize: 22,
            textColor: COLORS.black,
            x: 104,
            y: 853,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.month'],
            text: 'March',
            textSize: 22,
            textColor: COLORS.black,
            x: 217,
            y: 853,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.year'],
            text: '2023',
            textSize: 22,
            textColor: COLORS.black,
            x: 338,
            y: 853,
            align: 'left',
            textFont: FONTS.primary
        },
        {
            dataKeys: [''],
            text: 'Student QR',
            textSize: 22,
            textColor: COLORS.black,
            x: 585,
            y: 854,
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
            textColor: text.textColor || MPTC_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(FONTS.primary, 24, text),
        });
    }

    // Test static sample first
    if (qrcodeContent) {
        // await drawQrCodeStandard(qrcodeContent, ctx, 450, 866, 140); //buttom
        // await drawQrCodeStandard(qrcodeContent, ctx, 577, 216, 140); //center
        // await drawQrCodeStandard(qrcodeContent, ctx, 598, 23, 120); //top
        await drawQrCodeStandard(qrcodeContent, ctx, 573, 866, 140); //buttom right
    }

    // draw profile photo
    certificateInfo.certificate.photoUrl = "https://storage.verifykh.com/moeys/2022/9190f943-7b91-43d9-9b9b-f378646eaec8.jpg";
    if (certificateInfo.certificate.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.certificate.photoUrl);
        if (profileImage) {
            const profileMaxWidth = 206;
            const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 23;
            const profileY = 307;
            ctx.drawImage(profileImage, profileX, profileY, profileMaxWidth, profileHeight);
        }
    }

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
