import { useState } from 'react'
import styles from './Example.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import get from 'lodash.get'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues, articles }: Props) => {
    const values = parseDefaultValue(defaultValues)

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <CustomImage img={values.img} className={styles.leftContainer} />
                <div className={styles.rightContainer}>
                    <h1 className={styles.listTitle}>{get(values, 'title', '')}</h1>
                    <ul className={styles.listContainer}>
                        {values?.list?.map((e: string, idx: number) => (
                            <li key={idx} className={styles.listElement}>
                                {e}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default View
