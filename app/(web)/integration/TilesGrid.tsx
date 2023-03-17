import styles from './TilesGrid.module.scss'

const Banner = () => {
    return (
        <section className={styles['section']}>
            <h4>My services</h4>
            <h3>What i do</h3>

            <div className={styles['grid']}>
                {['', '', ''].map((element, idx) => (
                    <div key={idx} className={styles['tiles']}>
                        <img alt="Icon" />
                        <span>Web design</span>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Banner
