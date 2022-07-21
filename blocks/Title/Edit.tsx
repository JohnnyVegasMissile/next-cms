import { Fragment, useState } from 'react'
import styles from './Title.module.css'

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
                <section>
                    <div className={styles.background}>
                        <StyledInput.a
                            className={styles.title}
                            value={values.title}
                            onChange={(e) => handleChange('title', e)}
                        />
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
        <div style={{ flex: 5, backgroundColor: 'rgb(240, 242, 245)' }}>{view}</div>
        {!!panel && (
            <Card title="Settings Panel" style={{ flex: 1, marginTop: 1 }} bordered={false}>
                {panel}
            </Card>
        )}
    </div>
)

export default Edit
