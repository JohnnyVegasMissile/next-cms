import styles from './Example.module.css'

import type { Props } from '../types'
import CustomImage from '@components/CustomImage'
import get from 'lodash.get'
import Link from 'next/link'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues /*, articles*/ }: Props) => {
    const values = parseDefaultValue(defaultValues)

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <CustomImage.Background img={values.img} className={styles.leftContainer}>
                    {get(values, 'button.show', false) && (
                        <Link href={get(values, 'button.link', '/')}>
                            <a>
                                <button type="button" className={styles.button}>
                                    {get(values, 'button.text', '')}
                                </button>
                            </a>
                        </Link>
                    )}
                </CustomImage.Background>
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
