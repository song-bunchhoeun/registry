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
                                <span>សាកលវិទ្យាល័យវិទ្យាសាស្រ្តសុខាភិបាល</span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span>University</span>
                            </th>
                            <td >
                                <strong>UNIVERSITY OF HEALTH SCIENCES</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span>Université</span>
                            </th>
                            <td >
                                <strong>UNIVERSITÉ DES SCIENCES DE LA SANTÉ</strong>
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
                            <th>
                                <span>nom</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.recipient.nameFr}</strong>
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
                            <th>
                                <span>sexe</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.recipient.genderFr}</strong>
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
                            <th>
                                <span>né(e) le</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.recipient.dateOfBirthFr}</strong>
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
                                នៅ
                            </th>
                            <td>
                                <strong>{document.recipient.placeOfBirthKm}</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span>in</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.recipient.placeOfBirth}</strong>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span>à</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.recipient.placeOfBirthFr}</strong>
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
                                <span>No.</span>
                            </th>
                            <td>
                                <span>{document.certificate.number}</span>
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
                            <th>
                                <span>le degré de</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.certificate.degreeFr}</strong>
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
                                 នៅ
                            </th>
                            <td>
                                <strong>សាកលវិទ្យាល័យវិទ្យាសាស្រ្តសុខាភិបាល</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span>at</span>
                            </th>
                            <td>
                                <span>
                                    <strong>University of Health Sciences (UHS)</strong>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span>à</span>
                            </th>
                            <td>
                                <span>
                                    <strong>l'Université des Sciences de la Santé</strong>
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
                                 នៅថ្ងៃទី
                            </th>
                            <td>
                                <strong>{document.certificate.graduateDateKm}</strong>
                            </td>
                        </tr>

                        <tr>
                            <th>
                                <span>on</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.certificate.graduateDate}</strong>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                <span>le</span>
                            </th>
                            <td>
                                <span>
                                    <strong>{document.certificate.graduateDateFr}</strong>
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
                                <br />
                                Recteur
                            </th>
                            <td>
                                <span>
                                    <strong>{document.certificate.rectorSignatureLunarDateKm}</strong>
                                    <br />
                                    <strong>រាជធានីភ្នំពេញ ថ្ងៃទី/Phnom Penh, {document.certificate.rectorSignatureDate}</strong>
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
                                នាយក
                                <br />
                                Director
                                <br />
                                Directeur
                            </th>
                            <td>
                                <span>
                                <strong>{document.certificate.directorSignatureLunarDateKm}</strong>
                                <br />
                                    <strong>រាជធានីភ្នំពេញ ថ្ងៃទី/Phnom Penh, {document.certificate.directorSignatureDate}</strong>
                                </span>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function UHSAssociateCertificateTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
