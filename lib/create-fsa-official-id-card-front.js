import { createCanvas, loadImage } from '@napi-rs/canvas';
import path from 'node:path';
import {
    createTemplateImage,
    drawText,
    drawWrapTexts,
    loadRemoteResource,
    drawPreview
} from './shared';
import QRCode from 'qrcode';
import _ from 'lodash';

export async function createFSAOfficialIDCardFront(
    certificateInfo = {},
    qrcodeContent,
    preview,
) {
    const FSA_TEXT_COLORS = {
        black: '#000000'
    };

    const FSA_FONTS = {
        khmerMEF2: 'Khmer MEF2',
        khmerOSSiemReap: 'Khmer OS Siemreap',
        siemReap: 'Siemreap'
    };

    const FSA_TEMPLATE_IMAGE = 'fsa-official-id-card-front.jpg';

    let NAME_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: certificateInfo.recipient.nameKm,
            textSize: 87,
            textFont: FSA_FONTS.khmerMEF2,
        },
        {
            dataKeys: ['recipient.name'],
            text: certificateInfo.recipient.name,
            textSize: 90,
            textFont: FSA_FONTS.khmerMEF2,
        },
    ]

    let FSA_TEXTS = [
        {
            dataKeys: ['recipient.dateOfBirthKm'],
            text: '{recipient.dateOfBirthKm}',
            textSize: 81,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.khmerOSSiemReap,
            x: 870,
            y: 471.6,
        },
        {
            dataKeys: ['recipient.gender'],
            text: `${certificateInfo.recipient.gender === 'M' ? 'ប្រុស' : 'ស្រី'}`,
            textSize: 81,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.siemReap,
            x: 1980,
            y: 471.6,
        },
        {
            dataKeys: ['certificate.organizationKm'],
            text: '{certificate.organizationKm}',
            textSize: 81,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.khmerMEF2,
            x: 870,
            y: 909,
        },
        {
            dataKeys: ['certificate.roleKm'],
            text: '{certificate.roleKm}',
            textSize: 81,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.siemReap,
            x: 870,
            y: 1200.6,
        },
        {
            dataKeys: ['certificate.signatureDateKm'],
            text: '{certificate.signatureDateKm}',
            textSize: 72,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.siemReap,
            x: 2346,
            y: 1200.6 + 180,
            align: 'center'
        },
        {
            dataKeys: ['certificate.expiryDateKm'],
            text: '{certificate.expiryDateKm}',
            textSize: 60,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.siemReap,
            x: 390,
            y: 1806,
            strokeLine: 1.5,
            strokeColor: FSA_TEXT_COLORS.black,
            align: 'center'
        },
    ];

    let DEPARTMENT_TEXTS = [
        {
            dataKeys: ['certificate.departmentKm'],
            text: certificateInfo.certificate.departmentKm,
            textSize: 81,
            textFont: FSA_FONTS.siemReap,
        },
    ]

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(FSA_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bg, 0, 0);

    const adjustFontSize = (ctx, dataItem, textMaxWidth) => {
        let fontSize = dataItem.textSize;
        let getTextWidth = getTextMaxWidth(ctx, {
            ...dataItem,
            textSize: fontSize,
        });
        while (getTextWidth.width > textMaxWidth && fontSize > 0) {
            fontSize -= 0.1;
            getTextWidth = getTextMaxWidth(ctx, {
                ...dataItem,
                textSize: fontSize,
            });
        }
        return fontSize;
    };

    const departmentFontSize = adjustFontSize(ctx, DEPARTMENT_TEXTS[0], 2025)
    const nameKmFontSize = adjustFontSize(ctx, NAME_TEXTS[0], 1740)
    const nameFontSize = adjustFontSize(ctx, NAME_TEXTS[1], 1740)

    DEPARTMENT_TEXTS = [
        {
            dataKeys: ['certificate.departmentKm'],
            text: certificateInfo.certificate.departmentKm,
            textSize: departmentFontSize,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.siemReap,
            x: 870,
            y: 1054.8,
            align: 'left'
        }
    ]

    NAME_TEXTS = [
        {
            dataKeys: ['recipient.nameKm'],
            text: '{recipient.nameKm}',
            textSize: nameKmFontSize,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.khmerMEF2,
            x: 870,
            y: 180,
        },
        {
            dataKeys: ['recipient.name'],
            text: '{recipient.name}',
            textSize: nameFontSize,
            textColor: FSA_TEXT_COLORS.black,
            textFont: FSA_FONTS.khmerMEF2,
            x: 870,
            y: 325.8,
        },
    ]

    drawWrapTexts(ctx, {
        top: 617.4,
        left: 870,
        width: 2090,
        textAlignment: 'left',
        lineHeight: 1.8,
        spans: [
            {
                dataKeys: ["recipient.addressKm"],
                text: certificateInfo.recipient.addressKm,
                fontSize: 81,
                fontFamily: FSA_FONTS.siemReap,
                fillStyle: FSA_TEXT_COLORS.black,
            },
        ]
    }).draw()

    FSA_TEXTS = [...FSA_TEXTS, ...DEPARTMENT_TEXTS, ...NAME_TEXTS];

    // Draw Caption

    for (const text of FSA_TEXTS) {
        if (text.dataKeys && text.dataKeys.length > 0) {
            for (const key of text.dataKeys)
                text.text = text.text.replace(
                    `{${key}}`,
                    _.get(certificateInfo, key, "")
                );
        }

        drawText(canvas, ctx, text.text, {
            x: text.x,
            y: text.y,
            textColor: text.textColor || FSA_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(FSA_FONTS, 24, text),
            strokeLine: text.strokeLine,
            strokeColor: text.strokeColor
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 979.5, 1350, 375);
    } else {
        const qrBlank = await loadImage(
            path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
        );
        if (qrBlank) {
            ctx.drawImage(qrBlank, 979.5, 1350, 375, 462.48);
        }
    }

    // draw profile photo
    if (certificateInfo.recipient.photoBase64) {
        const profileImage = await loadRemoteResource(
            certificateInfo.recipient.photoBase64
        );

        if (profileImage && profileImage.width && profileImage.height) {
            const maxImgBoxWidth = 348;
            const maxImgBoxHeight = 438;

            const scale_factor = Math.max(
                maxImgBoxWidth / profileImage.width,
                maxImgBoxHeight / profileImage.height
            );

            const newWidth = profileImage.width * scale_factor;
            const newHeight = profileImage.height * scale_factor;

            const boxStartX = 2635.8;
            const boxStartY = 45;

            const offsetX = (maxImgBoxWidth - newWidth) / 2;
            const offsetY = (maxImgBoxHeight - newHeight) / 2;

            ctx.save();

            ctx.beginPath();
            ctx.rect(boxStartX, boxStartY, maxImgBoxWidth, maxImgBoxHeight);
            ctx.clip();

            ctx.drawImage(
                profileImage,
                Math.round(boxStartX + offsetX),
                Math.round(boxStartY + offsetY),
                Math.round(newWidth),
                Math.round(newHeight)
            );

            ctx.restore();
        }
    }


    if (preview === true || preview === "true") {
        drawPreview(canvas, ctx, {
            color: "#C0C0C0",
            text: "Preview",
            fontSize: 304,
            fontFamily: certificateInfo.previewFontFamily,
        });
    }
    return canvas;
}
export async function drawQrCodeStandard(
    qrcodeContent,
    ctx,
    x = 0,
    y = 0,
    width = 120
) {
    // ration: 120/148 of QR Standard
    const logoPath = path.join(process.cwd(), 'assets', 'qr-bg-v2.png');
    const qrcodeLogoImage = await loadImage(logoPath);
    const gapSize = (width * 10) / 120; //
    const qrcodeSize = width - gapSize * 2; // exclude margin x,y
    const height = (width * 148) / 120;
    ctx.drawImage(qrcodeLogoImage, x, y, width, height);
    const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, {
        margin: 0,
        width: qrcodeSize
    });
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
