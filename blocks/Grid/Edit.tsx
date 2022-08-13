import { useState } from 'react'
import styles from './Grid.module.css'

import type { Props } from '../types'
import { Card, Select, Space, Typography } from 'antd'
import set from 'lodash.set'
import get from 'lodash.get'

const { Option } = Select
const { Text } = Typography

const parseDefaultValue = (values: string) => {
    try {
        return JSON.parse(values)
    } catch (e) {
        return {}
    }
}

const Edit = ({ defaultValues, onChange, theme, fields }: Props) => {
    // const { background, primary, secondary } = theme
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

    const isText = (type: string) => type === 'string' || type === 'text'

    return (
        <EditPanel
            view={
                <section className={styles.grid}>
                    <h1>Elements</h1>
                    <div className={styles.container}>
                        {Array.from(Array(2).keys()).map((e, i) => (
                            <div key={i} className={styles.card}>
                                <div
                                    className={styles.img}
                                    style={{
                                        backgroundImage: 'url(/default.png)',
                                    }}
                                />
                                <h3>Title</h3>
                                <span>18 Oct 2021</span>
                                <p>
                                    lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                                    est laborum
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            }
            panel={
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>Image :</Text>
                    <Select
                        style={{ width: '100%' }}
                        value={get(values, 'fields.image', undefined)}
                        onChange={(e) => handleChange('fields.image', e)}
                    >
                        {fields?.map((field) => (
                            <Option disabled={field.type !== 'image'} key={field.name} value={field.name}>
                                {field.label}
                            </Option>
                        ))}
                    </Select>
                    <Text>Title :</Text>
                    <Select
                        style={{ width: '100%' }}
                        value={get(values, 'fields.title', undefined)}
                        onChange={(e) => handleChange('fields.title', e)}
                    >
                        {fields?.map((field) => (
                            <Option disabled={!isText(field.type)} key={field.name} value={field.name}>
                                {field.label}
                            </Option>
                        ))}
                    </Select>
                    <Text>Subtitle :</Text>
                    <Select
                        style={{ width: '100%' }}
                        value={get(values, 'fields.subtitle', undefined)}
                        onChange={(e) => handleChange('fields.subtitle', e)}
                    >
                        {fields?.map((field) => (
                            <Option disabled={field.type !== 'date'} key={field.name} value={field.name}>
                                {field.label}
                            </Option>
                        ))}
                    </Select>
                    <Text>Description :</Text>
                    <Select
                        style={{ width: '100%' }}
                        value={get(values, 'fields.description', undefined)}
                        onChange={(e) => handleChange('fields.description', e)}
                    >
                        {fields?.map((field) => (
                            <Option disabled={!isText(field.type)} key={field.name} value={field.name}>
                                {field.label}
                            </Option>
                        ))}
                    </Select>
                </Space>
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
        <div style={{ flex: 5, backgroundColor: 'rgb(240, 242, 245)' }}>{view}</div>
        {!!panel && (
            <Card title="Settings Panel" style={{ flex: 1, marginTop: 1 }} bordered={false}>
                {panel}
            </Card>
        )}
    </div>
)

export default Edit
