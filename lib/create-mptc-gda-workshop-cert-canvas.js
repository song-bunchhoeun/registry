import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCGDAWorkshopCertCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#020202',
        blue: '#004282',
    };

    const MPTC_FONTS = {
        primary: 'Khmer OS Muol Light',
        secondary: 'NiDA Sowannaphum',
        thirdly: 'NiDA Funan',
        fouthly: 'Google Sans',
        fifthly: 'Google Sans Medium',
        sixly: 'Arial',
    };
    const MPTC_TEMPLATE_IMAGE = 'certificate-training-mptc-no-qr.png';

    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKh'],
            text: '{recipient.nameKh}',
            textSize: 50,
            textStyle: 'nomal',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1598, 
            align: 'center',
            textFont: MPTC_FONTS.primary
        },          
        {
            dataKeys: ['recipient.nameEn'],
            text: '{recipient.nameEn}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.blue,           
            y: 2082,
            align: 'center',
            textStyle: 'bold',
            textFont: MPTC_FONTS.fouthly
        } , 
        {
            dataKeys: ['recipient.positionKh'],
            text: '{recipient.positionKh}',
            textSize: 50,
            textStyle: 'nomal',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1690,
            align: 'center',
            textFont: MPTC_FONTS.primary
        } , 
    
        {
            dataKeys: ['recipient.positionEn'],
            text: '{recipient.positionEn}',
            textSize: 48,
            textColor: MPTC_TEXT_COLORS.blue,  
            align: 'center',                          
            y: 2174,        
            textStyle:'bold'    ,          
            textFont: MPTC_FONTS.fouthly      
        } ,
        {
            dataKeys: ['certificate.dateKh'],
            text: 'ចាប់ពី{certificate.dateKh} នៅ',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,         
            x: 797.4,
            y: 1875,                             
            textFont: MPTC_FONTS.secondary,           
        }, 
        {
            dataKeys: ['certificate.locationKh'],
            text: '{certificate.locationKh}។',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,         
            x: 1790,   
            y: 1875,                
            textFont: MPTC_FONTS.secondary,           
        }, 
        {
            dataKeys: ['certificate.dateEn'],
            text: '{certificate.dateEn} at',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,         
            x:1371,    
            y: 2357,        
            textStyle:'medium'    ,          
            textFont: MPTC_FONTS.fouthly    
        }, 
        {
            dataKeys: ['certificate.locationEn'],
            text: '{certificate.locationEn}.',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,         
            x:1820, 
            y: 2357,         
            textStyle:'medium'    ,          
            textFont: MPTC_FONTS.fouthly     
        }, 
        {
            dataKeys: ['certificate.signatureLunarDateKh'],
            text: '{certificate.signatureLunarDateKh}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,  
            align: 'center',                  
            y: 2485,                        
            textFont: MPTC_FONTS.secondary,           
        }, 
        {
            dataKeys: ['certificate.signatureDateKh'],
            text: '{certificate.signatureDateKh}',
            textSize: 50,
            align: 'center',     
            textColor: MPTC_TEXT_COLORS.black,                                      
            y: 2576,                  
            textFont: MPTC_FONTS.secondary,           
        }, 
        {
            dataKeys: ['certificate.signatureDateEn'],
            text: '{certificate.signatureDateEn}',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,  
            align: 'center',                          
            y: 2670,        
            textStyle:'medium'    ,          
            textFont: MPTC_FONTS.fouthly      
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