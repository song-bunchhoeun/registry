import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';
import { loadRemoteResource } from './shared';

export async function createITCBachelorEngineerCertCanvas(certificateInfo = {}, qrcodeContent) {
    const ITC_TEXT_COLORS = {
        black: '#020202',
        blue: '#004482',
    };

    const ITC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondly: 'Arial',
        thirdly: 'Khmer Chrieng1',
    };
    const ITC_TEMPLATE_IMAGE = 'certificate-itc-bachelor-enginer.png'

    const ITC_TEXTS = [
        {
            dataKeys: ['certificate.approveDateKm'],
            text: 'នៃវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជាចុះ{certificate.approveDateKm}',
            textSize: 46,
            textStyle: 'normal',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 1321,
            align: 'center'
        },
        {
            dataKeys: ['certificate.approveDate'],
            text: 'of Institut de Technologie du Cambodge dated {certificate.approveDate},',
            textSize: 38,
            textStyle: 'normal',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.secondly,
            y: 1398,
            align: 'center'
        },
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: 'កើត{recipient.dateOfBirthKm}',
            textSize: 47,
            textStyle: 'normal',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 1654,
            align: 'center'
        },
        {
            dataKeys: ['recipient.dateOfBirth'],
            text: 'born on {recipient.dateOfBirth}',
            textSize: 38,
            textStyle: 'normal',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.secondly,
            y: 1731,
            align: 'center'
        },
        {
            dataKeys: ['certificate.number'],
            text: 'No. {certificate.number}',
            textSize: 38,
            textStyle: 'bold',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 2626,
            align: 'center'
        },
        {
            dataKeys: ['certificate.boardOfTrusteeSignatureLunarDateKm'],
            text: '{certificate.boardOfTrusteeSignatureLunarDateKm}',
            textSize: 38,
            textStyle: 'normal',
            align: 'center',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 2529,
            x:732
        },
        {
            dataKeys: ['certificate.directorSignatureLunarDateKm'],
            text: '{certificate.directorSignatureLunarDateKm}',
            textSize: 38,
            textStyle: 'normal',
            align: 'center',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 2529,
            x: 1741,
        },
        {
            dataKeys: ['certificate.boardOfTrusteeSignatureDateKm'],
            text: '{certificate.boardOfTrusteeSignatureDateKm}',
            textSize: 42,
            textStyle: 'normal',
            align: 'center',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 2616,
            x: 732,
        },
        {
            dataKeys: ['certificate.directorSignatureDateKm'],
            text: '{certificate.directorSignatureDateKm}',
            textSize: 42,
            textStyle: 'normal',
            align: 'center',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 2616,
            x: 1741,
        }, 
        {
            dataKeys: ['certificate.directorSignatureDate'],
            text: '{certificate.directorSignatureDate}',
            textSize: 38,
            textStyle: 'normal',
            align: 'center',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 2680,
            x: 1741,
        },
        {
            dataKeys: ['certificate.boardOfTrusteeSignatureDate'],
            text: '{certificate.boardOfTrusteeSignatureDate}',
            textSize: 38,
            textStyle: 'normal',
            align: 'center',
            textColor: ITC_TEXT_COLORS.black,
            textFont: ITC_FONTS.thirdly,
            y: 2680,
            x: 732,
        }

    ];

    const bg = await createTemplateImage(ITC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);
    // Draw Caption 

    for (const text of ITC_TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys) text.text = text.text.replace(`{${key}}`, _.get(certificateInfo, key, ''));
        }
        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || ITC_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(ITC_FONTS.primary, 24, text),
        });
    }

    // Draw nameKm
    let nameLKmText1Style = {
        textSize: 47,
        textStyle: 'normal',
        textFont: ITC_FONTS.thirdly
    }
    let nameKmText2Style = {
        textSize: 55,
        textStyle: 'bold',
        textFont: ITC_FONTS.thirdly
    }
    let fullnameKm = certificateInfo.recipient.nameKm;
    let titleNameKm = 'ប្រគល់ជូន ' + certificateInfo.recipient.titleKm + " ";
    drawCenterText(nameLKmText1Style, ITC_TEXT_COLORS.black, titleNameKm, nameKmText2Style, ITC_TEXT_COLORS.black, fullnameKm, 1491, ITC_FONTS, ctx, canvas, bg)

    // Draw name
    let nameText1Style = {
        textSize: 38,
        textStyle: 'normal',
        textFont: ITC_FONTS.secondly
    }
    let nameText2Style = {
        textSize: 38,
        textStyle: 'bold',
        textFont: ITC_FONTS.secondly
    }
    let fullname = certificateInfo.recipient.name;
    let titleName = 'has conferred on ' + certificateInfo.recipient.title + " ";
    drawCenterText(nameText1Style, ITC_TEXT_COLORS.black, titleName, nameText2Style, ITC_TEXT_COLORS.black, fullname, 1578, ITC_FONTS, ctx, canvas, bg)


    // Draw certificate name
    let prizeText1Style = {
        textSize: 38,
        textStyle: 'normal',
        textFont: ITC_FONTS.secondly
    }
    let prizeText2Style = {
        textSize: 38,
        textStyle: 'bold',
        textFont: ITC_FONTS.secondly
    }
    let fullPrize = certificateInfo.certificate.degree;
    drawCenterText(prizeText1Style, ITC_TEXT_COLORS.black, 'The ', prizeText2Style, ITC_TEXT_COLORS.black, fullPrize, 2034, ITC_FONTS, ctx, canvas, bg)

    // Draw certificate nameKm
    let prizeKmText1Style = {
        textSize: 49,
        textStyle: 'normal',
        textFont: ITC_FONTS.thirdly
    }
    let prizeKmText2Style = {
        textSize: 49,
        textStyle: 'bold',
        textFont: ITC_FONTS.thirdly
    }
    let fullPrizeKm = certificateInfo.certificate.degreeKm;
    drawCenterText(prizeKmText1Style, ITC_TEXT_COLORS.black, 'សញ្ញាបត្រ ', prizeKmText2Style, ITC_TEXT_COLORS.black, fullPrizeKm, 1957, ITC_FONTS, ctx, canvas, bg)
    
    // draw majorKm
    let majorKmText1Style = {
        textSize: 49,
        textStyle: 'normal',
        textFont: ITC_FONTS.thirdly
    }
    let majorKmText2Style = {
        textSize: 49,
        textStyle: 'bold',
        textFont: ITC_FONTS.thirdly
    }
    let majorKm = certificateInfo.certificate.majorKm;
    drawCenterText(majorKmText1Style, ITC_TEXT_COLORS.black, 'ឯកទេស ', majorKmText2Style, ITC_TEXT_COLORS.black, majorKm, 2115, ITC_FONTS, ctx, canvas, bg)

    // draw major
    let majorText1Style = {
        textSize: 38,
        textStyle: 'normal',
        textFont: ITC_FONTS.secondly
    }

    let majorText2Style = {
        textSize: 38,
        textStyle: 'bold',
        textFont: ITC_FONTS.secondly
    }
    let major = certificateInfo.certificate.major;
    drawCenterText(majorText1Style, ITC_TEXT_COLORS.black, 'In ', majorText2Style, ITC_TEXT_COLORS.black, major, 2194, ITC_FONTS, ctx, canvas, bg)

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1818, 1978, 320);
    }
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const profileMaxWidth = 360;
            const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 1055;
            const profileY = 2665;
            ctx.drawImage(profileImage, profileX, profileY, profileMaxWidth, profileHeight);
        }
    }
    return canvas;
}

