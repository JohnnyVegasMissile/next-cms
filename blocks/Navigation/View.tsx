import styles from './Navigation.module.css'

import type { Props } from '../types'
import Link from 'next/link'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues /*, articles*/ }: Props) => {
    const { list } = parseDefaultValue(defaultValues)

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <nav className={styles.nav}>
                    {list?.map((item: any, idx: number) => (
                        <Link key={idx} href={item.link}>
                            <a className={styles.link}>{item.label}</a>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}

export default View
