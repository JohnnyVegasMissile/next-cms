import { Fragment, useState } from 'react'
import styles from './Example.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import { Button, Card } from 'antd'
import StyledInput from '../../components/StyledInput'
import get from 'lodash.get'
import set from 'lodash.set'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import MediaModal from '@components/MediaModal'

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
                <section className={styles.section}>
                    <div className={styles.container}>
                        <CustomImage
                            img={get(values, 'img', undefined)}
                            className={styles.leftContainer}
                        />
                        <div className={styles.rightContainer}>
                            <StyledInput.h1
                                className={styles.listTitle}
                                value={get(values, 'title', '')}
                                onChange={(e) => handleChange('title', e)}
                            />
                            <ul className={styles.listContainer}>
                                {get(values, 'list', []).map((e: string, idx: number) => (
                                    <Fragment key={idx}>
                                        <StyledInput.li
                                            className={styles.listElement}
                                            value={e}
                                            onChange={(e) =>
                                                handleChange(`list.${idx}`, e)
                                            }
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
                                        handleChange(
                                            `list.${get(values, 'list', []).length}`,
                                            ''
                                        )
                                    }
                                    size="small"
                                    type="primary"
                                    shape="circle"
                                    icon={<PlusOutlined />}
                                />
                            </ul>
                        </div>
                    </div>
                </section>
            }
            panel={
                <>
                    <MediaModal
                        value={get(values, 'img', undefined)}
                        onMediaSelected={(e) => handleChange('img', e)}
                    />
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
            <Card
                title="Settings Panel"
                style={{ flex: 1, marginTop: 1 }}
                bordered={false}
            >
                {panel}
            </Card>
        )}
    </div>
)

export default Edit
