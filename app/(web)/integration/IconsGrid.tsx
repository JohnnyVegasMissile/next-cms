import styles from './ImagesGrid.module.scss'

const IconsGrid = () => {
    return (
        <section>
            <h4>Best customers</h4>
            <h3>Selected clients</h3>

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

export default IconsGrid
