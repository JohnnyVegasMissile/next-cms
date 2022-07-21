import styles from './Form.module.css'

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

    return (
        <EditPanel
            view={
                <section>
                    <div className={styles.wrapper}>
                        <h3 className={styles.title}>Contact</h3>
                        <div className={styles.inputWrap}>
                            <label className={styles.label}>Email</label>
                            <input className={styles.input} />
                        </div>
                        <div className={styles.inputWrap}>
                            <label className={styles.label}>Subject</label>
                            <input className={styles.input} />
                        </div>
                        <div className={styles.inputWrap}>
                            <label className={styles.label}>Message</label>
                            <textarea className={styles.input} />
                        </div>
                        <button className={styles.button}>Submit</button>
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
