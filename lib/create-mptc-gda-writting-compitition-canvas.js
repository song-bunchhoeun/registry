import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCGDAWritingCompititionCertCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#020202',
        blue: '#004282',
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'NiDA Sowannaphum',
        thirdly: 'Google Sans',
    };
    const MPTC_TEMPLATE_IMAGE = 'certificate-gda-writing-competition-with-stamp.png';

    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKh'],
            text: '{recipient.nameKh}',
            textSize: 50,
            textStyle: 'nomal',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1595,
            align: 'center',
            textFont: MPTC_FONTS.primary
        },
        {
            dataKeys: ['recipient.schoolKh'],
            text: 'សិស្សនៃ{recipient.schoolKh}',
            textSize: 50,
            textStyle: 'nomal',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1682,
            align: 'center',
            textFont: MPTC_FONTS.primary
        },
        {
            dataKeys: ['recipient.nameEn'],
            text: '{recipient.nameEn}',
            textSize: 50,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2049,
            align: 'center',
            textFont: MPTC_FONTS.thirdly
        },
        {
            dataKeys: ['recipient.schoolEn'],
            text: 'Student of {recipient.schoolEn}',
            textSize: 50,
            textStyle: 'bold',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2136,
            align: 'center',
            textFont: MPTC_FONTS.thirdly
        },
       
    ];
    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // draw prize condition
    let prizeKh = certificateInfo.certificate?.prizeKh;
    let prizeEn = certificateInfo.certificate?.prizeEn;
    let isTop3Student = prizeKh.includes('បានទទួលជ័យលាភី') && prizeEn.includes("as the");
    if(isTop3Student){
        let prizeKh1 ={
            textSize: 50,
            textStyle: 'normal',
            textFont: MPTC_FONTS.secondary
        }
        
        let prizeKh2 ={
            textSize: 50,
            textStyle: 'normal',
            textFont: MPTC_FONTS.primary
        }
        drawCenterText(prizeKh1,MPTC_TEXT_COLORS.black,`${prizeKh.split(" ")[0]} `,prizeKh2,MPTC_TEXT_COLORS.black,prizeKh.split(" ")[1],1770,MPTC_FONTS,ctx,canvas,bg)
        
        let prizeEn1 ={
            textSize: 50,
            textStyle: 'medium 500',
            textFont: MPTC_FONTS.thirdly
        }
        
        let prizeEn2 ={
            textSize: 50,
            textStyle: 'bold',
            textFont: MPTC_FONTS.thirdly
        }

        let PrizeEnText= prizeEn.split("as the")
        drawCenterText(prizeEn1,MPTC_TEXT_COLORS.black,"as the",prizeEn2,MPTC_TEXT_COLORS.black,PrizeEnText[1],2224,MPTC_FONTS,ctx,canvas,bg)
        


    }else{
        MPTC_TEXTS.push( {
            dataKeys: ['certificate.prizeKh'],
            text: '{certificate.prizeKh}',
            textSize: 50,
            textStyle: 'normal',
            textColor: MPTC_TEXT_COLORS.black,
            y: 1770,
            align: 'center',
            textFont: MPTC_FONTS.secondary
        },{
            dataKeys: ['certificate.prizeEn'],
            text: '{certificate.prizeEn}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: 'medium 500',
            y: 2224,
            align: 'center',
            textFont: MPTC_FONTS.thirdly
        });
    }


  
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
            font: resolveFont(MPTC_FONTS.primary, 24, text),
        });
    }
   

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1998, 2975, 268);
    }
    return canvas;
}


export async function drawCenterText(text1Style = {},text1Color,text1Content, text2Style = {},text2Color,text2Content,y,MPTC_FONTS,ctx,canvas,bg) {
    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
    let text1Width =  ctx.measureText(text1Content).width;
    ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
    let text2Width =  ctx.measureText(text2Content).width;
    let totalContentWidth = text1Width+text2Width;
    let spaceWidth=(bg.width - totalContentWidth);


    let mulTotalWidth = spaceWidth/2; 
     drawText(canvas, ctx, text1Content, {
        x: mulTotalWidth,
        y: y,
        textColor:text1Color,
        align: 'left',
        font: resolveFont(MPTC_FONTS.secondary, 50, text1Style),
    });

    drawText(canvas, ctx, text2Content, {
        x:mulTotalWidth +text1Width,
        y: y,
        textColor: text2Color,
        align: 'left',
        font: resolveFont(MPTC_FONTS.primary, 50, text2Style),
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