import { useState } from 'react'
import styles from './ExampleList.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import { Card, Space } from 'antd'
import get from 'lodash.get'
import set from 'lodash.set'
import MediaModal from '../../components/MediaModal'

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const Edit = ({ defaultValues, page, onChange }: Props) => {
    const [values, setValues] = useState<any>(parseDefaultValue(defaultValues))

    const handleChange = (name: string, value: any) => {
        const newValue = { ...values }

        set(newValue, name, value)

        setValues(newValue)

        try {
            if (onChange) onChange(JSON.stringify(newValue))
        } catch (e) {
            console.log('Error on edit')
        }
    }

    const arts = ['Lorem ipsum dolor', 'Lorem ipsum dolor', 'Lorem ipsum dolor']

    return (
        <EditPanel
            view={
                <section className={styles.section}>
                    <div className={styles.container}>
                        <CustomImage.Background
                            img={values.img}
                            className={styles.leftContainer}
                        />
                        <div className={styles.rightContainer}>
                            <h1 className={styles.listTitle}>{page?.title}</h1>
                            <ul className={styles.listContainer}>
                                {arts.map((article, idx) => (
                                    <li key={idx} className={styles.listElement}>
                                        {article}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            }
            panel={
                <>
                    <Space direction="vertical">
                        <MediaModal
                            value={get(values, 'img', undefined)}
                            onMediaSelected={(e) => handleChange('img', e)}
                        />
                    </Space>
                </>
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
