import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import { createTemplateImage, drawText, loadRemoteResource } from './shared';
import QRCode from 'qrcode';
import _, { add } from 'lodash';

export async function createCADTGovTechCertificateCanvas(certificateInfo = {}, qrcodeContent) {
    const MPTC_TEXT_COLORS = {
        black: '#000000',
        blue: '#014283',
        red: '#f00e0e'
    };

    const MPTC_FONTS = {
        primary: 'Kantumruy Pro',
        secondary: 'Kantumruy Pro',
        thirdly: 'Kantumruy Pro',
    };

    // KH2 EN3
    const KH2EN3_cert_name = 'cadt-training-govtech-3EN-blank.png';
    // const KH2EN3_cert_name = 'cadt-training-govtech-3EN.png';
    const KH2EN3_km_name = [1240, 1445];
    const KH2EN3_km_posdept = [1246, 1526];
    const KH2EN3_en_name = [1240, 1981];
    const KH2EN3_en_position = [1250, 2054];
    const KH2EN3_en_posdept = [1256, 2125];
    const KH2EN3_km_date = [1232, 1815];

    // KH3 EN2
    const KH3EN2_cert_name = 'cadt-training-govtech-3KH-blank.png';
    // const KH3EN2_cert_name = 'cadt-training-govtech-3KH.png';
    const KH3EN2_en_name = [1240, 2040];
    const KH3EN2_en_posdept = [1248, 2122];
    const KH3EN2_km_name = [1240, 1415];
    const KH3EN2_km_position = [1240, 1494];
    const KH3EN2_km_posdept = [1245, 1581];
    const KH3EN2_km_date = [1232, 1866];

    // KH2 EN2
    const KH2EN2_cert_name = 'cadt-training-govtech-22-blank.png';
    // const KH2EN2_cert_name = 'cadt-training-govtech-22.png';
    const KH2EN2_km_name = [1240, 1464];
    const KH2EN2_km_postdept = [1241, 1542];
    const KH2EN2_en_name = [1240, 2030];
    const KH2EN2_en_posdept = [1250, 2100];
    const KH2EN2_km_date = [1232, 1821];


    // KH3 EN3
    const KH3EN3_cert_name = 'cadt-training-govtech-33-blank.png';
    // const KH3EN3_cert_name = 'cadt-training-govtech-33.png';
    const KH3EN3_km_name = [1242, 1360];
    const KH3EN3_km_position = [1235, 1444];
    const KH3EN3_km_posdept = [1244, 1527];
    const KH3EN3_en_name = [1240, 1981];
    const KH3EN3_en_position = [1250, 2054];
    const KH3EN3_en_posdept = [1250, 2126];
    const KH3EN3_km_date = [1232, 1813];

    var MPTC_TEMPLATE_IMAGE = '';


    var MPTC_TEXTS = [
        {
            dataKeys: ['certificate.date'],
            text: '{certificate.date}',
            textSize: 45,
            textStyle: 'thin',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_TEXT_COLORS.primary,
            x: 1258,
            y: 2422,
            // y: 2500,
            align: 'center'
        },
        {
            dataKeys: ['certificate.signatureLunarDate'],
            text: '{certificate.signatureLunarDate}',
            textSize: 50,
            textStyle: 'thin',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_TEXT_COLORS.primary,
            x: 1240,
            y: 2534,
            align: 'center'
        },
        {
            dataKeys: ['certificate.signatureDate'],
            text: '{certificate.signatureDate}',
            textSize: 50,
            textStyle: 'thin',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_TEXT_COLORS.primary,
            x: 1240,
            y: 2628,
            align: 'center'
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: '{certificate.signatureDateKm}',
            textSize: 50,
            textStyle: 'thin',
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_TEXT_COLORS.primary,
            x: 1240,
            y: 2726,
            align: 'center'
        },
    ];

    var addon_arr = [];


    if (!certificateInfo.recipient.department && !certificateInfo.recipient.departmentKm === false) {
        MPTC_TEMPLATE_IMAGE = KH3EN2_cert_name;
        addon_arr = [
            new_mptc_arr(
                'recipient.nameKm',
                '{recipient.nameKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN2_km_name[0],
                KH3EN2_km_name[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.positionKm',
                '{recipient.positionKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN2_km_position[0],
                KH3EN2_km_position[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.departmentKm',
                '{recipient.departmentKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN2_km_posdept[0],
                KH3EN2_km_posdept[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.name',
                '{recipient.name}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN2_en_name[0],
                KH3EN2_en_name[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.position',
                '{recipient.position}',
                50,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN2_en_posdept[0],
                KH3EN2_en_posdept[1],
                'center'
            ),
            new_mptc_arr(
                'certificate.dateKm',
                '{certificate.dateKm}',
                54,
                'thin',
                MPTC_TEXT_COLORS.black,
                MPTC_TEXT_COLORS.primary,
                KH3EN2_km_date[0],
                KH3EN2_km_date[1],
                'center'
            )
        ]
    }
    else if (!certificateInfo.recipient.department === false && !certificateInfo.recipient.departmentKm) {
        MPTC_TEMPLATE_IMAGE = KH2EN3_cert_name;
        addon_arr = [
            new_mptc_arr(
                'recipient.nameKm',
                '{recipient.nameKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN3_km_name[0],
                KH2EN3_km_name[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.positionKm',
                '{recipient.positionKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN3_km_posdept[0],
                KH2EN3_km_posdept[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.name',
                '{recipient.name}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN3_en_name[0],
                KH2EN3_en_name[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.position',
                '{recipient.position}',
                50,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN3_en_position[0],
                KH2EN3_en_position[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.department',
                '{recipient.department}',
                50,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN3_en_posdept[0],
                KH2EN3_en_posdept[1],
                'center'
            ),
            new_mptc_arr(
                'certificate.dateKm',
                '{certificate.dateKm}',
                54,
                'thin',
                MPTC_TEXT_COLORS.black,
                MPTC_TEXT_COLORS.primary,
                KH2EN3_km_date[0],
                KH2EN3_km_date[1],
                'center'
            )
        ]
    }
    else if (certificateInfo.recipient.department && certificateInfo.recipient.departmentKm) {
        MPTC_TEMPLATE_IMAGE = KH3EN3_cert_name;
        addon_arr = [
            new_mptc_arr(
                'recipient.nameKm',
                '{recipient.nameKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN3_km_name[0],
                KH3EN3_km_name[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.positionKm',
                '{recipient.positionKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN3_km_position[0],
                KH3EN3_km_position[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.departmentKm',
                '{recipient.departmentKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN3_km_posdept[0],
                KH3EN3_km_posdept[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.name',
                '{recipient.name}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN3_en_name[0],
                KH3EN3_en_name[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.position',
                '{recipient.position}',
                50,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN3_en_position[0],
                KH3EN3_en_position[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.department',
                '{recipient.department}',
                50,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH3EN3_en_posdept[0],
                KH3EN3_en_posdept[1],
                'center'
            ),
            new_mptc_arr(
                'certificate.dateKm',
                '{certificate.dateKm}',
                54,
                'thin',
                MPTC_TEXT_COLORS.black,
                MPTC_TEXT_COLORS.primary,
                KH3EN3_km_date[0],
                KH3EN3_km_date[1],
                'center'
            )
        ]
    }
    else {
        MPTC_TEMPLATE_IMAGE = KH2EN2_cert_name;
        addon_arr = [
            new_mptc_arr(
                'recipient.nameKm',
                '{recipient.nameKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN2_km_name[0],
                KH2EN2_km_name[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.positionKm',
                '{recipient.positionKm}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN2_km_postdept[0],
                KH2EN2_km_postdept[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.name',
                '{recipient.name}',
                54,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN2_en_name[0],
                KH2EN2_en_name[1],
                'center'
            ),
            new_mptc_arr(
                'recipient.position',
                '{recipient.position}',
                50,
                'bold',
                MPTC_TEXT_COLORS.blue,
                MPTC_TEXT_COLORS.primary,
                KH2EN2_en_posdept[0],
                KH2EN2_en_posdept[1],
                'center'
            ),
            new_mptc_arr(
                'certificate.dateKm',
                '{certificate.dateKm}',
                54,
                'thin',
                MPTC_TEXT_COLORS.black,
                MPTC_TEXT_COLORS.primary,
                KH2EN2_km_date[0],
                KH2EN2_km_date[1],
                'center'
            ),
        ]
    }

    MPTC_TEXTS = MPTC_TEXTS.concat(addon_arr);

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    // draw Issue Date
    let splitIssueDate = "";
    splitIssueDate = certificateInfo.certificate.issueDateKm?.split(" ");
    let textYear = {
        textSize: 21,
        textStyle: 'nomal',
        textFont: MPTC_FONTS.secondary
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
        await drawQrCodeStandard(qrcodeContent, ctx, 2000, 2974, 269);
    }

    // draw profile photo
    if (certificateInfo.recipient.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
        if (profileImage) {
            const maxImgBoxWidth = 158;
            const maxImgBoxHeight = 209;

            // get the scale
            // it is the min of the 2 ratios
            let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

            // Lets get the new width and height based on the scale factor
            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;

            // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 669
            const profileY = 646;
            ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
        }
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

function new_mptc_arr(key, val, size, style, color, font, x_axis, y_axis, alignment) {
    // val = '}'
    return {
        dataKeys: [key],
        text: val,
        textSize: size,
        textStyle: style,
        textColor: color,
        textFont: font,
        x: x_axis,
        y: y_axis,
        align: alignment
    }
}