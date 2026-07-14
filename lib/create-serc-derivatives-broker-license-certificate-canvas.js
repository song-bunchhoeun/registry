import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, limitTextByWidth } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";

export async function createSercDerivativesBrokerLicenceCertificateCanvas(
    certificateInfo = {},
    qrcodeContent
) {
    const MPTC_TEXT_COLORS = {
        black: "#020202",
    };

    const MPTC_FONTS = {
        primary: "Khmer OS Muol Light",
        secondary: "Khmer OS Siemreap",
        thrirdly: "Kh Muol",
    };
    const MPTC_TEMPLATE_IMAGE = "serc-background.jpg";

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
                .split("")
                .map((ch) => khmerNums[ch])
                .join("");
        return `ថ្ងៃទី${toKhmer(y)} ខែ${khmerMonths[m - 1]} ឆ្នាំ${toKhmer(
            d
        )}`;
    }

    let addressKm = _.get(certificateInfo, "recipient.addresskm", "");

    const getTextMaxWidth = (ctx, textItem) => {
        ctx.font = resolveFont(textItem.textFont, textItem.textSize, textItem);
        const targetMatric = ctx.measureText(textItem.text);
        return targetMatric;
    };

    const bg = await createTemplateImage(MPTC_TEMPLATE_IMAGE);
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0);

    const COMPANY_TEXT_MAX_WIDTH_1 = 735;
    const COMPANY_TEXT_MAX_WIDTH_2 = 690;
    const COMPANY_NUMBER_MAX_WIDTH = 425;
    const COMPANY_ADDRESS_MAX_WIDTH = 1800;

    const dotText = {
        dataKeys: [""],
        text: ".",
        textSize: 28.5,
        textFont: MPTC_FONTS.primary,
    };

    const dotCharWidth = getTextMaxWidth(ctx, dotText).width;

    const printDot = (numberOfDot) => {
        let dotStr = "";
        for (let i = 0; i < numberOfDot; i++) {
            dotStr += ".";
        }
        return dotStr;
    };

    let COMPANY = [
        {
            dataKeys: ["certificate.number"],
            text: `លេខ : ${certificateInfo.certificate.number}`,
            textSize: 28.3,
            textFont: MPTC_FONTS.secondary,
        },
        {
            dataKeys: ["recipient.companyKm"],
            text: certificateInfo.recipient.companyKm,
            textSize: 28.5,
            textFont: MPTC_FONTS.primary,
        },
        {
            dataKeys: ["recipient.addresskm"],
            text: `ដែលមានទីស្នាក់ការនៅ${addressKm}។`,
            textSize: 28.5,
            textFont: MPTC_FONTS.secondary,
        },
    ];

    const limitCompanyNumber = limitTextByWidth(
        ctx,
        COMPANY[0],
        COMPANY_NUMBER_MAX_WIDTH
    );

    const limitCompanyName = limitTextByWidth(
        ctx,
        COMPANY[1],
        COMPANY_TEXT_MAX_WIDTH_2
    );

    const limitCompanyAddress = limitTextByWidth(
        ctx,
        COMPANY[2],
        COMPANY_ADDRESS_MAX_WIDTH
    );

    const SERC_TEXTS = [
        {
            dataKeys: [],
            text: `អាជ្ញាបណ្ណ`,
            textSize: 59.7,
            textFont: MPTC_FONTS.thrirdly,
            textColor: MPTC_TEXT_COLORS.black,
            fontWeight: "400",
            x: 1808,
            y: 1094.4,
            align: "center",
        },
        {
            dataKeys: ["certificate.license"],
            text: `${certificateInfo.certificate.license}`,
            textSize: 59.7,
            textFont: MPTC_FONTS.thrirdly,
            textColor: MPTC_TEXT_COLORS.black,
            fontWeight: "400",
            x: 1808,
            y: 1193.7,
            align: "center",
        },
        {
            dataKeys: ["certificate.number"],
            text:  limitCompanyNumber,
            textSize: 28.3,
            textFont: MPTC_FONTS.secondary,
            textColor: MPTC_TEXT_COLORS.black,
            y: 1132,
            x: 1072.5,
            align: "center",
        },
        {
            dataKeys: [],
            text: "ដោយអនុលោមតាមច្បាប់ស្តីពីការបោះផ្សាយ  និងការជួញដូរមូលបត្រមហាជន  និងបទប្បញ្ញត្តិពាក់ព័ន្ធផ្សេងៗ​  និងផ្អែកលើគុណវុឌ្ឍិរបស់ក្រុមហ៊ុន",
            textSize: 30.7,
            textFont: MPTC_FONTS.secondary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 967,
            y: 1274.7,
        },
        {
            dataKeys: [],
            text: `និយ័តករមូលបត្រកម្ពុជា សម្រេច${certificateInfo.certificate.issuedTypeKm}អាជ្ញាបណ្ណជូន `,
            textSize: 28,
            textFont: MPTC_FONTS.secondary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 851,
            y: 1328,
        },
        {
            dataKeys: [],
            text: printDot(COMPANY_TEXT_MAX_WIDTH_1 / dotCharWidth),
            textSize: 28.5,
            textFont: MPTC_FONTS.primary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 1400,
            y: 1328,
        },
        {
            dataKeys: ["recipient.companyKm"],
            text: limitCompanyName,
            textSize: 28.5,
            textFont: MPTC_FONTS.primary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 1769,
            y: 1324,
            align: 'center'
        },
        {
            dataKeys: [],
            text: "ធ្វើជា ",
            textSize: 28,
            textFont: MPTC_FONTS.secondary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 2199.5 - 58,
            y: 1328,
        },
        {
            dataKeys: ["certificate.license"],
            text: `"ឈ្មួញជើងសាឧបករណ៍និស្សន្ទ"`,
            textSize: 29,
            textFont: MPTC_FONTS.primary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 2263 - 58,
            y: 1328,
            align: "left",
        },
        {
            dataKeys: ["recipient.addresskm"],
            text: limitCompanyAddress,
            textSize: 28.5,
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 851,
            y: 1382,
        },
        {
            dataKeys: [],
            text: printDot(COMPANY_TEXT_MAX_WIDTH_2 / dotCharWidth),
            textSize: 28.5,
            textFont: MPTC_FONTS.primary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 950,
            y: 1449.7,
        },
        {
            dataKeys: ["recipient.companyKm"],
            text: limitCompanyName,
            textSize: 28.5,
            textFont: MPTC_FONTS.primary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 950,
            y: 1445,
        },
        {
            dataKeys: [],
            text: `ត្រូវគោរពយ៉ាងម៉ឺងម៉ាត់តាមច្បាប់ស្តីពីការបោះផ្សាយ និងការជួញដូរមូលបត្រមហាជន អនុក្រឹត្យ`,
            textSize: 28,
            textFont: MPTC_FONTS.secondary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 1650,
            y: 1449.7,
        },
        {
            dataKeys: [],
            text: `និងបទប្បញ្ញត្តិ ព្រមទាំងសេចក្ដីណែនាំ និងលក្ខខណ្ឌទាំងឡាយ​ដែលមានជាធរមាន។`,
            textSize: 28,
            textFont: MPTC_FONTS.secondary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 851,
            y: 1504,
        },
        {
            dataKeys: ["certificate.issuedDate", "certificate.expiredDate"],
            text: `អាជ្ញាបណ្ណនេះ  មានសុពលភាពចាប់ពី${convertDateKm(
                certificateInfo.certificate.issuedDate
            )} រហូតដល់${convertDateKm(
                certificateInfo.certificate.expiredDate
            )}។`,
            textSize: 30,
            textFont: MPTC_FONTS.secondary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 950,
            y: 1572,
        },
        {
            dataKeys: ["certificate.directorGeneralSignatureLunarDateKm"],
            text: "{certificate.directorGeneralSignatureLunarDateKm}",
            textSize: 30,
            textStyle: "normal",
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 2189,
            y: 1645.6,
            align: "center",
        },
        {
            dataKeys: ["certificate.directorGeneralSignatureDateKm"],
            text: "{certificate.directorGeneralSignatureDateKm}",
            textSize: 30,
            textStyle: "normal",
            textColor: MPTC_TEXT_COLORS.black,
            textFont: MPTC_FONTS.secondary,
            x: 2189,
            y: 1699,
            align: "center",
        },
        {
            dataKeys: [""],
            text: `អាជ្ញាបណ្ណនេះ ត្រូវដាក់តាំងបង្ហាញជាសាធារណៈគ្រប់ពេលវេលា`,
            textSize: 23,
            textFont: MPTC_FONTS.secondary,
            textColor: MPTC_TEXT_COLORS.black,
            x: 857,
            y: 1984.6,
        },
    ];

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
            textColor: text.textColor || MPTC_TEXT_COLORS.black,
            align: text.align,
            font: resolveFont(MPTC_FONTS.primary, 24, text),
        });
    }

    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 991, 1621, 250);
    } else {
        const qrBlank = await loadImage(
            path.join(process.cwd(), "assets", "qr-bg-v2-sample.png")
        );
        if (qrBlank) {
            ctx.drawImage(qrBlank, 991, 1621, 250, 310);
        }
    }
    return canvas;
}

export async function drawCenterText(
    text1Style = {},
    text1Color,
    text1Content,
    text2Style = {},
    text2Color,
    text2Content,
    y,
    MPTC_FONTS,
    ctx,
    canvas,
    bg
) {
    ctx.font = `${text1Style.textStyle} ${text1Style.textSize}px ${text1Style.textFont}`;
    let text1Width = ctx.measureText(text1Content).width;
    ctx.font = `${text2Style.textStyle} ${text2Style.textSize}px ${text2Style.textFont}`;
    let text2Width = ctx.measureText(text2Content).width;
    let totalContentWidth = text1Width + text2Width;
    let spaceWidth = bg.width - totalContentWidth;

    let mulTotalWidth = spaceWidth / 2;
    drawText(canvas, ctx, text1Content, {
        x: mulTotalWidth,
        y: y,
        textColor: text1Color,
        align: "left",
        font: resolveFont(MPTC_FONTS.secondary, 50, text1Style),
    });

    drawText(canvas, ctx, text2Content, {
        x: mulTotalWidth + text1Width,
        y: y,
        textColor: text2Color,
        align: "left",
        font: resolveFont(MPTC_FONTS.primary, 50, text2Style),
    });
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
