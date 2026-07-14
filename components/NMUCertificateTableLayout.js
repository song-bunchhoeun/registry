import upperCase from 'lodash/upperCase.js';
import styles from '../styles/table.module.css';
import localFont from '@next/font/local';

const googleSans = localFont({
    src: [
        {
            path: '../assets/fonts/GoogleSans-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../assets/fonts/GoogleSans-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
    ],
});

function isImageUrl(url) {
    try {
        return Boolean(new URL(url).href);
    } catch (e) {
        return '';
    }
}

function FixedTableViewer({ document }) {
    let degreeText=""
    let degreeTextKm=""
    if(document.$template.name=="NMU_ASSOCIATE_DEGREE"){
        degreeTextKm="បរិញ្ញាបត្ររង"
        degreeText="Associate's Degree"
    }
     if(document.$template.name=="NMU_BACHELOR_DEGREE"){
        degreeTextKm="បរិញ្ញាបត្រ"
        degreeText="Bachelor's Degree"

    }
    if(document.$template.name=="NMU_MASTER_DEGREE"){
        degreeTextKm="បរិញ្ញាបត្រជាន់ខ្ពស់"
        degreeText="Master's Degree"

    }
  
    return (
        <>
            {document.recipient.photoUrl && (
                <img className={styles.photo} src={document.recipient.photoUrl} alt="" />
            )}
            <div className={styles.table_container}>
                <table className={styles.table}>
                    <tbody>
                        <tr>
                            <th>
                                ស្ថាប័ន
                            </th>
                            <td>
                                <span>សាកលវិទ្យាល័យជាតិមានជ័យ</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>University</span>
                            </th>
                            <td >
                                <strong className={googleSans.className}>National Meanchey University</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                និស្សិតឈ្មោះ
                            </th>
                            <td>
                                <span>{document.recipient.nameKm}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>Student</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.recipient.name}</strong>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ភេទ
                            </th>
                            <td>
                                <span>{document.recipient.genderKm}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>Gender</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.recipient.gender}</strong>
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                កើតថ្ងៃទី
                            </th>
                            <td>
                                <strong>{document.recipient.dateOfBirthKm}</strong>
                            </td>
                        </tr>


                        <tr>
                            <th>
                                <span className={googleSans.className}>Born on</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.recipient.dateOfBirth}</strong>
                                </span>
                            </td>
                        </tr>
                      
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                សញ្ញាបត្រ
                            </th>
                            <td>
                                <strong>{degreeTextKm} {document.certificate.degreeKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>The degree of</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{degreeText} {document.certificate.degree}</strong>
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                ឯកទេស
                            </th>
                            <td>
                                <strong>{document.certificate.majorKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>Major</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.major}</strong>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                កំណត់ហេតុ
                            </th>
                            <td>
                                <strong>ចុះថ្ងៃទី{document.certificate.logDateKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>Minutes dated</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.logDate}</strong>
                                </span>
                            </td>
                        </tr>
{document.certificate.numberKm!=""?
                        <>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                            លេខ
                            </th>
                            <td>
                                <strong>{document.certificate.numberKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>No.</span>
                            </th>
                            <td>
                                {/* <span className={googleSans.className}>
                                    <strong>{document.certificate.number}</strong>
                                </span> */}
                            </td>
                        </tr>
                        </>
                        :""
}
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ចុះហត្ថលេខា
                            </th>
                            <td>
                                <strong>រាជធានីភ្នំពេញ {document.certificate.signatureDateKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ត្រូវនឹងថ្ងៃ
                            </th>
                            <td>
                                <strong>{document.certificate.signatureLunarDateKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>Sign Date</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>Banteay Meanchey, {document.certificate.signatureDate}</strong>
                                </span>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function NMUCertificateTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
