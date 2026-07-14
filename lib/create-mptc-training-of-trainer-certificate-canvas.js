import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import { drawWrapTexts } from "./shared";

export async function createMptcTrainingOfTrainerCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        black: "#050708",
        blue: "#164582",
    };

    const MPTC_FONTS = {
        khmerOsMoulLight: "Khmer OS Muol Light",
        nidaSowannaphum: "NiDA Sowannaphum",
        googleSans: "Google Sans",
        googleSansMedium: "Google Sans Medium",
        niradei: "Niradei",
    };
    const MPTC_TEMPLATE_IMAGE = "Certificate-of-Training-of-Trainer-sign.jpg";

    let MPTC_TEXTS = [
        {
            dataKeys: ["recipient.nameKm"],
            text: "{recipient.nameKm}",
            textSize: 50,
            textStyle: "nomal",
            textColor: MPTC_TEXT_COLORS.blue,
            y: 1557.5,
            align: "center",
            textFont: MPTC_FONTS.khmerOsMoulLight,
            strokeLine: 0.1,
        },

        {
            dataKeys: ["recipient.name"],
            text: "{recipient.name}",
            textSize: 50,
            textColor: MPTC_TEXT_COLORS.blue,
            y: 2050,
            align: "center",
            textStyle: "bold",
            textFont: MPTC_FONTS.googleSans,
            strokeLine: 0.1,
        },
    ];

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    for (const text of MPTC_TEXTS) {
        if (text.length > 0) {
            for (const index in text) {
                const textItem = text[index];
                let lastItem;
                if (index > 0) lastItem = text[index - 1];

                if (!textItem.x) {
                    const lastFont = resolveFont(
                        MPTC_FONTS.khmerOsMoulLight,
                        24,
                        lastItem
                    );
                    ctx.font = lastFont;
                    const lastItemMetric = ctx.measureText(lastItem.text);
                    textItem.x =
                        lastItem.x + lastItemMetric.width + textItem.addX;
                }

                if (!textItem.y) textItem.y = lastItem.y;

                drawTextItem(
                    canvas,
                    ctx,
                    textItem,
                    MPTC_FONTS.khmerOsMoulLight,
                    certificateInfo
                );
            }
        } else
            drawTextItem(
                canvas,
                ctx,
                text,
                MPTC_FONTS.khmerOsMoulLight,
                certificateInfo
            );
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1923, 2881, 320);
    }
    return canvas;
}

const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
    if (textItem.dataKeys && textItem.dataKeys.length > 0) {
        for (const key of textItem.dataKeys)
            textItem.text = textItem.text.replace(
                `{${key}}`,
                _.get(certificateInfo, key, "")
            );
    }

    drawText(canvas, ctx, textItem.text, {
        x: textItem.x,
        y: textItem.y,
        textColor: textItem.textColor || "#0033ff",
        align: textItem.align,
        font: resolveFont(FONTS[0].name, 24, textItem),
        strokeLine: textItem.strokeLine,
        strokeColor: textItem.textColor,
        textMaxWidth: textItem.textMaxWidth,
        textWidth: textItem.textWidth,
    });
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
function resolveFont(defaultFont, defaultSize, text) {
    const space = " ";
    let font = "";
    const fontName = text.textFont ? text.textFont : defaultFont;

    font += text.textStyle ? text.textStyle + space : "";
    font += text.textSize ? text.textSize : defaultSize;
    font += "px" + space;
    font += fontName;

    return font;
}
