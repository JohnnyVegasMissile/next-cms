import { Card, Col, Divider, Input, InputNumber, Row, Select, Space, Switch, Typography } from 'antd'
import WithLabel from '~/components/WithLabel'
import { FieldInputsProps } from '.'
import { useEffect, useState } from 'react'
import metadataTypes from '~/utilities/metadataTypes'

const { Text } = Typography

const StringInputs = ({ field, onChange }: FieldInputsProps) => {
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
            {/* <Col span={12}>
                <WithLabel label="Default :">
                    {field.multiple ? (
                        <Select
                            mode="tags"
                            size="small"
                            options={field.defaultMultipleTextValue?.map((e) => ({ value: e }))}
                            style={{ width: '100%' }}
                            value={field.defaultMultipleTextValue}
                            onChange={(e) => onChange('defaultMultipleTextValue', e)}
                        />
                    ) : (
                        <Input
                            size="small"
                            style={{ width: '100%' }}
                            value={field.defaultTextValue}
                            onChange={(e) => onChange('defaultTextValue', e.target.value)}
                        />
                    )}
                </WithLabel>
            </Col> */}

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
                                />
                            ))}
                            <Input
                                allowClear
                                size="small"
                                placeholder="+ Add new value"
                                style={{ width: '100%' }}
                                value={newValue}
                                onBlur={() => {
                                    if (!!newValue) {
                                        onChange(
                                            `defaultMultipleTextValue.${field.defaultMultipleTextValue?.length}`,
                                            newValue
                                        )
                                        setNewValue('')
                                    }
                                }}
                                onChange={(e) => setNewValue(e.target.value)}
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
                            <Input.Group compact>
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
                            </Input.Group>
                        </WithLabel>
                    </Col>
                    <Col span={12} />
                </>
            )}
        </Row>
    )
}

export default StringInputs
