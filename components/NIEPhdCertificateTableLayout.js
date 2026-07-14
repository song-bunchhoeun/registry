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
                                <span>វិទ្យាស្ថាន​ជាតិ​អប់រំ</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>University</span>
                            </th>
                            <td >
                                <strong className={googleSans.className}>National Institute of Education</strong>
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
                                <strong>{document.certificate.degreeKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>The degree of</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.degree}</strong>
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
                                <span className={googleSans.className}>Specialization</span>
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
                                កំណត់ហេតុចុះថ្ងៃទី
                            </th>
                            <td>
                                <strong>{document.certificate.logDateKm}</strong>
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
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                លេខ
                                <br />
                                <span className={googleSans.className}>No.</span>
                            </th>
                            <td>
                                <strong>{document.certificate.number}</strong>
                                <br />
                                <span className={googleSans.className}></span>
                            </td>
                        </tr>
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
                                <strong>រដ្ឋមន្ត្រីក្រសួងអប់រំ យុវជន និងកីឡា</strong>
                            </td>

                        </tr>
                        <tr>
                            <th>
                            ធ្វើនៅ
                            </th>
                            <td>
                                <strong>រាជធានីភ្នំពេញ ថ្ងៃទី{document.certificate.ministerSignatureDateKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ត្រូវនឹងថ្ងៃ
                            </th>
                            <td>
                                <strong>{document.certificate.ministerSignatureLunarDateKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>Sign Date</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>Phnom Penh, {document.certificate.ministerSignatureDate}</strong>
                                </span>
                            </td>
                        </tr>
                        {/*  */}
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
                                <strong>នាយកវិទ្យាស្ថានជាតិអប់រំ</strong>
                            </td>
                           
                        </tr>
                        <tr>
                            <th>
                            ធ្វើនៅ
                            </th>
                            <td>
                                <strong>រាជធានីភ្នំពេញ ថ្ងៃទី{document.certificate.directorSignatureDateKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ត្រូវនឹងថ្ងៃ
                            </th>
                            <td>
                                <strong>{document.certificate.directorSignatureLunarDateKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>Sign Date</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>Phnom Penh, {document.certificate.directorSignatureDate}</strong>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function NIEPhdCertificateTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
