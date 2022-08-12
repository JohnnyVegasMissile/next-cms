import styles from './Title.module.css'

import type { Props } from '../types'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues /*, articles*/ }: Props) => {
    const { title } = parseDefaultValue(defaultValues)

    return (
        <section>
            <div className={styles.background}>
                <h2 className={styles.title}>{title}</h2>
            </div>
        </section>
    )
}

export default View
