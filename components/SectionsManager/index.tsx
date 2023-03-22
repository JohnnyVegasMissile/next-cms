import { Button, Dropdown } from 'antd'
import { PlusOutlined, PicCenterOutlined } from '@ant-design/icons'
import SectionCreation from '~/types/sectionCreation'
import blocks, { BlockKey } from '~/blocks'
import { SectionsContext } from '~/hooks/useSection'
import { tempId } from '~/utilities'

interface SectionsManagerProps {
    name: string
    sections: SectionCreation[]
    onChange: (name: string, value: any) => void
    error: any
}

const SectionsManager = ({ name, sections, onChange, error }: SectionsManagerProps) => {
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
                label: key,
                onClick: () =>
                    onChange(name, [
                        ...sections,
                        {
                            tempId: tempId(),
                            block: key as BlockKey,
                            position: sections.length,
                            content: blocks?.[key as BlockKey]?.default
                                ? blocks?.[key as BlockKey]?.default
                                : {},

                            medias: new Map(),
                            forms: new Map(),
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

                    return <Block key={section.id || section.tempId || idx} position={section.position} />
                })}
            </SectionsContext.Provider>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                <Dropdown menu={{ items }}>
                    <Button size="small" type="primary" icon={<PlusOutlined />}>
                        Add section
                    </Button>
                </Dropdown>
            </div>
        </>
    )
}

export default SectionsManager