export async function drawCenterText(text1Style = {}, text1Color, text1Content, text2Style = {}, text2Color, text2Content, y, ITC_FONTS, ctx, canvas, bg) {
    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
    let text1Width = ctx.measureText(text1Content).width;
    ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
    let text2Width = ctx.measureText(text2Content).width;
    let totalContentWidth = text1Width + text2Width;
    let spaceWidth = (bg.width - totalContentWidth);

    let mulTotalWidth = spaceWidth / 2;
    drawText(canvas, ctx, text1Content, {
        x: mulTotalWidth,
        y: y,
        textColor: text1Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text1Style),
    });

    drawText(canvas, ctx, text2Content, {
        x: mulTotalWidth + text1Width,
        y: y,
        textColor: text2Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text2Style),
    });
}

export async function drawTowCenterText(text1Style = {}, text1Color, text1Content, text2Style = {}, text2Color, text2Content, text3Style = {}, text3Color, text3Content, y, ITC_FONTS, ctx, canvas, bg) {

    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
    let text1Width = ctx.measureText(text1Content).width;

    ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
    let text2Width = ctx.measureText(text2Content).width;

    ctx.font = `${text3Style.textStyle} ${text3Style.textSize}px ${text3Style.textFont}`;
    let text3Width = ctx.measureText(text3Content).width;

    let totalContentWidth = text1Width + text2Width + text3Width;
    let spaceWidth = (bg.width - totalContentWidth);
    let mulTotalWidth = spaceWidth / 2;
    drawText(canvas, ctx, text1Content, {
        x: mulTotalWidth,
        y: y,
        textColor: text1Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text1Style),
    });
    drawText(canvas, ctx, text2Content, {
        x: mulTotalWidth + text1Width,
        y: y,
        textColor: text2Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text2Style),
    });
    drawText(canvas, ctx, text3Content, {
        x: mulTotalWidth + text1Width + text2Width,
        y: y,
        textColor: text3Color,
        align: 'left',
        font: resolveFont(ITC_FONTS.primary, 50, text3Style),
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

export async function createQRCodeLogoImage() {
    const logoPath = path.join(process.cwd(), 'assets', 'certificate-bacii-qrcode-logo.png');
    return loadImage(logoPath);
}

function font(name = fontConfig.primary, size = 20) {
    return `${size}px ${name}, sans-serif`;
}

function fontBold(name = fontConfig.primary, size = 20) {
    return `bold ${size}px ${name}, sans-serif`;
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