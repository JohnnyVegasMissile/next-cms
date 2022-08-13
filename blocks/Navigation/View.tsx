import styles from './Title.module.css'

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
    const { links } = parseDefaultValue(defaultValues)

    return (
        <nav className={styles.navigation}>
            <div className={styles.container}>
                <ul>
                    {links?.map((e: any, i: number) => (
                        <li key={i}>
                            <Link href={e.link}>
                                <a>{e.title}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default View
