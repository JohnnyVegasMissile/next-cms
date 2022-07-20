import { Fragment, useState } from 'react'
import styles from './Navigation.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import { Button, Card, Space, Switch } from 'antd'
import StyledInput from '../../components/StyledInput'
import get from 'lodash.get'
import set from 'lodash.set'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import MediaModal from '../../components/MediaModal'
import LinkInput from '../../components/LinkInput'
import Link from 'next/link'

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

    return (
        <EditPanel
            view={
                // <div className={styles.container}>
                <div className={styles.wrapperUnfixed}>
                    <nav className={styles.nav}>
                        {get(values, 'list', []).map((e: any, idx: number) => (
                            <Fragment key={idx}>
                                <StyledInput.a
                                    className={styles.link}
                                    value={e.label}
                                    onChange={(e) => handleChange(`list.${idx}.label`, e)}
                                />
                                <Button
                                    size="small"
                                    type="primary"
                                    danger
                                    shape="circle"
                                    icon={<CloseOutlined />}
                                />
                            </Fragment>
                        ))}
                        <Button
                            onClick={() =>
                                handleChange(`list.${get(values, 'list', []).length}`, {})
                            }
                            size="small"
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                        />
                    </nav>
                    {/* </div> */}
                </div>
            }
            panel={
                <>
                    <Space direction="vertical">
                        {get(values, 'list', []).map((e: any, idx: number) => (
                            <Fragment key={idx}>
                                <span>{e.label}</span>
                                <LinkInput
                                    value={get(e, 'link', '')}
                                    onChange={(e) => handleChange(`list.${idx}.link`, e)}
                                />
                            </Fragment>
                        ))}
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
        <div style={{ flex: 5, backgroundColor: 'rgb(240, 242, 245)' }}>{view}</div>
        {!!panel && (
            <Card title="Settings Panel" style={{ flex: 1, marginTop: 1 }} bordered={false}>
                {panel}
            </Card>
        )}
    </div>
)

export default Edit
