import styles from './List.module.css'

import type { Props } from '../types'
import CustomImage from '@components/CustomImage'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues /*, articles*/ }: Props) => {
    const { title, list, img, reversed } = parseDefaultValue(defaultValues)

    return (
        <section>
            <div className={`${styles.wrapper} ${reversed ? styles.reverse : ''}`}>
                <CustomImage.Background className={styles.image} img={img}>
                    <div className={styles.layer} />
                </CustomImage.Background>
                <div className={styles.listWrap}>
                    <h3 className={styles.title}>{title}</h3>
                    <ul className={styles.list}>
                        {list?.map((e: any, idx: number) => (
                            <li key={idx}>{e}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default View
