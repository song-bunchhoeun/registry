import { createCanvas, loadImage } from '@napi-rs/canvas';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { createTemplateImage, drawText, drawTexts, loadRemoteResource } from './shared.js';
import path from 'path';

export async function createBacIICanvas2023(certificateInfo = {}, qrcodeContent) {
    // this font names will be used across canvas
    const fontConfig = {
        primary: 'Khmer OS System',
        secondary: 'Khmer OS Muol Light',
        arial: 'Arial',
        limonR1: 'Limon R1', // muol
        limonS1: 'Limon S1', // normal
    };

    function font(name = fontConfig.primary, size = 20) {
        if (name === fontConfig.secondary) {
            return `${size}px ${name}, sans-serif`;
        }
        return `bold ${size}px ${name}, sans-serif`;
    }

    const colors = {
        blue: '#2f3699',
        black: 'black',
        magenta: '#ff00ff',
        green: '#008000',
        red: '#ff0000',
    };

    // color for each grade
    const gradeColors = {
        F: '#000000',
        E: '#0000ff',
        D: '#008000',
        C: '#800000',
        B: '#ff00ff',
        A: '#ff0000',
    };

    const templateImage = await createTemplateImage('certificate-bacii-stamp-2023-v2.png');

    // canvas size is based on template's size
    const canvas = createCanvas(templateImage.width, templateImage.height);

    // draw background image
    const ctx = canvas.getContext('2d');
    ctx.drawImage(templateImage, 0, 0);

    // certificate number
    drawTexts(
        canvas,
        ctx,
        {
            y: 347,
            x: 251,
            gap: 14,
            align: 'center',
        },
        {
            text: 'លេខ',
            font: font(fontConfig.primary, 24),
            textColor: colors.blue,
        },
        {
            text: certificateInfo.id,
            font: font(fontConfig.primary, 24),
            textColor: colors.black,
        },
        {
            text: 'កប្រឡ',
            font: font(fontConfig.primary, 24),
            textColor: colors.blue,
        }
    );

    // candidate name
    if (certificateInfo.nameAlt) {
        drawText(canvas, ctx, certificateInfo.nameAlt, {
            textColor: colors.magenta,
            font: resolveFont(fontConfig.limonR1, 25, {
                textSize: 34 + 30,
                textFont: fontConfig.limonR1,
            }),
            y: 611,
            x: 753,
            align: 'center',
        });
    } else {
        drawText(canvas, ctx, certificateInfo.name, {
            textColor: colors.magenta,
            font: font(fontConfig.secondary, 34),
            y: 611,
            x: 753,
            align: 'center',
        });
    }

    // father name
    if (certificateInfo.fatherNameAlt) {
        drawText(canvas, ctx, certificateInfo.fatherNameAlt, {
            textColor: colors.black,
            font: resolveFont(fontConfig.limonS1, 25, {
                textSize: 25 + 28,
                textFont: fontConfig.limonS1,
            }),
            y: 730,
            x: 662,
            align: 'center',
            strokeLine: 0.8,
            strokeColor: colors.black,
        });
    } else {
        drawText(canvas, ctx, certificateInfo.fatherName, {
            textColor: colors.black,
            font: font(fontConfig.primary, 25),
            y: 730,
            x: 662,
            align: 'center',
        });
    }

    // mother name
    if (certificateInfo.motherNameAlt) {
        drawText(canvas, ctx, certificateInfo.motherNameAlt, {
            textColor: colors.black,
            font: resolveFont(fontConfig.limonS1, 25, {
                textSize: 25 + 28,
                textFont: fontConfig.limonS1,
            }),
            y: 730,
            x: 1052,
            align: 'center',
            strokeLine: 0.8,
            strokeColor: colors.black,
        });
    } else {
        drawText(canvas, ctx, certificateInfo.motherName, {
            textColor: colors.black,
            font: font(fontConfig.primary, 25),
            y: 730,
            x: 1052,
            align: 'center',
        });
    }

    // candidate gender
    drawText(canvas, ctx, certificateInfo.gender, {
        textColor: colors.black,
        font: font(fontConfig.primary, 25),
        y: 612,
        x: 1080,
    });

    // candidate date of birth
    drawText(canvas, ctx, certificateInfo.dateOfBirth, {
        textColor: colors.black,
        font: font(fontConfig.primary, 25),
        y: 675,
        x: 715,
        align: 'center',
    });

    // candidate place of birth
    drawText(canvas, ctx, certificateInfo.placeOfBirth, {
        textColor: colors.black,
        font: font(fontConfig.primary, 25),
        y: 675,
        x: 909,
        align: 'left',
    });

    // exam date
    drawText(canvas, ctx, certificateInfo.examDate, {
        textColor: colors.green,
        font: font(fontConfig.secondary, 24),
        y: 844,
        x: 751,
        align: 'left',
    });

    // exam center
    drawText(canvas, ctx, certificateInfo.centerName, {
        textColor: colors.green,
        font: font(fontConfig.secondary, 24),
        x: 950,
        y: 904,
        align: 'left',
    });

    // exam program
    drawText(canvas, ctx, certificateInfo.program, {
        textColor: colors.black,
        font: font(fontConfig.secondary, 24),
        x: 486,
        y: 905,
        align: 'left',
    });

    // exam information
    const textFontSize = 24;
    const valueFontSize = 28;

    drawTexts(
        canvas,
        ctx,
        {
            align: 'left',
            gap: 14,
            x: 418,
            y: 970,
        },
        {
            text: 'លេខបន្ទប់ ៖',
            font: font(fontConfig.primary, textFontSize),
            textColor: colors.black,
        },
        {
            text: certificateInfo.room,
            font: font(fontConfig.arial, valueFontSize, true),
            textColor: colors.green,
        },
        {
            text: 'លេខតុ ៖',
            font: font(fontConfig.primary, textFontSize),
            textColor: colors.black,
        },

        {
            text: certificateInfo.seat,
            font: font(fontConfig.arial, valueFontSize, true),
            textColor: colors.green,
        },
        {
            text: 'និទ្ទេសពិន្ទុសរុប៖',
            font: font(fontConfig.secondary, textFontSize),
            textColor: colors.black,
        },
        {
            text: certificateInfo.grade,
            font: font(fontConfig.arial, valueFontSize, true),
            textColor: gradeColors[certificateInfo.grade],
        },
        {
            text: 'លំដាប់ពិន្ទុសរុប៖',
            font: font(fontConfig.secondary, textFontSize),
            textColor: colors.black,
        },
        {
            text: certificateInfo.rank,
            font: font(fontConfig.arial, valueFontSize, true),
            textColor: colors.red,
        }
    );

    // exam subjects
    const subjects = certificateInfo.grades;
    for (let i = 0; i < subjects.length + 2; i++) {
        if (i < 2) continue;
        const row = Math.floor(i / 3);
        const col = i % 3;
        const { id, grade } = subjects[i - 2];

        const gapX = 310 * col;
        const gapY = 53 * row;

        drawText(canvas, ctx, id, {
            textColor: colors.black,
            font: font(fontConfig.primary, 25),
            x: 424 + gapX,
            y: 1030 + gapY,
        });

        drawText(canvas, ctx, grade, {
            textColor: gradeColors[grade] || colors.black,
            font: font(fontConfig.arial, 28, true),
            x: 690 + gapX,
            y: 1030 + gapY,
        });
    }

    // barcode & metadata
    if (certificateInfo.barcode && certificateInfo.metadata) {
        drawBarcode(canvas, ctx, certificateInfo.barcode, certificateInfo.metadata, {
            color: colors.black,
            metadataFont: font(fontConfig.arial, 12, true),
            labelFont: font(fontConfig.arial, 20, true),
        });
    }

    // qrcode
    /* if (qrcodeContent) {
        const qrcodeSize = 220;
        const gapSize = 38;
        const qrcodeBuffer = await QRCode.toBuffer(qrcodeContent, { margin: 0, width: qrcodeSize });
        const qrcodeImage = await loadImage(qrcodeBuffer);
        const qrcodeCoordinate = [1035, 1630];

        ctx.drawImage(qrcodeImage, qrcodeCoordinate[0], qrcodeCoordinate[1]);

        const qrcodeTexts = ['សូមស្កេនដើម្បី', 'ផ្ទៀងផ្ទាត់ភាពត្រឹមត្រូវ', 'https://www.verify.gov.kh'];

        const qrcodeY = qrcodeCoordinate[1] + qrcodeSize - gapSize * (qrcodeTexts.length - 1);
        for (let i = qrcodeTexts.length - 1; i >= 0; i--) {
            drawText(canvas, ctx, qrcodeTexts[i], {
                font: font(fontConfig.primary, 22, true),
                textColor: colors.black,
                align: 'right',
                margin: 425,
                y: qrcodeY + i * gapSize,
            });
        }
    } */
    if (qrcodeContent) {
        await drawQrCodeStandard(qrcodeContent, ctx, 1035, 1630, 220);
    }

    // draw profile photo
    if (certificateInfo.photoUrl) {
        const profileImage = await loadRemoteResource(certificateInfo.photoUrl);
        if (profileImage) {
            const profileMaxWidth = 253;
            const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
            const profileX = 124;
            const profileY = 622;
            ctx.drawImage(profileImage, profileX, profileY, profileMaxWidth, profileHeight);

            if (certificateInfo.originalPhotoPath) {
                const photoLabelX = profileX;
                const photoLabelY = profileY + profileHeight;

                drawText(canvas, ctx, certificateInfo.originalPhotoPath, {
                    textColor: colors.blue,
                    x: photoLabelX,
                    y: photoLabelY + 8,
                    font: `bold 11px Arial, sans-serif`,
                    align: 'left',
                });
            }
        }
    }

    return canvas;
}

