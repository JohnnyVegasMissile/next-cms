import styles from './Article.module.css'

import { Card } from 'antd'

// const parseDefaultValue = (values: string) => {
//     try {
//         return JSON.parse(values)
//     } catch (e) {
//         return {}
//     }
// }

const Edit = (/*{ defaultValues, page, onChange }: Props*/) => {
    // const [values, setValues] = useState<any>(parseDefaultValue(defaultValues))

    // const handleChange = (name: string, value: any) => {
    //     const newValue = { ...values }

    //     set(newValue, name, value)

    //     setValues(newValue)

    //     try {
    //         if (onChange) onChange(JSON.stringify(newValue))
    //     } catch (e) {
    //         console.log('Error on edit')
    //     }
    // }

    // const arts = ['Lorem ipsum dolor', 'Lorem ipsum dolor', 'Lorem ipsum dolor']

    return (
        <EditPanel
            view={
                <section>
                    <div className={styles.wrapper}>
                        <div className={styles.listWrap}>
                            <h3 className={styles.title}>Articles</h3>
                            <ul className={styles.list}>
                                <li>
                                    <div className={styles.card}>
                                        <img
                                            className={styles.cardImage}
                                            src="https://picsum.photos/400/400"
                                            alt=""
                                        />
                                        <div className={styles.cardContent}>
                                            <h4 className={styles.cardTitle}>
                                                This is a very important title
                                            </h4>
                                            <p className={styles.cardDescription}>
                                                This is a very important description
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className={styles.card}>
                                        <img
                                            className={styles.cardImage}
                                            src="https://picsum.photos/400/400"
                                            alt=""
                                        />
                                        <div className={styles.cardContent}>
                                            <h4 className={styles.cardTitle}>
                                                This is a very important title
                                            </h4>
                                            <p className={styles.cardDescription}>
                                                This is a very important description
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className={styles.card}>
                                        <img
                                            className={styles.cardImage}
                                            src="https://picsum.photos/400/400"
                                            alt=""
                                        />
                                        <div className={styles.cardContent}>
                                            <h4 className={styles.cardTitle}>
                                                This is a very important title
                                            </h4>
                                            <p className={styles.cardDescription}>
                                                This is a very important description
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            }
        />
    )
}

interface PanelProps {
    view: JSX.Element
    panel?: JSX.Element
}

const EditPanel = ({ view, panel }: PanelProps) => (
    <div style={{ display: 'flex' }}>
        <div style={{ flex: 5 }}>{view}</div>
        {!!panel && (
            <Card title="Settings Panel" style={{ flex: 1, marginTop: 1 }} bordered={false}>
                {panel}
            </Card>
        )}
    </div>
)

export default Edit
