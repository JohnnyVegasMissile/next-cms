import styles from './ImagesGrid.module.scss'
import Image from 'next/image'

const Banner = () => {
    return (
        <section className={styles['section']}>
            <h4>Award winning work</h4>
            <h3>Recent works</h3>

            <div className={styles['grid']}>
                {['', '', ''].map((_, idx) => (
                    <div key={idx} className={styles['tile']}>
                        <Image
                            fill
                            src="https://images.unsplash.com/photo-1678985690723-e1d55583627e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                            alt="Icon"
                        />
                    </div>
                ))}
            </div>

            <button>View all work</button>
        </section>
    )
}

export default Banner
