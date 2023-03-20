// import styles from './TilesCarousel.module.scss'

const TilesCarousel = () => {
    return (
        <section>
            <div>
                <div>
                    <h4>Testimonials</h4>
                    <h3>What clients say</h3>
                </div>

                <div>
                    <button>{'<'}</button>
                    <button>{'>'}</button>
                </div>
            </div>

            <div>
                {['', '', ''].map((_, idx) => (
                    <div key={idx}>
                        <div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt="Icon" />
                            <span>*****</span>
                        </div>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua.
                        </p>
                        <div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt="Profile" />
                            <div>
                                <span>Antoine geraud</span>
                                <span>IT Director</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default TilesCarousel
