import styles from './Inte.module.css'

const Inte = () => {
    return (
        <>
            <h1 className={styles.title_img}>My big title</h1>
            <div className={styles.shadow_title}>My big title</div>
            <div className={styles.bg_image}>
                <ul className={styles.list}>
                    <li className={styles.list_item}>First</li>
                    <li className={styles.list_item}>First</li>
                    <li className={styles.list_item}>First</li>
                </ul>
            </div>
        </>
    )
}

export default Inte
