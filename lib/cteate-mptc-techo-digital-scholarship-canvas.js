import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';
export async function createMPTCTeachoDigitalCertCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#020202',
        blue: '#004282',
        red: '#f00'
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'NiDA Sowannaphum',
        thirdly: 'NiDA Funan',
        fouthly: 'Google Sans',
        fifthly: 'Google Sans Medium',
        sixly: 'Arial',
    };
   
    const MPTC_TEMPLATE_IMAGE = 'certificate-techo-digital-scholarship-2024.png';
    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: 50,
            textStyle: 'normal',
            textColor: MPTC_TEXT_COLORS.blue,
            textFont: MPTC_FONTS.primary,
            y: 1649, 
            align: 'center'
        },          
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.blue,      
            textFont: MPTC_FONTS.fouthly,  
            y: 2115,
            align: 'center',
            textStyle: 'bold'
        },
        {
            dataKeys: ['certificate.year'],
            text: 'ដែលបានប្រឡងជាប់អាហារូបករណ៍ទេពកោសល្យឌីជីថលតេជោ ឆ្នាំ{certificate.year}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black, 
            textFont: MPTC_FONTS.secondary,   
            textStyle:'medium',        
            align: 'center',
            y: 1757,                        
        },
        {
            dataKeys: ['certificate.year'],
            text: `who has been awarded a {certificate.year} Techo Digital Talent Scholarship`,
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,     
            textFont: MPTC_FONTS.fouthly, 
            textStyle:'500',    
            align: 'center',
            y: 2223,                           
        },
        {
            dataKeys: ['certificate.university','certificate.degree'],
            text: 'សិក្សាថ្នាក់{certificate.degree} នៅ{certificate.university}។',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black, 
            textFont: MPTC_FONTS.secondary,    
            textStyle:'medium',        
            align: 'center',
            y: 1865,                       
        },
        {
            dataKeys: ['certificate.university','certificate.degree'],
            text: `to study {certificate.degree} at {certificate.university}.`,
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,    
            textFont: MPTC_FONTS.fouthly,
            textStyle: '500',             
            align: 'center',
            y: 2332,                    
        },
        {
            dataKeys: ['certificate.signatureLunarDateKm'],
            text: '{certificate.signatureLunarDateKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,    
            textFont: MPTC_FONTS.secondary,             
            align: 'center',
            y: 2459,                    
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: 'រាជធានីភ្នំពេញ {certificate.signatureDateKm}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,    
            textFont: MPTC_FONTS.secondary,             
            align: 'center',
            y: 2559,                    
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: 'Phnom Penh, {certificate.signatureDate}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,    
            textFont: MPTC_FONTS.fouthly,    
            textStyle: 'bold',         
            align: 'center',
            y: 2659,                    
        }
    
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
            font: resolveFont(MPTC_FONTS.primary, 24, text),
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1998, 2975, 268); 
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