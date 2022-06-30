import { useState } from 'react'
import styles from './Example.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues, articles }: Props) => {
    const [values, setValues] = useState<any>(parseDefaultValue(defaultValues))

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <CustomImage className={styles.leftContainer} />
                <div className={styles.rightContainer}>
                    <h1 className={styles.listTitle}>This is a title</h1>
                    <ul className={styles.listContainer}>
                        <li className={styles.listElement}>first</li>
                        <li className={styles.listElement}>second</li>
                        <li className={styles.listElement}>third</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default View
