import styles from '../styles/table.module.css';

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
                                <span>វិទ្យាស្ថានជាតិកសិកម្ម ព្រែកលៀប</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span>University</span>
                            </th>
                            <td >
                                <strong>The Prek Leap National Institute of Agriculture</strong>
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
                                <span>Student</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.recipient.name}</strong>
                                </span>
                            </td>
                        </tr>
                        {/* <tr>
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
                                <span>sex</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.recipient.gender}</strong>
                                </span>
                            </td>
                        </tr> */}
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
                                <span>Born on</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.recipient.dateOfBirth}</strong>
                                </span>
                            </td>
                        </tr>
                        {/* <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                លេខ
                                <br />
                                <span>No.</span>
                            </th>
                            <td>
                                <strong>{document.certificate.numberKm}</strong>
                                <br />
                                <span>{document.certificate.number}</span>
                            </td>
                        </tr> */}
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
                                <span>The degree of</span>
                            </th>
                            <td>
                                <span>
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
                                <span>Major</span>
                            </th>
                            <td>
                                <span>
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
                                 ចុះថ្ងៃទី
                            </th>
                            <td>
                                <strong>{document.certificate.examDateKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span>Issued</span>
                            </th>
                            <td>
                                <span>
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
                                ចុះហត្ថលេខា
                            </th>
                            <td>
                                <strong>រាជធានីភ្នំពេញ ថ្ងៃទី{document.certificate.signatureDateKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span>Sign Date</span>
                            </th>
                            <td>
                                <span>
                                    <strong>Phnom Penh, {document.certificate.signatureDate}</strong>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function NIACertificateTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
