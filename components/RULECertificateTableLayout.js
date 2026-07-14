import styles from '../styles/sru.table.module.css';
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
                                <span>សាកលវិទ្យាល័យភូមិន្ទនិតិសាស្ត្រ និងវិទ្យាសាស្រ្តសេដ្ឋកិច្ច</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span className={googleSans.className}>University</span>
                            </th>
                            <td >
                                <strong className={googleSans.className}>ROYAL UNIVERSITY OF LAW AND ECONOMICS</strong>
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
                                <strong>{document.recipient.genderKm}</strong>
                            </td>
                        </tr>


                        <tr>
                            <th>
                                <span className={googleSans.className}>sex</span>
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
                                សម័យប្រឡង
                            </th>
                            <td>
                                <strong>{document.certificate.examDateKm}</strong>
                            </td>
                        </tr>


                        <tr>
                            <th>
                                <span className={googleSans.className}>Final Examination Jury</span>
                            </th>
                            <td>
                                <span className={googleSans.className}>
                                    <strong>{document.certificate.examDate}</strong>
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
                        {/* <tr>
                            <th>
                                ចុះហត្ថលេខា
                            </th>
                            <td>
                                <strong>ស្វាយរៀង ថ្ងៃទី{document.certificate.issueDateKm}</strong>
                            </td>
                        </tr> */}

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

export default function RULECertificateTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
