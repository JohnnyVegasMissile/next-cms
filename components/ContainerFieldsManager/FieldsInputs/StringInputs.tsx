import { Card, Col, Divider, Input, InputNumber, Row, Select, Space, Switch, Typography } from 'antd'
import WithLabel from '~/components/WithLabel'
import { FieldInputsProps } from '.'
import { useEffect, useState } from 'react'
import metadataTypes from '~/utilities/metadataTypes'

const { Text } = Typography

const StringInputs = ({ field, errors, onChange }: FieldInputsProps) => {
    const [newValue, setNewValue] = useState('')
    useEffect(() => {
        if (field.multiple) {
            if (field.defaultTextValue) onChange('defaultMultipleTextValue', [field.defaultTextValue])
        } else {
            if (!!field.defaultMultipleTextValue?.length)
                onChange('defaultTextValue', field.defaultMultipleTextValue[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.multiple])

    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <WithLabel
                    error={errors?.name}
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
                >
                    <Input
                        size="small"
                        status={!!errors?.name ? 'error' : undefined}
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
                            {field.defaultMultipleTextValue?.map((text, idx) => (
                                <Input
                                    allowClear
                                    key={idx}
                                    size="small"
                                    placeholder="Detault text"
                                    style={{ width: '100%' }}
                                    value={text}
                                    onBlur={() => {
                                        if (!text) {
                                            const copyTexts = [...field.defaultMultipleTextValue!]
                                            copyTexts.splice(idx, 1)
                                            onChange('defaultMultipleTextValue', copyTexts)
                                        }
                                    }}
                                    onChange={(e) =>
                                        onChange(`defaultMultipleTextValue.${idx}`, e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        console.log('e')
                                        if (e.code === 'Enter' && !(e.target as any).value) {
                                            const copyTexts = [...field.defaultMultipleTextValue!]
                                            copyTexts.splice(idx, 1)
                                            onChange('defaultMultipleTextValue', copyTexts)
                                        }
                                    }}
                                />
                            ))}
                            <Input
                                key="new"
                                allowClear
                                size="small"
                                placeholder="+ Add new value"
                                style={{ width: '100%' }}
                                value={newValue}
                                onBlur={() => {
                                    if (!!newValue) {
                                        onChange(
                                            `defaultMultipleTextValue.${
                                                field.defaultMultipleTextValue?.length || 0
                                            }`,
                                            newValue
                                        )
                                        setNewValue('')
                                    }
                                }}
                                onChange={(e) => setNewValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.code === 'Enter') {
                                        onChange(
                                            `defaultMultipleTextValue.${
                                                field.defaultMultipleTextValue?.length || 0
                                            }`,
                                            newValue
                                        )
                                        setNewValue('')
                                    }
                                }}
                            />
                        </Space>
                    </Card>
                ) : (
                    <WithLabel label="Default :">
                        <Input
                            size="small"
                            style={{ width: '100%' }}
                            value={field.defaultTextValue}
                            onChange={(e) => onChange('defaultTextValue', e.target.value)}
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
                                    precision={0}
                                    min={1}
                                    max={field.max}
                                    size="small"
                                    style={{ width: '50%' }}
                                    value={field.min}
                                    onChange={(e) => onChange('min', e)}
                                />
                                <InputNumber
                                    precision={0}
                                    min={field.min || 2}
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

export default StringInputs
