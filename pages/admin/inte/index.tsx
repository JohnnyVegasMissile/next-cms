import BannerStyle from './Banner.module.css'
import TitleStyle from './Title.module.css'
import ListStyle from './List.module.css'
import FormStyle from './Form.module.css'
import NavStyle from './Nav.module.css'
import Link from 'next/link'

const Inte = () => {
    return (
        <>
            <div className={NavStyle.container}>
                <div className={NavStyle.wrapper}>
                    <nav className={NavStyle.nav}>
                        <Link href="/">
                            <a className={NavStyle.link}>Home</a>
                        </Link>
                        <Link href="/">
                            <a className={NavStyle.link}>Home</a>
                        </Link>
                        <Link href="/">
                            <a className={NavStyle.link}>Home</a>
                        </Link>
                        <Link href="/">
                            <a className={NavStyle.link}>Home</a>
                        </Link>
                    </nav>
                </div>
            </div>

            <section>
                <div className={BannerStyle.background}>
                    <div className={BannerStyle.layer}>
                        <h1 className={BannerStyle.title}>This is a very important title</h1>
                        <button className={BannerStyle.button}>Click me</button>
                    </div>
                </div>
            </section>

            <section>
                <div className={TitleStyle.background}>
                    <h2 className={TitleStyle.title}>This is a very important title</h2>
                </div>
            </section>

            <section>
                <div className={ListStyle.wrapper}>
                    <div className={ListStyle.image}>
                        <div className={ListStyle.layer} />
                    </div>
                    <div className={ListStyle.listWrap}>
                        <h3 className={ListStyle.title}>This is a very important title</h3>
                        <ul className={ListStyle.list}>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <div className={`${ListStyle.wrapper} ${ListStyle.reverse}`}>
                    <div className={ListStyle.image}>
                        <div className={ListStyle.layer} />
                    </div>
                    <div className={ListStyle.listWrap}>
                        <h3 className={ListStyle.title}>This is a very important title</h3>
                        <ul className={ListStyle.list}>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <div className={ListStyle.wrapper}>
                    <div className={ListStyle.image}>
                        <div className={ListStyle.layer} />
                    </div>
                    <div className={ListStyle.listWrap}>
                        <h3 className={ListStyle.title}>This is a very important title</h3>
                        <ul className={ListStyle.list}>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                            <li>This is a very important title</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <form>
                    <div className={FormStyle.wrapper}>
                        <h3 className={FormStyle.title}>Contact</h3>
                        <div className={FormStyle.inputWrap}>
                            <label className={FormStyle.label}>Email</label>
                            <input className={FormStyle.input} />
                        </div>
                        <div className={FormStyle.inputWrap}>
                            <label className={FormStyle.label}>Subject</label>
                            <input className={FormStyle.input} />
                        </div>
                        <div className={FormStyle.inputWrap}>
                            <label className={FormStyle.label}>Message</label>
                            <textarea className={FormStyle.input} />
                        </div>
                        <button className={FormStyle.button}>Submit</button>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Inte
