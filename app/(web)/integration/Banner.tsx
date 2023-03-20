import Image from 'next/image'
import styles from './Banner.module.scss'

const Banner = () => {
    return (
        <section className={styles['section']}>
            <div className={styles['wrapper']}>
                <div className={styles['infos']}>
                    <span className={styles['greetings']}>
                        Hello, <i>i&apos;m</i>
                    </span>
                    <h1 className={styles['name']}>Alexandre Tanyeres</h1>
                    <h2 className={styles['job']}>Web Developer</h2>
                    <p className={styles['text']}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                        dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    <span className={styles['find-me']}>Find me on</span>
                    <div className={styles['list']}>
                        <div className={styles['tile']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt="F" />
                        </div>
                        <div className={styles['tile']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt="F" />
                        </div>
                        <div className={styles['tile']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt="F" />
                        </div>
                        <div className={styles['tile']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt="F" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>20+</span>
                            <span>Years of experience</span>
                        </div>
                        <div>
                            <span>700+</span>
                            <span>Years of experience</span>
                        </div>
                        <div>
                            <span>30+</span>
                            <span>Years of experience</span>
                        </div>
                    </div>
                </div>
                <div className={styles['media']}>
                    <div>
                        <Image
                            height={200}
                            width={200}
                            src="https://images.unsplash.com/photo-1678985690723-e1d55583627e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                            alt="Icon"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner
