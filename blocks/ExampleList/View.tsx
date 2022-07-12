import styles from './ExampleList.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import Link from 'next/link'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues, page }: Props) => {
    const values = parseDefaultValue(defaultValues)

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <CustomImage.Background img={values.img} className={styles.leftContainer} />
                <div className={styles.rightContainer}>
                    <h1 className={styles.listTitle}>{page?.title}</h1>
                    <ul className={styles.listContainer}>
                        {page?.articles?.map((article, idx) => (
                            <li key={idx} className={styles.listElement}>
                                <Link href={`/${page?.slug}/${article.slug}`}>
                                    <a>{article.title}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default View
