import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText } from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createMPTCGDAWorkshopKampongThomCertCanvas(certificateInfo = {}, qrcodeContent) {
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
    const MPTC_TEMPLATE_IMAGE ='certificate-training-pialin-mptc-with-stamp.png';

    const MPTC_TEXTS = [
        {
            dataKeys: ['recipient.nameKh'],
            text: '{recipient.nameKh}',
            textSize: 50,
            textStyle: 'nomal',
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1599, 
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
        },
        {
            dataKeys: ['recipient.positionEn'],
            text: '{recipient.positionEn}',
            textSize: 48,
            textColor: MPTC_TEXT_COLORS.blue,  
            align: 'center',                          
            y: 2174,        
            textStyle:'bold'    ,          
            textFont: MPTC_FONTS.fouthly      
        },
        {
            dataKeys: ['certificate.dateEn','certificate.locationEn'],
            text: 'Telecommunications Provincial Departments” from {certificate.dateEn} at {certificate.locationEn}.',
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.black,           
            align:'center',
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
    let Text1Style ={
        textSize: 50,
        textStyle: 'normal',
        textFont: MPTC_FONTS.secondary
    }
    let Text2Style ={
        textSize: 50,
        textStyle: 'normal',
        textFont: MPTC_FONTS.fouthly
    }
    let Text3Style ={
        textSize: 50,
        textStyle: 'normal',
        textFont: MPTC_FONTS.secondary
    }

    let text3= ` ចាប់ពី${certificateInfo.certificate.dateKh} នៅ${certificateInfo.certificate.locationKh}។`
    let text1= `និងទូរគមនាគមន៍`
    drawTowCenterText(Text1Style,MPTC_TEXT_COLORS.black,text1,Text2Style,MPTC_TEXT_COLORS.black,"”",Text3Style,MPTC_TEXT_COLORS.black,text3,1875,MPTC_FONTS,ctx,canvas,bg)
    

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1998, 2975, 268); 
    }
    return canvas;
}

export async function drawTowCenterText(text1Style = {},text1Color,text1Content, text2Style = {},text2Color,text2Content,text3Style = {},text3Color,text3Content,y,ITC_FONTS,ctx,canvas,bg) {

    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
      let text1Width =  ctx.measureText(text1Content).width;
  
      ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
      let text2Width =  ctx.measureText(text2Content).width;
  
      ctx.font = `${text3Style.textStyle} ${text3Style.textSize}px ${text3Style.textFont}`;
      let text3Width =  ctx.measureText(text3Content).width;
  
      let totalContentWidth = text1Width+text2Width+text3Width;
      let spaceWidth=(bg.width - totalContentWidth);
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
      drawText(canvas, ctx, text3Content, {
          x:mulTotalWidth +text1Width+text2Width,
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