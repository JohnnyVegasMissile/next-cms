import { Button, Drawer, Dropdown, Space } from 'antd'
import { PlusOutlined, PicCenterOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons'
import SectionCreation from '~/types/sectionCreation'
import blocks, { BlockKey, EditBlockProps } from '~/blocks'
import { SectionsContext } from '~/hooks/useSection'
import { tempId } from '~/utilities'
import { useState } from 'react'
import PopOptions from '../PopOptions'

interface SectionsManagerProps {
    name: string
    sections: SectionCreation[]
    onChange: (name: string, value: any) => void
    error: any
    label?: string
}

const SectionsManager = ({ name, sections, onChange, error, label }: SectionsManagerProps) => {
    const items = [
        {
            key: 'elements',
            label: 'Elements',
            icon: <PicCenterOutlined />,
            children: Object.keys(blocks).map((key) => ({ key, label: key })),
        },
        {
            key: 'blocks',
            label: 'Blocks',
            type: 'group',
            children: Object.keys(blocks).map((key) => ({
                key,
                label: blocks[key as BlockKey].title,
                onClick: () =>
                    onChange(name, [
                        ...sections,
                        {
                            tempId: tempId(),
                            block: key as BlockKey,
                            position: sections.length,
                            value: blocks?.[key as BlockKey]?.default
                                ? blocks?.[key as BlockKey]?.default
                                : {},

                            medias: new Map(),
                            forms: new Map(),
                            links: new Map(),
                            menus: new Map(),
                        },
                    ]),
            })),
        },
    ]

    return (
        <>
            <SectionsContext.Provider
                value={{
                    sections,
                    setFieldValue: (nameField: string, value: any) => onChange(`${name}.${nameField}`, value),
                    errors: error as any,
                }}
            >
                {sections.map((section, idx) => {
                    const Block = blocks[section.block].Edit

                    return (
                        <SectionWrap
                            key={section.id || section.tempId || idx}
                            position={section.position}
                            Edit={Block}
                            Panel={Block.Panel}
                        />
                    )
                })}
            </SectionsContext.Provider>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Dropdown menu={{ items }}>
                    <Button size="small" type="primary" icon={<PlusOutlined />}>
                        Add {label ? label : 'section'}
                    </Button>
                </Dropdown>
            </div>
        </>
    )
}

interface SectionWrapProps {
    position: number
    Edit({ position }: EditBlockProps): JSX.Element
    Panel?({ position }: EditBlockProps): JSX.Element
}

const SectionWrap = ({ Edit, Panel, position }: SectionWrapProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            {!!Panel && (
                <Drawer
                    placement="right"
                    closable={false}
                    onClose={() => setOpen(false)}
                    open={open}
                    getContainer={false}
                >
                    <Panel position={position} />
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
                    {!!Panel && <Button size="small" onClick={() => setOpen(true)} icon={<MenuOutlined />} />}
                </Space.Compact>

                <Edit position={position} />
            </div>
        </>
    )
}

export default SectionsManager
