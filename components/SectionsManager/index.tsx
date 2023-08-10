import { Button, Drawer, Dropdown, Space } from 'antd'
import { PlusOutlined, PicCenterOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons'
import SectionCreation from '~/types/sectionCreation'
import blocks, { BlockKey, EditBlockProps } from '~/blocks'
import { SectionsContext } from '~/hooks/useSection'
import { tempId } from '~/utilities'
import { useState } from 'react'
import PopOptions from '../PopOptions'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface SectionsManagerProps {
    name: string
    sections: SectionCreation[]
    onChange: (name: string, value: any) => void
    error: any
    label?: string
}

const SectionsManager = ({ name, sections, onChange, error, label }: SectionsManagerProps) => {
    const [parent] = useAutoAnimate()
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

    const handleDelete = (idx: number) => {
        const newSections = [...sections]
        newSections.splice(idx, 1)

        for (let i = idx; i < newSections.length; i++) {
            newSections[i]!.position = i
        }

        onChange(name, newSections)
    }

    const handleDown = (idx: number) => {
        let newSections = [...sections]
        const temp = newSections[idx]!
        newSections[idx] = { ...newSections[idx + 1]!, position: idx }
        newSections[idx + 1] = { ...temp, position: idx + 1 }

        onChange(name, newSections)
    }

    const handleUp = (idx: number) => {
        let newSections = [...sections]
        const temp = newSections[idx]!
        newSections[idx] = { ...newSections[idx - 1]!, position: idx }
        newSections[idx - 1] = { ...temp, position: idx - 1 }

        onChange(name, newSections)
    }

    return (
        <>
            <SectionsContext.Provider
                value={{
                    sections,
                    setFieldValue: (nameField: string, value: any) => onChange(`${name}.${nameField}`, value),
                    errors: error as any,
                }}
            >
                <div ref={parent}>
                    {sections.map((section, idx) => {
                        const Block = blocks[section.block].Edit

                        return (
                            <SectionWrap
                                key={section.id || section.tempId || idx}
                                position={section.position}
                                Edit={Block}
                                Panel={Block.Panel}
                                onDelete={() => handleDelete(idx)}
                                onDown={() => handleDown(idx)}
                                onUp={() => handleUp(idx)}
                                isFirst={idx === 0}
                                isLast={idx === sections.length - 1}
                            />
                        )
                    })}
                </div>
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
    onUp(): void
    onDown(): void
    onDelete(): void
    isFirst: boolean
    isLast: boolean
}

const SectionWrap = ({
    Edit,
    Panel,
    position,
    onDelete,
    onDown,
    onUp,
    isFirst,
    isLast,
}: SectionWrapProps) => {
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
                        onUp={onUp}
                        disableUp={isFirst}
                        onDown={onDown}
                        disableDown={isLast}
                        onDelete={onDelete}
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
