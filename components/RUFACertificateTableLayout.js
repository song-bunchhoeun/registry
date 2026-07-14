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
                                <span>សាកលវិទ្យាល័យភូមិន្ទវិចិត្រសិល្បៈ</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>University</span>
                            </th>
                            <td >
                                <strong className={googleSans.className}>Royal University Of Fine Arts</strong>
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
                                កើត
                            </th>
                            <td>
                                <strong>{document.recipient.dateOfBirthKm} នៅ{document.recipient.placeOfBirthKm}</strong>
                            </td>
                        </tr>


                        <tr>
                            <th>
                                <span className={googleSans.className}>Born on</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.recipient.dateOfBirth} in {document.recipient.placeOfBirth}</strong>
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
                                ជំនាញ
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
                                ប្រកាសលេខ
                            </th>
                            <td>
                                <strong>{document.certificate.logNoKm} ចុះ{document.certificate.logDateKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>Prakas No.</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.logNo} dated{document.certificate.logDate}</strong>
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
                                សម័យប្រឡង
                            </th>
                            <td>
                                <strong>{document.certificate.examDateKm}   ជំនាន់ទី​ {document.certificate.generationKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>Held on</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.examDate}, Generation {document.certificate.generation}</strong>
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
                                <strong>រាជធានីភ្នំពេញ {document.certificate.chairmanSignatureDateKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ត្រូវនឹងថ្ងៃ
                            </th>
                            <td>
                                <strong>{document.certificate.chairmanSignatureLunarDateKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>Sign Date</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>Phnom Penh, {document.certificate.rectorSignatureDate}</strong>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function RUFACertificateTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
