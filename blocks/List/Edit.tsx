import { useState } from 'react'
import styles from './List.module.css'

import type { Props } from '../types'
import CustomImage from '../../components/CustomImage'
import { Button, Card, Switch } from 'antd'
import StyledInput from '../../components/StyledInput'
import get from 'lodash.get'
import set from 'lodash.set'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import MediaModal from '../../components/MediaModal'

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
                    <div
                        className={`${styles.wrapper} ${
                            values.reversed ? styles.reverse : ''
                        }`}
                    >
                        <CustomImage.Background className={styles.image} img={values.img}>
                            <div className={styles.layer} />
                        </CustomImage.Background>
                        <div className={styles.listWrap}>
                            <StyledInput.h3
                                className={styles.title}
                                value={values.title}
                                onChange={(e) => handleChange('title', e)}
                            />
                            <ul className={styles.list}>
                                {get(values, 'list', []).map((e: any, idx: number) => (
                                    <>
                                        <StyledInput.li
                                            key={idx}
                                            value={e}
                                            onChange={(e) => handleChange(`list.${idx}`, e)}
                                        />

                                        <Button
                                            onClick={() => {
                                                const newValue = { ...values }
                                                newValue.list.splice(idx, 1)
                                                handleChange('list', newValue.list)
                                            }}
                                            size="small"
                                            type="primary"
                                            danger
                                            shape="circle"
                                            icon={<CloseOutlined />}
                                        />
                                    </>
                                ))}
                            </ul>
                            <Button
                                onClick={() =>
                                    handleChange(`list.${get(values, 'list', []).length}`, '')
                                }
                                size="small"
                                type="primary"
                                shape="circle"
                                icon={<PlusOutlined />}
                            />
                        </div>
                    </div>
                </section>
            }
            panel={
                <>
                    <MediaModal
                        value={get(values, `img`, undefined)}
                        onMediaSelected={(e) => handleChange('img', e)}
                    />
                    <Switch
                        checked={get(values, 'reversed', false)}
                        onChange={(checked: boolean) => handleChange('reversed', checked)}
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
        <div style={{ flex: 5, backgroundColor: 'rgb(240, 242, 245)' }}>{view}</div>
        {!!panel && (
            <Card title="Settings Panel" style={{ flex: 1, marginTop: 1 }} bordered={false}>
                {panel}
            </Card>
        )}
    </div>
)

export default Edit
