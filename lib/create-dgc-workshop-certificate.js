
import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createDGCWorkshopCertificate(
    certificateInfo = {},
    qrcodeContent
) {
    const DATA = {
        BACKGROUND: {
            pngFilename: "mptc-dgc-certificate-appriciation.png"
        },
        FONTS: [
            { name: "Sitka", filename: "SitkaVF.ttf" },
            { name: "Montserrat", filename: "Montserrat-Light.ttf" },
        ],
    };

    const MPTC_TEXT_COLORS = {
        black: "#2C4B8A",
        pink: "#F72798",
    };

    const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    const pronounce = _.get(certificateInfo, "recipient.pronounce");
    const role = _.get(certificateInfo, "recipient.role");
    const date = _.get(certificateInfo, "certificate.date");

    const EN_TEXTS = [
        {
            dataKeys: ["recipient.name"],
            text: "{recipient.name}",
            textSize: 233,
            textFont: { name: "Sitka" },
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: "bold",
            y: 1330,
            align: "center",
        },
        {
            dataKeys: ["certificate.position"],
            text: `For ${pronounce} contribution and dedication as ${role} during`,
            textSize: 75.9,
            textFont: { name: "Montserrat" },
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: "medium",
            y: 1510,
            align: "center",
            strokeLine: 1.5,
            strokeColor: MPTC_TEXT_COLORS.black,
        },
        {
            dataKeys: ["certificate.course"],
            text: `held on ${date}.`,
            textSize: 75.7,
            textFont: { name: "Montserrat" },
            textColor: MPTC_TEXT_COLORS.black,
            textStyle: "medium",
            y: 1759,
            align: "center",
            strokeLine: 1.5,
            strokeColor: MPTC_TEXT_COLORS.black,
        }
    ];

    DATA.TEXTS = [...EN_TEXTS];

    // Draw Caption
    for (const text of DATA.TEXTS) {
        if (text.length > 0) {
            for (const index in text) {
                const textItem = text[index];
                let lastItem;
                if (index > 0) lastItem = text[index - 1];

                if (!textItem.x) {
                    const lastFont = resolveFont(DATA.FONTS[0].name, 24, lastItem);
                    ctx.font = lastFont;
                    const lastItemMetric = ctx.measureText(lastItem.text);
                    textItem.x = lastItem.x + lastItemMetric.width + textItem.addX;
                }

                if (!textItem.y) textItem.y = lastItem.y;

                drawTextItem(
                    canvas,
                    ctx,
                    textItem,
                    DATA.FONTS[0].name,
                    certificateInfo
                );
            }
        } else drawTextItem(canvas, ctx, text, DATA.FONTS[0].name, certificateInfo);
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 2860, 1769, 427);
    }

    //{ canvas, profileX, profileY, sizeBy }
    return canvas;
}

const drawTextItem = (canvas, ctx, textItem, defaultFont, certificateInfo) => {
    if (textItem.dataKeys && textItem.dataKeys.length > 0) {
        for (const key of textItem.dataKeys)
            textItem.text = textItem.text.replace(
                `{${key}}`,
                _.get(certificateInfo, key, "")
            );
    }

    if (textItem.scale) {
        ctx.strokeStyle = textItem.strokeColor;
        ctx.lineWidth = textItem.strokeLine;
        ctx.fillStyle = textItem.textColor;
        ctx.font = resolveFont(defaultFont, 24, textItem);
        ctx.save(); // Save the current context settings
        ctx.scale(textItem.scale, 1); // Scale horizontally while maintaining vertical scale
        ctx.strokeText(textItem.text, textItem.x / textItem.scale, textItem.y);
        ctx.fillText(textItem.text, textItem.x / textItem.scale, textItem.y); // Divide x position by scale to offset the scaling effect
        ctx.restore();
    } else {
        drawText(canvas, ctx, textItem.text, {
            x: textItem.x,
            y: textItem.y,
            textColor: textItem.textColor || MPTC_TEXT_COLORS.black,
            align: textItem.align,
            font: resolveFont(defaultFont, 24, textItem),
            strokeLine: textItem.strokeLine || 0,
            strokeColor: textItem.strokeColor,
            textMaxWidth: textItem.textMaxWidth,
        });
    }
};

export async function drawQrCodeStandard(
    qrcodeContent,
    ctx,
    x = 0,
    y = 0,
    width = 120
) {
    // ration: 120/148 of QR Standard
    const logoPath = path.join(process.cwd(), "assets", "qr-bg-v2.png");
    const qrcodeLogoImage = await loadImage(logoPath);
    const gapSize = (width * 10) / 120; //
    const qrcodeSize = width - gapSize * 2; // exclude margin x,y
    const height = (width * 148) / 120;
    ctx.drawImage(qrcodeLogoImage, x, y, width, height);
    const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, {
        margin: 0,
        width: qrcodeSize,
    });
    const qrcodeImage = await loadImage(qrcodeBuffer);
    ctx.drawImage(qrcodeImage, x + gapSize, y + gapSize);
}
// 'style size fontName' ex:'bold 20px Arial'
function resolveFont(defaultFont, defaultSize, text) {
    const space = " ";
    let font = "";
    const fontName = text.textFont ? text.textFont.name : defaultFont;

    font += text.textStyle ? text.textStyle + space : "";
    font += text.textSize ? text.textSize : defaultSize;
    font += "px" + space;
    font += fontName;
    return font;
}