export function drawBarcode(canvas, ctx, value, metadata, options) {
    if (!value) return;

    const c = createCanvas(100, 100);

    JsBarcode(c, value, {
        height: 25,
        displayValue: false,
        margin: 0,
        lineColor: 'black',
        background: 'white',
        format: 'CODE39', // CODE39 output image size is larger than CODE128.
    });

    ctx.drawImage(c, 106, 1774, 455, c.height);

    // draw value
    drawText(canvas, ctx, value, {
        textColor: options.labelColor,
        align: 'center',
        font: options.labelFont,
        x: 300,
        y: 1830,
    });

    if (metadata) {
        // draw certificate metadata
        drawText(canvas, ctx, metadata, {
            textColor: options.labelColor,
            align: 'center',
            font: options.metadataFont,
            x: 300,
            y: 1768,
        });
    }

    return {
        x: 50,
        y: 1770,
        width: c.width,
        height: c.height,
    };
}

export async function drawQrCodeStandard(qrcodeContent, ctx, x = 0, y = 0, width = 120) {
    // ration: 120/148 of QR Standard
    const logoPath = path.join(process.cwd(), 'assets', 'qr-bg-v2.png');
    const qrcodeLogoImage = await loadImage(logoPath);
    const gapSize = (width * 10) / 120; //
    const qrcodeSize = width - gapSize * 2; // exclude margin x,y
    const height = (width * 148) / 120;
    ctx.drawImage(qrcodeLogoImage, x, y, width, height);
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
