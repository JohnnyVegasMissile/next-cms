import { Fragment, useState } from 'react'
import styles from './Title.module.css'

import type { Props } from '../types'
import { Button, Card, Space, Typography } from 'antd'
import StyledInput from '../../components/StyledInput'
import set from 'lodash.set'
import get from 'lodash.get'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import LinkInput from '../../components/LinkInput'

const { Text } = Typography

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
        const newValue = { ...values }

        set(newValue, name, value)

        setValues(newValue)

        try {
            if (onChange) onChange(JSON.stringify(newValue))
        } catch (e) {
            console.log('Error on edit')
        }
    }

    const remove = (index: number) => {
        const newValue = { ...values }

        newValue.links.splice(index, 1)

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
                <nav className={styles.navigation}>
                    <div className={styles.container}>
                        <ul>
                            {get(values, 'links', []).map((e: any, i: number) => (
                                <li key={i}>
                                    <StyledInput.a
                                        className={styles.title}
                                        value={get(e, 'title', '')}
                                        onChange={(e) => handleChange(`links.${i}.title`, e)}
                                    />

                                    <Button
                                        onClick={() => remove(i)}
                                        size="small"
                                        shape="circle"
                                        type="primary"
                                        danger
                                        style={{
                                            position: 'absolute',
                                            top: -1,
                                        }}
                                        icon={<MinusOutlined />}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Button
                        onClick={() => handleChange(`links.${get(values, 'links', []).length}`, {})}
                        size="small"
                        shape="circle"
                        type="primary"
                        style={{
                            position: 'absolute',
                            top: 4,
                            right: 5,
                        }}
                        icon={<PlusOutlined />}
                    />
                </nav>
            }
            panel={
                <Space direction="vertical" style={{ width: '100%' }}>
                    {get(values, 'links', []).map((e: any, i: number) => (
                        <Fragment key={i}>
                            <Text>Link {e.title}</Text>
                            <LinkInput value={e.link} onChange={(e) => handleChange(`links.${i}.link`, e)} />
                        </Fragment>
                    ))}
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
