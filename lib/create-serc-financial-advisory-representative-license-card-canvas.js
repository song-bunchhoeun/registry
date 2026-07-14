import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createSERCFinancialAdvisoryRepresentativeLicenseCardCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const SERC_TEXT_COLORS = {
        blue: "#001878",
    };

    const SERC_FONTS = {
        muol: "Khmer Muol",
        time: "Times New Roman",
        battambang: "Kh Battambang",
    };

    const SERC_TEMPLATE_IMAGE = "serc-dr-card.jpg";
    const genderKm =
        _.get(certificateInfo, "recipient.gender", "") === "Female"
            ? "ស្រី"
            : "ប្រុស";

    function convertDateKm(dateStr) {
        const khmerNums = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
        const khmerMonths = [
            "មករា",
            "កុម្ភៈ",
            "មីនា",
            "មេសា",
            "ឧសភា",
            "មិថុនា",
            "កក្កដា",
            "សីហា",
            "កញ្ញា",
            "តុលា",
            "វិច្ឆិកា",
            "ធ្នូ",
        ];
        const [d, m, y] = dateStr.split("-");
        const toKhmer = (n) =>
            n
                .toString()
                .split("")
                .map((ch) => khmerNums[ch])
                .join("");
        return `${toKhmer(parseInt(y))} ${
            khmerMonths[parseInt(m) - 1]
        } ${toKhmer(parseInt(d))}`;
    }

    function convertDateEn(dateStr) {
        const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const [d, m, y] = dateStr.split("-");
        const toEnglish = (n) =>
            n
                .toString()
                .split("")
                .map((ch) => nums[ch])
                .join("");
        return `${toEnglish(parseInt(y))} ${
            months[parseInt(m) - 1]
        } ${toEnglish(parseInt(d))}`;
    }

    let SERC_TEXTS = [
        {
            dataKeys: ["certificate.companyKm"],
            text: certificateInfo.certificate.companyKm,
            textSize: 55,
            textFont: SERC_FONTS.muol,
        },
        {
            dataKeys: ["certificate.company"],
            text: certificateInfo.certificate.company,
            textSize: 55,
            textFont: SERC_FONTS.time,
        },
        {
            dataKeys: ["recipient.nameKm", "recipient.name"],
            text:
                certificateInfo.recipient.nameKm +
                " / " +
                certificateInfo.recipient.name,
            textSize: 52,
            textFont: SERC_FONTS.muol,
        },
        {
            dataKeys: ["certificate.number"],
            text: certificateInfo.certificate.number,
            textSize: 40,
            textFont: SERC_FONTS.battambang,
        },
        {
            dataKeys: ["recipient.gender"],
            text: `${genderKm} / ${certificateInfo.recipient.gender}`,
            textSize: 43,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            x: 790,
            y: 1079,
        },
        {
            dataKeys: ["recipient.dateOfBirth"],
            text:
                convertDateKm(certificateInfo.recipient.dateOfBirth) +
                " / " +
                convertDateEn(certificateInfo.recipient.dateOfBirth),
            textSize: 42,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            x: 790,
            y: 1162.6,
        },
        {
            dataKeys: ["certificate.validUntil"],
            text:
                convertDateKm(certificateInfo.certificate.validUntil) +
                " / " +
                convertDateEn(certificateInfo.certificate.validUntil),
            textSize: 41,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            x: 790,
            y: 1245,
        },
        {
            dataKeys: [
                "certificate.officeAddressKm",
                "certificate.officeAddress",
            ],
            text: `${certificateInfo.certificate.officeAddressKm} / ${certificateInfo.certificate.officeAddress}`,
            textSize: 42,
            textFont: SERC_FONTS.battambang,
        },
        {
            dataKeys: ["certificate.directorGeneralSignatureLunarDateKm"],
            text: "{certificate.directorGeneralSignatureLunarDateKm}",
            textSize: 37.5,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            align: "center",
            x: 959.4,
            y: 1406,
        },
        {
            dataKeys: ["certificate.directorGeneralSignatureDateKm"],
            text: "{certificate.directorGeneralSignatureDateKm}",
            textSize: 37,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            align: "center",
            x: 959.4,
            y: 1476.3,
        },
    ];

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(SERC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
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

    const companyKmFontSize = adjustFontSize(ctx, SERC_TEXTS[0], 1400);
    const companyFontSize = adjustFontSize(ctx, SERC_TEXTS[1], 1400);
    const nameFontSize = adjustFontSize(ctx, SERC_TEXTS[2], 657);
    const numberFontSize = adjustFontSize(ctx, SERC_TEXTS[3], 657);
    const officeFontSize = adjustFontSize(ctx, SERC_TEXTS[7], 657);

    SERC_TEXTS = [
        {
            dataKeys: ["certificate.companyKm"],
            text: "{certificate.companyKm}",
            textSize: companyKmFontSize,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.muol,
            y: 698,
            align: "center",
        },
        {
            dataKeys: ["certificate.company"],
            text: "{certificate.company}",
            textSize: companyFontSize,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.time,
            y: 795.5,
            align: "center",
        },
        {
            dataKeys: ["recipient.nameKm", "recipient.name"],
            text: "{recipient.nameKm} / {recipient.name}",
            textSize: nameFontSize,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.muol,
            x: 790,
            y: 912.6,
        },
        {
            dataKeys: ["certificate.number"],
            text: "{certificate.number}",
            textSize: numberFontSize,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            x: 790,
            y: 996,
        },
        {
            dataKeys: ["recipient.gender"],
            text: `${genderKm} / {recipient.gender}`,
            textSize: 43,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            x: 790,
            y: 1079,
        },
        {
            dataKeys: ["recipient.dateOfBirth"],
            text:
                convertDateKm(certificateInfo.recipient.dateOfBirth) +
                " / " +
                convertDateEn(certificateInfo.recipient.dateOfBirth),
            textSize: 42,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            x: 790,
            y: 1162.6,
        },
        {
            dataKeys: ["certificate.validUntil"],
            text:
                convertDateKm(certificateInfo.certificate.validUntil) +
                " / " +
                convertDateEn(certificateInfo.certificate.validUntil),
            textSize: 41,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            x: 790,
            y: 1245,
        },
        {
            dataKeys: [
                "certificate.officeAddressKm",
                "certificate.officeAddress",
            ],
            text: "{certificate.officeAddressKm} / {certificate.officeAddress}",
            textSize: officeFontSize,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            x: 790,
            y: 1329,
        },
        {
            dataKeys: ["certificate.directorGeneralSignatureLunarDateKm"],
            text: "{certificate.directorGeneralSignatureLunarDateKm}",
            textSize: 37.5,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            align: "center",
            x: 959.4,
            y: 1406,
        },
        {
            dataKeys: ["certificate.directorGeneralSignatureDateKm"],
            text: "{certificate.directorGeneralSignatureDateKm}",
            textSize: 37,
            textColor: SERC_TEXT_COLORS.blue,
            textFont: SERC_FONTS.battambang,
            align: "center",
            x: 959.4,
            y: 1476.3,
        },
    ];

    // Draw Caption
    for (const text of SERC_TEXTS) {
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
            textColor: text.textColor || SERC_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(SERC_FONTS.muol, 24, text),
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 412.4, 2663.5, 677);
    } else {
        const qrBlank = await loadImage(
            path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
        );
        if (qrBlank) {
            ctx.drawImage(qrBlank, 412.4, 2663.5, 677, 835);
        }
    }
    if (certificateInfo.recipient.photoBase64) {
        const profileImage = await loadRemoteResource(
            certificateInfo.recipient.photoBase64
        );
        if (profileImage) {
            const maxImgBoxWidth = 530;
            const maxImgBoxHeight = 530;

            let scale_factor = Math.min(
                maxImgBoxWidth / profileImage.width,
                maxImgBoxHeight / profileImage.height
            );

            let newWidth = profileImage.width * scale_factor;
            let newHeight = profileImage.height * scale_factor;
            const profileX = 62.8;
            const profileY = 1468;
            ctx.drawImage(
                profileImage,
                profileX,
                profileY,
                newWidth,
                newHeight
            );
        }
    }

    const stampEmboss = await loadImage(
        path.join(process.cwd(), "assets", "serc-stamp.png")
    );
    if (stampEmboss) {
        ctx.drawImage(stampEmboss, 430, 1545.8, 500, 500);
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
export async function createQRCodeLogoImage() {
    const logoPath = path.join(
        process.cwd(),
        "assets",
        "certificate-bacii-qrcode-logo.png"
    );
    return loadImage(logoPath);
}
// 'style size fontName' ex:'bold 20px Arial'
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
