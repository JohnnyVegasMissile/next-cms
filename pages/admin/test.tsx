import Link from 'next/link'
import styles from './test.module.css'

const Test = () => {
    return (
        <>
            <nav className={styles.navigation}>
                <div className={styles.container}>
                    <ul>
                        {Array.from(Array(4).keys()).map((e, i) => (
                            <li key={i}>
                                <Link href="/">
                                    <a>home</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <section className={styles.title}>
                <h1>my dope title</h1>
            </section>
            <section className={styles.list}>
                <div className={styles.container}>
                    <div
                        className={styles.img}
                        style={{
                            backgroundImage: 'url(/default.png)',
                        }}
                    />
                    <div>
                        <h2>A small title</h2>
                        <ul>
                            {Array.from(Array(5).keys()).map((e, i) => (
                                <li key={i}>my element</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            <section className={styles.grid}>
                <h1>all dope elements</h1>
                <div className={styles.container}>
                    {Array.from(Array(5).keys()).map((e, i) => (
                        <div key={i} className={styles.card}>
                            <div
                                className={styles.img}
                                style={{
                                    backgroundImage: 'url(/default.png)',
                                }}
                            />
                            <h3>this is a title</h3>
                            <span>18 Oct 2021</span>
                            <p>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                                in culpa qui officia deserunt mollit anim id est laborum
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.display}>
                <div
                    className={styles.img}
                    style={{
                        backgroundImage: 'url(/default.png)',
                    }}
                />
                <h1>this is a title</h1>
                <span>18 Oct 2021</span>
                <p>
                    lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                    est laborum
                </p>
            </section>
            <section className="footer"></section>

            <section className={styles.form}>
                <form className={styles.container}>
                    <input id="name" type="text" placeholder="name" />
                    <button type="submit">Submit</button>
                </form>
            </section>
        </>
    )
}

export default Test
