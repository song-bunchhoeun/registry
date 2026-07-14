import upperCase from 'lodash/upperCase.js';
import styles from '../styles/table.module.css';
import localFont from '@next/font/local';
import '@fontsource/kantumruy-pro/variable.css'
import '@fontsource/kantumruy-pro/variable-italic.css'

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
            {document.certificate.photoUrl && (
                <img className={styles.photo} src={document.certificate.photoUrl} alt="" />
            )}
            <div className={styles.table_container}>
                <table className={styles.table}>
                    <tbody className={styles.kmText}>
                        <tr>
                            <th>
                                ស្ថាប័ន
                            </th>
                            <td>
                                <span className={styles.kmTextBold}>សាកលវិទ្យាល័យជាតិគ្រប់គ្រង</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>University</span>
                            </th>
                            <td >
                                <strong className={googleSans.className}>National University of Management</strong>
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
                                <span className={styles.kmTextBold}>{document.recipient.nameKm}</span>
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
                                <strong>{document.certificate.dateOfBirthKm}</strong>
                            </td>
                        </tr>


                        <tr>
                            <th>
                                <span className={googleSans.className}>Born on</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.dateOfBirth}</strong>
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
                                សញ្ញាបត្រ
                            </th>
                            <td>
                                <strong>{document.certificate.programKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>The degree of</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.program}</strong>
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
                                ប្រកាសលទ្ធផលថ្ងៃទី
                            </th>
                            <td>
                                <strong>{document.certificate.examDateKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span className={googleSans.className}>Exam jury on</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.examDate}</strong>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function NUMCertificateTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
