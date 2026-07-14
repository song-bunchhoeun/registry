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
                                <span>សាកលវិទ្យាល័យ ហេង សំរិន ត្បូងឃ្មុំ</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span>University</span>
                            </th>
                            <td >
                                <strong>University of Heng Samrin Thbongkhmum</strong>
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
                                <span>sex</span>
                            </th>
                            <td>
                                <span>
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
                                <span>Born on</span>
                            </th>
                            <td>
                                <span>
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
                                លេខ
                                {/* <br />
                                <span>No.</span> */}
                            </th>
                            <td>
                                <strong>{document.certificate.number}</strong>
                                {/* <br />
                                <span>{document.certificate.number}</span> */}
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
                                 គណៈកម្មការប្រឡង
                            </th>
                            <td>
                                <strong>{document.certificate.examDateKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span>Exam Committee</span>
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
                                សាកលវិទ្យា ធិកា
                                <br />
                                Rector
                            </th>
                            <td>
                                <span>
                                    <strong>Thbongkhmum, {document.certificate.rectorSignatureDate}</strong>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ប្រធានក្រុមប្រឹក្សាភិបាល
                                <br />
                                Chairman of the Board
                            </th>
                            <td>
                                <strong>{document.certificate.boardSignatureLunarDateKm}</strong>
                                <br />
                                <strong>ត្បូងឃ្មុំ ថ្ងៃទី{document.certificate.boardSignatureDateKm}</strong>
                            </td>
                        </tr>

                        
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function UHSTCertificateTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
