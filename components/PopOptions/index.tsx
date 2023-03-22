import { Button, Divider, Popconfirm, Popover, Space } from 'antd'
import { CaretUpOutlined, CaretDownOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, ReactNode } from 'react'

interface PopOptionsProps {
    onUp(): void
    disableUp?: boolean
    onDown(): void
    disableDown?: boolean
    onDelete(): void
    alert?: boolean
    children: ReactNode
}

const PopOptions = ({ onUp, disableUp, onDown, disableDown, onDelete, alert, children }: PopOptionsProps) => {
    const [open, setOpen] = useState(false)

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Popover
                open={open}
                onOpenChange={setOpen}
                trigger="click"
                placement="bottom"
                content={
                    <Space direction="vertical">
                        <Button
                            size="small"
                            disabled={disableUp}
                            onClick={(e) => {
                                e.stopPropagation()
                                onUp()
                                setOpen(false)
                            }}
                            icon={<CaretUpOutlined />}
                            type="primary"
                        />
                        <Button
                            size="small"
                            disabled={disableDown}
                            onClick={(e) => {
                                e.stopPropagation()
                                onDown()
                                setOpen(false)
                            }}
                            icon={<CaretDownOutlined />}
                            type="primary"
                        />
                        <Divider style={{ margin: 0 }} />
                        {alert ? (
                            <Popconfirm
                                placement="left"
                                title="Delete the field ?"
                                description="The data from releated contents will be lost."
                                onConfirm={(e) => {
                                    e?.stopPropagation()
                                    onDelete()
                                    setOpen(false)
                                }}
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
                        ) : (
                            <Button
                                size="small"
                                icon={<DeleteOutlined />}
                                danger
                                type="primary"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete()
                                    setOpen(false)
                                }}
                            />
                        )}
                    </Space>
                }
            >
                <div onClick={() => setOpen(!open)}>{children}</div>
            </Popover>
        </div>
    )
}

export default PopOptions
