// import styles from './ImagesGrid.module.scss'

const IconsGrid = () => {
    return (
        <section>
            <h4>Best customers</h4>
            <h3>Selected clients</h3>

            <div>
                {['', '', ''].map((_, idx) => (
                    <div key={idx}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt="Icon" />
                    </div>
                ))}
            </div>

            <button>View all work</button>
        </section>
    )
}

export default IconsGrid
