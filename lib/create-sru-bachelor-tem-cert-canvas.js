import { Image, createCanvas, loadImage } from "@napi-rs/canvas";
import path from "node:path";
import { createTemplateImage, drawText, loadRemoteResource } from "./shared";
import QRCode from "qrcode";
import _ from "lodash";
import axios from "axios";
import sharp from "sharp";
export async function createSRUBachelorTemCertCanvas(
  certificateInfo = {},
  qrcodeContent,
) {
  const TEXT_COLORS = {
    black: "#000000",
    blue: "#FF0000",
  };

  const TEXT_FONTS = {
    KhmerOSMuolLight: "Khmer OS Muol Light",
    KhmerOSSiemreap: "Khmer OS Siemreap",
    khmerOSMuolPali: "Khmer OS Muol Pali",
    timesNewRoman: "Times New Roman",
  };

  let certificateType;
  let profileX;
  let profileY;
  let imgSize = [];
  let sizeBy;

  if (certificateInfo.certificate.type === "ប្រឡង") {
    certificateType = "sru-bachelor-exam-certificate.jpg";
  } else {
    certificateType = "sru-bachelor-thesis-certificate.jpg";
  }

  const DATA = {
    BACKGROUND: {
      pdfFilename: "Export-from-PSD.png",
      pngFilename: certificateType,
      //  "Export-from-PSD-no-watermark-v2.png",
      // "Export-from-PSD.png",
      width: 2481,
      height: 3508,
    },
    FONTS: [
      {
        name: "Khmer Kep",
        filename: "KHMERKEP.ttf",
      },
      {
        name: "Khmer OS Muol Light",
        filename: "KhmerOSmuollight.ttf",
      },
      {
        name: "Times New Roman Bold",
        filename: "timesbd.ttf",
      },
      {
        name: "Times New Roman",
        filename: "times.ttf",
      },
      {
        name: "Times New Roman Bold Italic",
        filename: "timesbi.ttf",
      },
      {
        name: "Times New Roman Italic",
        filename: "timesi.ttf",
      },
      {
        name: "Calibri",
        filename: "CALIBRI.ttf",
      },
    ],
    TEXTS: [
      {
        key: "recipient.nameKm",
        dataKeys: ["recipient.nameKm"],
        text: "{recipient.nameKm}",
        textSize: 62,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer OS Muol Light",
          filename: "KhmerOSmuollight.ttf",
        },
        x: 942.5,
        y: 1074.5 + 8,
        align: "left",
      },
      {
        key: "recipient.name",
        dataKeys: ["recipient.name"],
        text: "{recipient.name}",
        textSize: 58,
        textColor: TEXT_COLORS.black,
        textStyle: "bold",
        textFont: {
          name: "Times New Roman",
          filename: "timesbd.ttf",
        },
        x: 942.5,
        y: 1192.5 + 5,
        align: "left",
      },
      {
        key: "recipient.genderKm",
        dataKeys: ["recipient.genderKm"],
        text: "{recipient.genderKm}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer Kep",
          filename: "KHMERKEP.ttf",
        },
        x: 939,
        y: 1291,
        align: "left",
      },
      {
        key: "recipient.dateOfBirthKm",
        dataKeys: ["recipient.dateOfBirthKm"],
        text: "{recipient.dateOfBirthKm}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer Kep",
          filename: "KHMERKEP.ttf",
        },
        x: 939,
        y: 1410.5,
        align: "left",
      },
      {
        key: "recipient.placeOfBirthKm",
        dataKeys: ["recipient.placeOfBirthKm"],
        text: "{recipient.placeOfBirthKm}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer Kep",
          filename: "KHMERKEP.ttf",
        },
        x: 939,
        y: 1525.5,
        align: "left",
      },
      {
        key: "recipient.fatherNameKm",
        dataKeys: ["recipient.fatherNameKm"],
        text: "{recipient.fatherNameKm}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer Kep",
          filename: "KHMERKEP.ttf",
        },
        x: 939,
        y: 1637,
        align: "left",
      },
      {
        key: "recipient.motherNameKm",
        dataKeys: ["recipient.motherNameKm"],
        text: "{recipient.motherNameKm}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer Kep",
          filename: "KHMERKEP.ttf",
        },
        x: 939,
        y: 1747.5,
        align: "left",
      },
      {
        key: "certificate.specializeKm",
        dataKeys: ["certificate.specializeKm"],
        text: "{certificate.specializeKm}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer OS Muol Light",
          filename: "KhmerOSmuollight.ttf",
        },
        x: 939,
        y: 2087,
        align: "left",
      },
      {
        key: "certificate.majorKm",
        dataKeys: ["certificate.majorKm"],
        text: "{certificate.majorKm}",
        // "គ្រប់គ្រងពាណិជ្ជកម្ម",
        //
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer OS Muol Light",
          filename: "KhmerOSmuollight.ttf",
        },
        x: 544,
        y: 1974,
        align: "left",
      },
      {
        key: "certificate.examDate",
        dataKeys: ["certificate.examDate"],
        text: "{certificate.examDate}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer Kep",
          filename: "KHMERKEP.ttf",
        },
        x: 939,
        y: 2197,
        align: "left",
      },
      {
        key: "certificate.degreeKm",
        dataKeys: ["certificate.degreeKm"],
        text: "{certificate.degreeKm}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer OS Muol Light",
          filename: "KhmerOSmuollight.ttf",
        },
        x: 1943.5,
        y: 1863,
        align: "left",
      },
      {
        key: "recipient.nationality",
        dataKeys: ["recipient.nationality"],
        text: "{recipient.nationality}",
        textSize: 50,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Khmer Kep",
          filename: "KHMERKEP.ttf",
        },
        x: 1692,
        y: 1300.5,
        align: "left",
      },
      {
        key: "recipient.studentId",
        dataKeys: ["recipient.studentId"],
        text: "{recipient.studentId}",
        textSize: 66.5,
        textColor: TEXT_COLORS.black,
        textFont: {
          name: "Calibri",
          filename: "CALIBRI.ttf",
        },
        x: 1944,
        y: 1084,
        align: "left",
      },
    ],
    QRCODE: {
      width: 358,
      height: 437.8333333333333,
      x: 118,
      y: 2861,
    },
    PHOTO: {
      url: "/photo.png",
      x: 162,
      y: 1944,
      // +13,
      noPhoto: false,
      width: 360,
    },
    //original path
    // PHOTO: {
    //   url: "/photo.png",
    //   x: 163.2,
    //   y: 1939,
    //   noPhoto: false,
    //   width: 358
    // }
  };

  const bg = await createTemplateImage(DATA.BACKGROUND.pngFilename);
  const canvas = createCanvas(DATA.BACKGROUND.width, DATA.BACKGROUND.height);
  // const canvas = createCanvas(2105, 1488);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bg, 0, 0);

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

        drawTextItem(canvas, ctx, textItem, DATA.FONTS, certificateInfo);
      }
    } else drawTextItem(canvas, ctx, text, DATA.FONTS, certificateInfo);
  }

  if (qrcodeContent) {
    await drawQrCodeStandard(
      qrcodeContent,
      ctx,
      DATA.QRCODE.x,
      DATA.QRCODE.y,
      DATA.QRCODE.width,
    );
    // await drawQrCodeStandard(qrcodeContent, ctx, DATA.QRCODE.x, DATA.QRCODE.y, DATA.QRCODE.width);
  }

  // draw profile photo
  // draw profile bong veasna code
  if (certificateInfo.recipient.photoUrl) {
    try {
      const response = await axios({
        url: certificateInfo.recipient.photoUrl,
        responseType: "arraybuffer",
      });
      const resBuffer = response.data;
      const img = sharp(resBuffer);
      const maxY = 2399;
      const maxImgBoxWidth = 359;
      const maxImgBoxHeight = 399;
      let x = 344.5;

      profileX = 162;
      //  bg.width / 2;
      let imgSize = [];
      let resizedBuffer;

      const wImg = img.clone();
      const wToBuffer = await wImg
        .resize({ width: maxImgBoxWidth, fit: sharp.fit.contain })
        .jpeg({ quality: 100 })
        .toBuffer({ resolveWithObject: true });
      imgSize = [wToBuffer.info.width, wToBuffer.info.height];
      resizedBuffer = wToBuffer.data;
      sizeBy = "width";

      if (imgSize[1] > maxImgBoxHeight) {
        const hImg = img.clone();
        const hToBuffer = await hImg
          .resize({ height: maxImgBoxHeight, fit: sharp.fit.contain })
          .jpeg({ quality: 100 })
          .toBuffer({ resolveWithObject: true });
        imgSize = [hToBuffer.info.width, hToBuffer.info.height];
        resizedBuffer = hToBuffer.data;
        sizeBy = "height";
      }
      sizeBy = "width";
      profileY = maxY - imgSize[1];
      const image = new Image();
      image.src = resizedBuffer;
      profileX = x - imgSize[0] / 2;
      // profileY -= 3;
      // profileY=2001
      profileY = maxY - imgSize[1];
      // ctx.drawImage(image,  x-(imgSize[0]/2), profileY, imgSize[0], imgSize[1]);
      ctx.drawImage(image, profileX, profileY, imgSize[0], imgSize[1]);

      // const noMetric = getTextMaxWidth(ctx, {
      //     dataKeys: [],
      //     text: 'លេខ/Nᵒ :',
      //     textSize: 15,
      //     textColor: '#000000',
      //     textStyle: '500',
      //     textFont: { name: 'Khmer OS Battambang' },
      //     align: 'center',
      //     strokeLine: 0.2,
      //     strokeColor: '#000000',
      // });

      // const numMetric = getTextMaxWidth(ctx, {
      //     dataKeys: [],
      //     text: _.get(certificateInfo, 'certificate.number', ''),
      //     textSize: 15,
      //     textColor: '#000000',
      //     textStyle: '500',
      //     textFont: { name: 'Arial' },
      //     align: 'left',
      //     strokeLine: 0.2,
      //     strokeColor: '#000000',
      // });

      // const sumWidth = noMetric.width + numMetric.width + 6;

      // DATA.TEXTS.push([
      //     {
      //         dataKeys: ['certificate.number'],
      //         text: 'លេខ/Nᵒ :',
      //         textSize: 15,
      //         textColor: '#000000',
      //         textStyle: '500',
      //         textFont: { name: 'Khmer OS Battambang' },
      //         x: (bg.width - sumWidth) / 2,
      //         y: 871,
      //         align: 'left',
      //         strokeLine: 0.2,
      //         strokeColor: '#000000',
      //     },
      //     {
      //         dataKeys: ['certificate.number'],
      //         text: '{certificate.number}',
      //         textSize: 15,
      //         textColor: '#000000',
      //         textStyle: '500',
      //         textFont: { name: 'Arial' },
      //         align: 'left',
      //         strokeLine: 0.2,
      //         strokeColor: '#000000',
      //         addX: 6,
      //     },
      // ]);
    } catch (err) {
      console.log(err);
    }
  }
  // if (certificateInfo.recipient.photoUrl) {
  //   const profileImage = await loadRemoteResource(certificateInfo.recipient.photoUrl);
  //   if (profileImage) {
  //     const maxImgBoxWidth = DATA.PHOTO.width
  //     const maxImgBoxHeight = 540
  //     // 443;

  //     // get the scale
  //     // it is the min of the 2 ratios
  //     let scale_factor = Math.min(maxImgBoxWidth / profileImage.width, maxImgBoxHeight / profileImage.height);

  //     // Lets get the new width and height based on the scale factor
  //     let newWidth = profileImage.width * scale_factor;
  //     let newHeight = profileImage.height * scale_factor;

  //     // const profileHeight = profileMaxWidth / (profileImage.width / profileImage.height);
  //     const profileX = DATA.PHOTO.x;
  //     const profileY = DATA.PHOTO.y;
  //     // const profileX = (bg.width / 2) - (newWidth / 2);
  //     // const profileY = 422;
  //     ctx.drawImage(profileImage, profileX, profileY, newWidth, newHeight);
  //   }
  // }
  return canvas;
}
const drawTextItem = (canvas, ctx, textItem, FONTS, certificateInfo) => {
  if (textItem.dataKeys && textItem.dataKeys.length > 0) {
    for (const key of textItem.dataKeys)
      textItem.text = textItem.text.replace(
        `{${key}}`,
        _.get(certificateInfo, key, ""),
      );
  }

  drawText(canvas, ctx, textItem.text, {
    x: textItem.x,
    y: textItem.y + 42,
    textColor: textItem.textColor || "#000000",
    align: textItem.align,
    font: resolveFont(FONTS[0].name, 24, textItem),
    // strokeLine: 0.1,
    // strokeColor: '#000000',
    // textMaxWidth: textItem.textMaxWidth,
  });
};

export async function drawQrCodeStandard(
  qrcodeContent,
  ctx,
  x = 0,
  y = 0,
  width = 120,
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
function resolveFont(defaultFont, defaultSize, textItem) {
  const space = " ";
  let font = "";
  const fontName = textItem.textFont ? textItem.textFont.name : defaultFont;

  font += textItem.textStyle ? textItem.textStyle + space : "";
  font += textItem.textSize ? textItem.textSize : defaultSize;
  font += "px" + space;
  font += fontName;
  return font;
}
