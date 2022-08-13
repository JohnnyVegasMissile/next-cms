import { Space, Button, Card, Divider, Typography } from 'antd'
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined, CloseOutlined } from '@ant-design/icons'
import { FullSectionEdit, Theme } from '../../types'
import CustomSelect from '../../components/CustomSelect'
import GetEditComponent from '../../components/GetEditComponent'
import DisplayElementView from '../../components/DisplayElementView'
import set from 'lodash.set'
import { useQuery, UseQueryResult } from 'react-query'
import { getTheme } from '../../network/api'
import get from 'lodash.get'
import { ContainerField } from '@prisma/client'

const { Text } = Typography

interface SectionManagerProps {
    values: FullSectionEdit[]
    onChange(value: FullSectionEdit[]): void
    fields?: ContainerField[]
}

const SectionManager = ({ values, onChange, fields }: SectionManagerProps) => {
    const theme: UseQueryResult<Theme, Error> = useQuery<Theme, Error>(['theme'], () => getTheme())

    const addSection = () => {
        onChange([
            ...values,
            {
                block: null,
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
                            disabled={idx === values?.length - 1}
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
                                    onSectionChange={(e) => onHandleChange(`${idx}.block`, e)}
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
                                theme={get(theme, 'data', { background: '', primary: '', secondary: '' })}
                                defaultValues={section.content}
                                onChange={(e) => onHandleChange(`${idx}.content`, e)}
                                fields={fields}
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
