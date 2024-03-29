import { ReactNode, useState } from 'react'
import styles from './SectionWrap.module.scss'
import { Button, Drawer, Space } from 'antd'
import { SettingOutlined, MenuOutlined } from '@ant-design/icons'
import PopOptions from '../PopOptions'

interface SectionWrapProps {
    position: number
    children: ReactNode
    panel: ReactNode
}

const SectionWrap = ({ children, panel }: SectionWrapProps) => {
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
                <Space.Compact
                    size="small"
                    style={{
                        position: 'absolute',
                        top: '0.25rem',
                        right: '0.25rem',
                        width: 'fit-content',
                        opacity: 1,
                        zIndex: 999,
                    }}
                >
                    <PopOptions
                        onUp={() => {}}
                        disableUp={true}
                        onDown={() => {}}
                        disableDown={true}
                        onDelete={() => {}}
                    >
                        <Button size="small" type="primary" icon={<SettingOutlined />} />
                    </PopOptions>
                    {!!panel && <Button size="small" onClick={() => setOpen(true)} icon={<MenuOutlined />} />}
                </Space.Compact>

                {children}
            </div>
        </>
    )
}

export default SectionWrap
