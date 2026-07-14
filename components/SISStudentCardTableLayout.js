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
                                <span>មន្ទីរអប់រំ យុវជន និងកីឡា {document.certificate.province=="ភ្នំពេញ"?"រាជធានី":"ខេត្ត"}{document.certificate.province}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                សាលា
                            </th>
                            <td>
                                <span>{document.certificate.schoolName}</span>
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
                            </th>
                            <td>
                                <span>{document.recipient.cardId}</span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ឆ្នាំសិក្សា
                            </th>
                            <td>
                                <strong>{document.certificate.yearOfStudy}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                គោត្តនាម-នាម
                            </th>
                            <td>
                                <strong>{document.recipient.name}</strong>
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
                                <strong>{document.recipient.gender}</strong>&emsp; សញ្ជតិ​ <strong>{document.recipient.nationality}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                               ថ្នាក់ទី
                            </th>
                            <td>
                                <strong>{document.certificate.grade}</strong>&emsp;អត្ថលេខ <strong>{document.recipient.studentId}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                               ថ្ងៃខែឆ្នាំកំណើត
                            </th>
                            <td>
                                <strong>{document.recipient.dob}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                               ទីកន្លែងកំណើត
                            </th>
                            <td>
                                <strong>{document.recipient.placeOfBirth}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                               ឪពុកឈ្មោះ
                            </th>
                            <td>
                                <strong>{document.recipient.fatherName}</strong>&emsp;​មុខរបរ៖  <strong>{document.recipient.fatherJob}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ម្តាយឈ្មោះ
                            </th>
                            <td>
                                <strong>{document.recipient.motherName}</strong>&emsp;មុខរបរ៖  <strong>{document.recipient.motherJob}</strong> 
                            </td>
                        </tr>

                        <tr>
                            <td colSpan={2}>
                                <div className={styles.line}></div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                ទីលំនៅបច្ចុប្បន្ន
                            </th>
                            <td>
                                <strong>{document.recipient.currentAddress}</strong>
                            </td>
                        </tr>
                     

                

                    </tbody>
                </table>
            </div>
        </>
    );
}

export default function SISStudentCardTableLayout({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
