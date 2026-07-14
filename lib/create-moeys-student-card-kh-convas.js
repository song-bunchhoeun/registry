import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMoEYSStudentCardKhCanvas(certificateInfo = {}, qrcodeContent) {
    
    const COLORS = {
        black: '#000000',
        blue: '#014283',
    };

    const FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'Khmer OS Siemreap'
    };

    const MPTC_TEMPLATE_IMAGE = 'certificate-moeys-student-card-resize-km.png';
    const years = certificateInfo.certificate.yearOfStudy.split("-");
    let textYear={
        textSize: 38,
        textStyle: 'bold',
        textFont: FONTS.secondary
    }
    const MPTC_TEXTS = [
        {
            dataKeys: [''],
            text: 'ខេត្ត',
            textSize: 32,
            textColor: COLORS.black,
            x: 680,
            y: 332,
            align: 'left',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['certificate.province'],
            text: '{certificate.province}',
            textSize: 32,
            textColor: COLORS.black,
            x: 760,
            y: 330,
            align: 'left',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['certificate.schoolName'],
            text: '{certificate.schoolName}',
            textSize: 40,
            textColor: COLORS.black,
            y: 408,
            align: 'center',
            textFont: FONTS.primary
        },
       
        {
            dataKeys: ['recipient.cardId'],
            text: '{recipient.cardId}',
            textSize: 34,
            textColor: COLORS.black,
            x: 544,
            y: 576,
            align: 'left',
            textFont: FONTS.primary
        },
       
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 38,
            textColor: COLORS.black,
            x: 659,
            y: 752,
            align: 'left',
            textFont: FONTS.primary
        },
        {
            dataKeys: ['recipient.gender'],
            text: '{recipient.gender}',
            textSize: 38,
            textColor: COLORS.black,
            x: 529,
            y: 836,
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.nationality'],
            text: '{recipient.nationality}',
            textSize: 38,
            textColor: COLORS.black,
            x: 852,
            y: 836,
            textFont: FONTS.secondary
        }
        ,{
            dataKeys: ['certificate.grade'],
            text: '{certificate.grade}',
            textSize: 38,
            textColor: COLORS.black,
            x: 529,
            y: 916,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.studentId'],
            text: '{recipient.studentId}',
            textSize: 38,
            textColor: COLORS.black,
            x: 852,
            y: 916,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.dob'],
            text: '{recipient.dob}',
            textSize: 38,
            textColor: COLORS.black,
            x: 338,
            y: 1002,
            align: 'left',
            textFont: FONTS.secondary
        },
        
        {
            dataKeys: ['recipient.placeOfBirth'],
            text: '{recipient.placeOfBirth}',
            textSize: 38,
            textColor: COLORS.black,
            x: 338,
            y: 1076,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.fatherName'],
            text: '{recipient.fatherName}',
            textSize: 38,
            textColor: COLORS.black,
            x: 258,
            y: 1154,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.fatherJob'],
            text: '{recipient.fatherJob}',
            textSize: 38,
            textColor: COLORS.black,
            x: 777,
            y: 1154,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.motherName'],
            text: '{recipient.motherName}',
            textSize: 38,
            textColor: COLORS.black,
            x: 258,
            y: 1234,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.motherJob'],
            text: '{recipient.motherJob}',
            textSize: 38,
            textColor: COLORS.black,
            x: 777,
            y: 1234,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['recipient.currentAddress'],
            text: '{recipient.currentAddress}',
            textSize: 38,
            textColor: COLORS.black,
            x: 310,
            y: 1312,
            align: 'left',
            textFont: FONTS.secondary
        },
        {
            dataKeys: ['certificate.issueDate'],
            text: '{certificate.issueDate}',
            textSize: 38,
            textColor: COLORS.black,
            x: 90,
            y: 1388,
            align: 'left',
            textFont: FONTS.secondary
        }
    ];
    
    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    // Draw Year
    drawText(canvas, ctx, years[0], {
        x: 540,
        y: 654,
        textColor: COLORS.black,
        align: "left",
        textStyle: 'bold',
        font: resolveFont(FONTS.secondary, 32, textYear),
    });

    drawText(canvas, ctx, years[1], {
        x: 684,
        y: 654,
        textColor: COLORS.black,
        align: "left",
        font: resolveFont(FONTS.secondary, 32, textYear),
    });

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
        await drawQrCodeStandard(qrcodeContent, ctx, 742, 1350, 260); //buttom right
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const profileMaxWidth = 324;
            const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 65;
            const profileY = 522;
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
