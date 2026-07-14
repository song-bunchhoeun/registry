
import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createCADTTrainingCertificate(certificateInfo = {}, qrcodeContent) {
    const CADT_TEXT_COLORS = {
        black: '#000000',
        blue: '#122A4A',
    };

    const CADT_FONTS = {
        primary: 'Niradei',
        secondary: 'Arial',
    };
    const CADT_TEMPLATE_IMAGE = "cadt-training-cert-with-stamp.png"
    // '';
    const CADT_TEXTS = [
       {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 108,
            textStyle: 'bold',
            textColor: CADT_TEXT_COLORS.blue,
            textFont: CADT_FONTS.primary,
            y: 1336,
            align: 'center',
        },
        {
            dataKeys: ['certificate.dateKm'],
            text: 'នៅ{certificate.dateKm}',
            textSize: 62.5,
            textColor: CADT_TEXT_COLORS.blue,
            textFont: CADT_FONTS.primary,
            y: 2120,
            align: 'center',
        },
        {
            dataKeys: ['certificate.issueDateKm'],
            text: '{certificate.issueDateKm}',
            textSize: 50,
            textColor: CADT_TEXT_COLORS.blue,
            textFont: CADT_FONTS.primary,
            y: 2528,
            align: 'center',
        },
        {
            dataKeys: ['certificate.issueDate'],
            text: '{certificate.issueDate}',
            textSize: 46,
            textColor: CADT_TEXT_COLORS.blue,
            textFont: CADT_FONTS.primary,
            y: 2599,
            align: 'center',
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 85,
            textStyle: 'bold',
            textColor: CADT_TEXT_COLORS.blue,
            textFont: CADT_FONTS.primary,
            y: 1503,
            align: 'center',
        },
        {
            dataKeys: ['certificate.date'],
            text: 'held on {certificate.date}',
            textSize: 46,
            textColor: CADT_TEXT_COLORS.blue,
            textFont: CADT_FONTS.primary,
            y: 2190,
            align: 'center',
        },
       
    ];

    const bg = await createTemplateImage(CADT_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    
    // Draw Caption 
    for (const text of CADT_TEXTS) {

        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || CADT_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(CADT_FONTS.primary, 24, text),
        });
    }




   if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2006, 2982, 279);
    }


    // draw profile photo
    if (certificateInfo.certificate.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.certificate.photoUrl);
        if (profileImage) {
            const profileMaxWidth = 300;
            const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 1060;
            const profileY = 1119;
            ctx.drawImage(profileImage, profileX, profileY, profileMaxWidth, profileHeight);
        }
    }
    return canvas;
}
export async function drawCenterText(text1Style = {},text1Color,text1Content, text2Style = {},text2Color,text2Content,x,y,ITC_FONTS,ctx,canvas,bg) {
    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
    let text1Width =  ctx.measureText(text1Content).width;
    ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
    let text2Width =  ctx.measureText(text2Content).width;
    let totalContentWidth = text1Width+text2Width;
    let spaceWidth= x*2-totalContentWidth;

    let mulTotalWidth = spaceWidth/2; 
     drawText(canvas, ctx, text1Content, {
        x: mulTotalWidth,
        y: y,
        textColor:text1Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text1Style),
    });

    drawText(canvas, ctx, text2Content, {
        x:mulTotalWidth +text1Width,
        y: y,
        textColor: text2Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text2Style),
    });



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
