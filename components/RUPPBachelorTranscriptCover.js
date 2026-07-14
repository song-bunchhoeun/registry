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
            <div className={styles.grid_container+ ' ' +styles.grid_cover} style={backgroundLogo}>
                {/* Photo */}
                {document.recipient.photoUrl && (
                    <img className={styles.photo} src={document.recipient.photoUrl} alt="" />
                )}
                <div className={styles.grid_body}>

                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            សាកលវិទ្យាល័យ
                        </div>
                        <div className={styles.item_name}>
                            <span className={moul.className}>
                                សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ
                            </span>
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            University
                        </div>
                        <div className={styles.item_name+ ' ' +styles.font_bold}>
                            Royal University of Phnom Penh
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            វិញ្ញាបនបត្រ
                        </div>
                        <div className={styles.item_name}>
                            វិញ្ញាបនបត្រថ្នាក់ឆ្នាំសិក្សាមូលដ្ឋាន
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label} style={{fontWeight: '500'}}>
                            Certificate of
                        </div>
                        <div className={styles.item_name} style={{fontWeight: '500'}}>
                            Certificate of Foundation Year Course
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            ឈ្មោះនិស្សិត
                        </div>
                        <div className={styles.item_name}>
                            <span className={moul.className}>
                                {document.recipient.nameKm}
                            </span>
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            Name
                        </div>
                        <div className={styles.item_name} style={{fontWeight: '600'}}>
                            {document.recipient.name}
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            ភេទ
                        </div>
                        <div className={styles.item_name}>
                            {document.recipient.genderKm}
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            Sex
                        </div>
                        <div className={styles.item_name} style={{fontWeight: '500'}}>
                            {document.recipient.gender}
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            ថ្ងៃខែឆ្នាំកំណើត
                        </div>
                        <div className={styles.item_name}>
                            {document.recipient.dateOfBirthKm}
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            Date of Birth
                        </div>
                        <div className={styles.item_name} style={{fontWeight: '500'}}>
                            {document.recipient.dateOfBirth}
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            ឆ្នាំសិក្សា
                        </div>
                        <div className={styles.item_name}>
                           {document.certificate.academicYearKm}
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            Academic Year
                        </div>
                        <div className={styles.item_name}>
                            {document.certificate.academicYear}
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            ចេញផ្សាយនៅ
                        </div>
                        <div className={styles.item_name}>
                            {document.certificate.issuedDateLunaKm} <br /> រាជធានីភ្នំពេញ {document.certificate.issuedDateKm}
                        </div>
                    </section>
                    <section className={styles.grid_item}>
                        <div className={styles.item_label}>
                            Issued at
                        </div>
                        <div className={styles.item_name}>
                            Phnom Penh {document.certificate.issuedDate} 
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}

export default function RUPPBachelorTranscriptCover({ document }) {
    return (
        <div>
            <FixedTableViewer document={document} />
        </div>
    );
}
