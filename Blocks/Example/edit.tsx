import { useState } from 'react'
import styles from './Example.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import { Card } from 'antd'
import StyledInput from '../../components/StyledInput'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const Edit = ({ defaultValues, onChange }: Props) => {
    const [values, setValues] = useState<any>(parseDefaultValue(defaultValues))

    const handleChange = (name: string, value: any) => {
        const newValue = { ...values, [name]: value }

        setValues(newValue)

        try {
            if (onChange) onChange(JSON.stringify(newValue))
        } catch (e) {
            console.log('Error on edit')
        }
    }

    return (
        <EditPanel
            view={
                <section className={styles.section}>
                    <div className={styles.container}>
                        <CustomImage className={styles.leftContainer} />
                        <div className={styles.rightContainer}>
                            <StyledInput.h1
                                className={styles.listTitle}
                                value={values.title}
                                onChange={(e) => handleChange('title', e)}
                            />
                            <ul className={styles.listContainer}>
                                <li className={styles.listElement}>first</li>
                                <li className={styles.listElement}>second</li>
                                <li className={styles.listElement}>third</li>
                            </ul>
                        </div>
                    </div>
                </section>
            }
            panel={<></>}
        />
    )
}

interface PanelProps {
    view: JSX.Element
    panel: JSX.Element
}

const EditPanel = ({ view, panel }: PanelProps) => (
    <div style={{ display: 'flex' }}>
        <div style={{ flex: 5 }}>{view}</div>
        <Card title="Settings Panel" style={{ flex: 1 }}>
            {panel}
        </Card>
    </div>
)

export default Edit
