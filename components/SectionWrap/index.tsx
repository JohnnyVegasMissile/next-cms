import { ReactNode, useState } from 'react'
import styles from './SectionWrap.module.scss'
import { Button, Divider, Drawer, Input, Popconfirm, Popover, Space } from 'antd'
import {
    CaretUpOutlined,
    CaretDownOutlined,
    DeleteOutlined,
    SettingOutlined,
    MenuOutlined,
} from '@ant-design/icons'

interface SectionWrapProps {
    position: number
    children: ReactNode
    panel: ReactNode
}

const SectionWrap = ({ position, children, panel }: SectionWrapProps) => {
    // const { sections, setFieldValue } = useContext(SectionsContext)
    const [open, setOpen] = useState(false)

    return (
        <>
            {!!panel && (
                <Drawer
                    placement="right"
                    closable={false}
                    onClose={() => setOpen(false)}
                    open={open}
                    getContainer={false}
                >
                    {panel}
                </Drawer>
            )}
            <div style={{ position: 'relative' }}>
                <Input.Group compact className={styles['buttons-wrap']}>
                    <Popover
                        placement="bottom"
                        content={
                            <Space direction="vertical">
                                <Button
                                    size="small"
                                    onClick={(e) => e.stopPropagation()}
                                    icon={<CaretUpOutlined />}
                                    type="primary"
                                />
                                <Button
                                    size="small"
                                    onClick={(e) => e.stopPropagation()}
                                    icon={<CaretDownOutlined />}
                                    type="primary"
                                />
                                <Divider style={{ margin: 0 }} />

                                <Popconfirm
                                    placement="left"
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={(e) => e?.stopPropagation()}
                                    onCancel={(e) => e?.stopPropagation()}
                                    okText="Delete"
                                    cancelText="Cancel"
                                >
                                    <Button
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        danger
                                        type="primary"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Popconfirm>
                            </Space>
                        }
                        trigger="click"
                    >
                        <Button size="small" type="primary" icon={<SettingOutlined />} />
                    </Popover>
                    {!!panel && <Button size="small" onClick={() => setOpen(true)} icon={<MenuOutlined />} />}
                </Input.Group>

                {children}
            </div>
        </>
    )
}

export default SectionWrap
