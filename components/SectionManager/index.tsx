import { Space, Button, Card, Divider, Typography } from 'antd'
import get from 'lodash.get'
import GetEditComponent from '../../components/GetEditComponent'
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined, CloseOutlined } from '@ant-design/icons'
import { FullSectionEdit } from '../../types'
import CustomSelect from '../../components/CustomSelect'
import DisplayElementView from '../../components/DisplayElementView'
import set from 'lodash.set'

const { Text } = Typography

interface SectionManagerProps {
    values: FullSectionEdit[]
    onChange(value: FullSectionEdit[]): void
}

const SectionManager = ({ values, onChange }: SectionManagerProps) => {
    const addSection = () => {
        onChange([
            ...values,
            {
                type: null,
                position: values.length,
                content: '{}',
            },
        ])
    }

    const removeSection = (index: number) => {
        let newValue = [...values]
        newValue.splice(index, 1)

        onChange(newValue)
    }

    const SectionUp = (index: number) => {
        let newValue = [...values]
        const temp = newValue[index]
        newValue[index] = newValue[index - 1]
        newValue[index - 1] = temp

        onChange(newValue)
    }

    const SectionDown = (index: number) => {
        let newValue = [...values]
        const temp = newValue[index]
        newValue[index] = newValue[index + 1]
        newValue[index + 1] = temp

        onChange(newValue)
    }

    const onHandleChange = (name: string, value: any) => {
        let newValue = [...values]
        set(newValue, name, value)

        onChange(newValue)
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {values.map((section, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8 }}>
                    <Space direction="vertical" size={1}>
                        <Button
                            disabled={idx === 0}
                            onClick={() => SectionUp(idx)}
                            type="primary"
                            // shape="circle"
                            icon={<CaretUpOutlined />}
                        />
                        <Button
                            disabled={idx === get(values, 'sections', []).length - 1}
                            onClick={() => SectionDown(idx)}
                            type="primary"
                            // shape="circle"
                            icon={<CaretDownOutlined />}
                        />
                    </Space>
                    <Card
                        bodyStyle={{ padding: 0 }}
                        title={
                            <Space>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 'normal',
                                    }}
                                >
                                    Block:
                                </Text>
                                <CustomSelect.ListSections
                                    section={section.block || undefined}
                                    element={section.elementId || undefined}
                                    onSectionChange={(e) => onHandleChange(`${idx}.type`, e)}
                                    onElementChange={(e) => onHandleChange(`${idx}.elementId`, e)}
                                />
                                <Divider type="vertical" />
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 'normal',
                                    }}
                                >
                                    Form:
                                </Text>
                                <CustomSelect.ListForms
                                    value={section.formId}
                                    onChange={(e) => onHandleChange(`${idx}.formId`, e)}
                                />
                            </Space>
                        }
                        extra={
                            <Button
                                type="primary"
                                onClick={() => removeSection(idx)}
                                danger
                                // shape="circle"
                                icon={<CloseOutlined />}
                            />
                        }
                        style={{ flex: 1 }}
                    >
                        {!!section.block && (
                            <GetEditComponent
                                block={section.block}
                                defaultValues={section.content}
                                onChange={(e) => onHandleChange(`sections.${idx}.content`, e)}
                            />
                        )}
                        {!!section.elementId && <DisplayElementView id={section.elementId} />}
                    </Card>
                </div>
            ))}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Button
                    type="primary"
                    // shape="round"
                    icon={<PlusOutlined />}
                    // size="small"
                    onClick={addSection}
                >
                    Add section
                </Button>
            </div>
        </Space>
    )
}

export default SectionManager
