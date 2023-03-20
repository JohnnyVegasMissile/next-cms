// import styles from './Timelines.module.scss'

const Banner = () => {
    return (
        <section>
            <h4>Years of experiences</h4>
            <h3>My resume</h3>
            <div>
                <div>
                    <h5>Job experience</h5>
                    <span>2010 - 2020</span>
                    <div>
                        {['', '', ''].map((_, idx) => (
                            <div key={idx}>
                                <h6>Bachelor Software engineer</h6>
                                <span>University of oxford (2010 - 2011)</span>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h5>Eduquation quality</h5>
                    <span>2010 - 2020</span>
                    <div>
                        {['', '', ''].map((_, idx) => (
                            <div key={idx}>
                                <h6>Bachelor Software engineer</h6>
                                <span>University of oxford (2010 - 2011)</span>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
