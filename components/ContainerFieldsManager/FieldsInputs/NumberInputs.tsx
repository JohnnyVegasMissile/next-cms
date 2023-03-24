import { Card, Col, Divider, Input, InputNumber, Row, Select, Space, Switch, Typography } from 'antd'
import WithLabel from '~/components/WithLabel'
import { FieldInputsProps } from '.'
import { useEffect, useState } from 'react'
import metadataTypes from '~/utilities/metadataTypes'

const { Text } = Typography

const NumberInputs = ({ field, onChange }: FieldInputsProps) => {
    const [newValue, setNewValue] = useState<number>()
    useEffect(() => {
        if (field.multiple) {
            if (field.defaultNumberValue) onChange('defaultMultipleNumberValue', [field.defaultNumberValue])
        } else {
            if (!!field.defaultMultipleNumberValue?.length)
                onChange('defaultNumberValue', field.defaultMultipleNumberValue[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.multiple])

    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <WithLabel
                    label={
                        <Space>
                            <Text type="secondary">Name :</Text>

                            <Switch
                                size="small"
                                checked={field.required}
                                onChange={(e) => onChange('required', e)}
                                checkedChildren="Required"
                                unCheckedChildren="Optional"
                            />
                        </Space>
                    }
                    error="Name is required"
                >
                    <Input
                        size="small"
                        status="error"
                        style={{ width: '100%' }}
                        value={field.name}
                        onChange={(e) => onChange('name', e.target.value)}
                    />
                </WithLabel>
            </Col>

            <Col span={12}>
                {field.multiple ? (
                    <Card
                        title={
                            <Text style={{ fontWeight: 'normal' }} type="secondary">
                                Default :
                            </Text>
                        }
                        size="small"
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {field.defaultMultipleNumberValue?.map((text, idx) => (
                                <InputNumber
                                    key={idx}
                                    size="small"
                                    placeholder="Detault text"
                                    style={{ width: '100%' }}
                                    value={text}
                                    onBlur={() => {
                                        if (text === undefined) {
                                            const copyTexts = [...field.defaultMultipleNumberValue!]
                                            copyTexts.splice(idx, 1)
                                            onChange('defaultMultipleNumberValue', copyTexts)
                                        }
                                    }}
                                    onChange={(e) => onChange(`defaultMultipleNumberValue.${idx}`, e)}
                                    onKeyDown={(e) => {
                                        if (e.code === 'Enter' && !(e.target as any).value === undefined) {
                                            const copyTexts = [...field.defaultMultipleNumberValue!]
                                            copyTexts.splice(idx, 1)
                                            onChange('defaultMultipleNumberValue', copyTexts)
                                        }
                                    }}
                                />
                            ))}
                            <InputNumber
                                key="new"
                                size="small"
                                placeholder="+ Add new value"
                                style={{ width: '100%' }}
                                value={newValue}
                                onBlur={() => {
                                    if (newValue !== undefined) {
                                        onChange(
                                            `defaultMultipleNumberValue.${field.defaultMultipleNumberValue?.length}`,
                                            newValue
                                        )
                                        setNewValue(undefined)
                                    }
                                }}
                                onChange={(e) => setNewValue(e || undefined)}
                                onKeyDown={(e) => {
                                    if (e.code === 'Enter') {
                                        onChange(
                                            `defaultMultipleNumberValue.${field.defaultMultipleNumberValue?.length}`,
                                            newValue
                                        )
                                        setNewValue(undefined)
                                    }
                                }}
                            />
                        </Space>
                    </Card>
                ) : (
                    <WithLabel label="Default :">
                        <InputNumber
                            size="small"
                            style={{ width: '100%' }}
                            value={field.defaultNumberValue}
                            onChange={(e) => onChange('defaultNumberValue', e)}
                        />
                    </WithLabel>
                )}
            </Col>

            <Col span={12}>
                <WithLabel label="Metadata :">
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        allowClear
                        size="small"
                        style={{ width: '100%' }}
                        value={field.metadatas}
                        onChange={(e) => onChange('metadatas', e)}
                        options={metadataTypes}
                    />
                </WithLabel>
            </Col>

            {field.multiple && (
                <>
                    <Col span={24}>
                        <Divider style={{ margin: 0, marginBottom: -10 }}>
                            <Text type="secondary">Multiple selection</Text>
                        </Divider>
                    </Col>
                    <Col span={12}>
                        <WithLabel
                            label={
                                <div style={{ display: 'flex' }}>
                                    <Text type="secondary" style={{ flex: 1 }}>
                                        Min :
                                    </Text>
                                    <Text type="secondary" style={{ flex: 1 }}>
                                        Max :
                                    </Text>
                                </div>
                            }
                        >
                            <Space.Compact size="small" style={{ width: '100%' }}>
                                <InputNumber
                                    min={field.required ? 1 : undefined}
                                    max={field.max}
                                    size="small"
                                    style={{ width: '50%' }}
                                    value={field.min}
                                    onChange={(e) => onChange('min', e)}
                                />
                                <InputNumber
                                    min={field.min}
                                    size="small"
                                    style={{ width: '50%' }}
                                    value={field.max}
                                    onChange={(e) => onChange('max', e)}
                                />
                            </Space.Compact>
                        </WithLabel>
                    </Col>
                    <Col span={12} />
                </>
            )}
        </Row>
    )
}

export default NumberInputs
