import styles from './Article.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import Link from 'next/link'

// const parseDefaultValue = (values: string) => {
//     try {
//         return JSON.parse(values)
//     } catch (e) {
//         return {}
//     }
// }

const View = ({ /* defaultValues, */ page }: Props) => {
    // const values = parseDefaultValue(defaultValues)

    return (
        <section>
            <div className={styles.wrapper}>
                <div className={styles.listWrap}>
                    <h3 className={styles.title}>{page?.title}</h3>
                    <ul className={styles.list}>
                        {page?.articles?.map((article, idx) => (
                            <li key={idx}>
                                <div key={idx} className={styles.card}>
                                    <CustomImage
                                        className={styles.cardImage}
                                        img={article.cover}
                                    />
                                    <div className={styles.cardContent}>
                                        <Link href={`/${page?.slug}/${article.slug}`}>
                                            <a>
                                                <h4 className={styles.cardTitle}>
                                                    {article.title}
                                                </h4>
                                            </a>
                                        </Link>

                                        <p className={styles.cardDescription}>
                                            {article.description}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default View
