import styles from './Display.module.css'

import type { Props } from '../types'
import moment from 'moment'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const View = ({ defaultValues, theme, page }: Props) => {
    // const { primary, secondary, background } = theme
    const { fields } = parseDefaultValue(defaultValues)

    const image = page?.fields?.find((e) => e.name === fields.image)?.media?.uri || ''
    const title = page?.fields?.find((e) => e.name === fields.title)?.textValue || ''
    const subtitle = page?.fields?.find((e) => e.name === fields.subtitle)?.dateValue || ''
    const description = page?.fields?.find((e) => e.name === fields.description)?.textValue || ''

    return (
        <section className={styles.display}>
            <div
                className={styles.img}
                style={{
                    backgroundImage: `url(/api/uploads/images/${image})`,
                }}
            />
            <div className={styles.container}>
                <h1>{title}</h1>
                <span>{moment(subtitle).isValid() ? moment(subtitle).format('DD MMM YYYY') : ''}</span>
                <p>{description}</p>
            </div>
        </section>
    )
}

export default View
