import styles from '../styles/transcript.module.css';
import localFont from '@next/font/local';


const backgroundLogo = {
    backgroundImage: "url(logos/rupp_logo.png)",
};

const moul = localFont({
    src: [
        {
            path: '../assets/fonts/Moul.ttf',
            style: 'normal',
        }
    ],
});

function FixedTableViewer({ document }) {
    return (
        <>
            <div className={styles.grid_container} style={backgroundLogo}>
                {/* grid head */}
                <div className={styles.grid_header}>
                    <div className={styles.grid_header_name}>
                        <div>
                            និស្សិតឈ្មោះ
                            <br />
                            Name
                        </div>
                        <div>
                            <span className={moul.className}>
                                {document.recipient.nameKm}
                            </span>
                            <br />
                            <span className={styles.font_bold}>
                                {document.recipient.name}
                            </span>
                        </div>
                    </div>
                    <div className={styles.grid_header_id}>
                        <div>
                            លេខសម្គាល់
                            <br />
                            ID
                        </div>
                        <span className={styles.font_bold}>
                            {document.certificate.number}
                        </span>
                    </div>
                </div>
                 {/* / grid head */}
                 <div className={styles.grid_subject}>
                    <div className={styles.subject_header}>
                        <div>  {/* grid head */} </div>
                        <div className={styles.grid_subject_name}>
                            <span className={moul.className}>
                                មុខវិជ្ជាទូទៅ
                            </span>
                            <span className={styles.font_bold}>
                                Genderal Subjects
                            </span>
                        </div>
                        <div className={styles.grid_subject_grade+ ' ' +styles.font_bold}>
                            <span>
                                Credits
                            </span>
                            <span>
                                Grade
                            </span>
                        </div>
                    </div>
                    
                    {document.certificate.generalSubjects?.map((item, index) => (

                        <section className={styles.grid_subject_body} key={`subjects-${index}`}>
                            <div className={styles.grid_subject_id}>
                            {item.id}
                            </div>
                            <div className={styles.grid_subject_name}>
                                <span>
                                    {item.nameKm}
                                </span>
                                <span>
                                    {item.name}
                                </span>
                            </div>
                            <div className={styles.grid_subject_grade}>
                                <span>
                                {   item.credit}
                                </span>
                                <span>
                                    ({item.grade})
                                </span>
                            </div>
                        </section>
                    ))}
                    <div style={{marginTop:'40px'}}></div>
                    <div className={styles.subject_header}>
                        <div>  {/* grid head */} </div>
                        <div className={styles.grid_subject_name}>
                            <span className={moul.className}>
                                មុខវិជ្ជាតម្រង់ទិស
                            </span>
                            <span className={styles.font_bold}>
                                Oriented Subjects
                            </span>
                        </div>
                        <div className={styles.grid_subject_grade+ ' ' +styles.font_bold}>
                            <span>
                                Credits
                            </span>
                            <span>
                                Grade
                            </span>
                        </div>
                    </div>
                    {document.certificate.orientatedSubjects?.map((item, index) =>(
                         <section className={styles.grid_subject_body} key={`orientaions-${index}`}>
                         <div className={styles.grid_subject_id}>
                         {item.id}
                         </div>
                         <div className={styles.grid_subject_name}>
                             <span>
                                 {item.nameKm}
                             </span>
                             <span>
                                 {item.name}
                             </span>
                         </div>
                         <div className={styles.grid_subject_grade}>
                             <span>
                             {   item.credit}
                             </span>
                             <span>
                                 ({item.grade})
                             </span>
                         </div>
                     </section>
                    ))}
                    
                 </div>
            </div>
        </>
    );
}

export default function RUPPBachelorTranscript({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
