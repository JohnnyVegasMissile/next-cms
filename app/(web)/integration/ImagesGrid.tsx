import styles from './ImagesGrid.module.scss'

const Banner = () => {
    return (
        <section>
            <h4>Award winning work</h4>
            <h3>Recent works</h3>

            <div>
                {['', '', ''].map((element, idx) => (
                    <div key={idx}>
                        <img alt="Icon" />
                    </div>
                ))}
            </div>

            <button>View all work</button>
        </section>
    )
}

export default Banner
