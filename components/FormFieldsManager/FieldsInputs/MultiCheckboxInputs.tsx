import { Button, Col, Row, Input, Space, Divider, Radio, Checkbox, Typography, Tooltip } from 'antd'
import { PlusOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons'
import { FieldInputsProps } from '.'
import WithLabel from '~/components/WithLabel'
import { useMemo } from 'react'

const { Text } = Typography

const TextInputs = ({ field, errors, onChange }: FieldInputsProps) => {
    const defaultValues = useMemo(() => {
        return (field.default as string)?.split(', ') || []
    }, [field.default])

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <WithLabel label="Label" error={errors?.label}>
                        <Input
                            size="small"
                            value={field.label}
                            onChange={(e) => onChange('label', e.target.value)}
                        />
                    </WithLabel>
                </Col>
                <Col span={8}>
                    <WithLabel label="Required" error={errors?.required}>
                        <Radio.Group
                            value={field.required}
                            onChange={(e) => onChange('required', e.target.value)}
                        >
                            <Radio value={true}>Required</Radio>
                            <Radio value={false}>Not Required</Radio>
                        </Radio.Group>
                    </WithLabel>
                </Col>
                <Col span={8}>
                    <WithLabel label="Placeholder" error={errors?.placeholder}>
                        <Input
                            size="small"
                            value={field.placeholder}
                            onChange={(e) => onChange('placeholder', e.target.value)}
                        />
                    </WithLabel>
                </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <WithLabel
                        label={
                            <Space>
                                <Text>Options</Text>
                                <Tooltip title="Clear default">
                                    <Button
                                        icon={<ClearOutlined />}
                                        type="dashed"
                                        size="small"
                                        disabled={!field.default}
                                        onClick={() => onChange('default', undefined)}
                                    />
                                </Tooltip>
                            </Space>
                        }
                        error={errors?.options}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {field.options?.map((option, idx) => (
                                <Space.Compact key={idx} size="small" style={{ width: '100%' }}>
                                    <Checkbox
                                        style={{ marginInlineEnd: 8 }}
                                        checked={!!option.value && !!defaultValues.includes(option.value)}
                                        disabled={!option.value}
                                        onClick={() => {
                                            const index = defaultValues.indexOf(option.value)

                                            const copy = [...defaultValues]
                                            if (index > -1) {
                                                copy.splice(index, 1)
                                            } else {
                                                copy.push(option.value)
                                            }

                                            onChange('default', copy.filter((e) => !!e).join(', '))
                                        }}
                                    />

                                    <Input
                                        size="small"
                                        placeholder="Value"
                                        value={option.value}
                                        onChange={(e) => {
                                            const value = e.target.value
                                            onChange(`options.${idx}.value`, value)

                                            const index = defaultValues.indexOf(option.value)

                                            const copy = [...defaultValues]
                                            if (index > -1) {
                                                copy[index] = value
                                                onChange('default', copy.filter((e) => !!e).join(', '))
                                            }
                                        }}
                                    />
                                    <Input
                                        size="small"
                                        placeholder="Name"
                                        value={option.label}
                                        onChange={(e) => onChange(`options.${idx}.label`, e.target.value)}
                                    />
                                    <Button
                                        type="primary"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            const optionsCopy = [...(field.options || [])]

                                            optionsCopy.splice(idx, 1)
                                            onChange('options', optionsCopy)

                                            const index = defaultValues.indexOf(option.value)
                                            if (index > -1) {
                                                const copy = [...defaultValues]
                                                copy.splice(index, 1)
                                                onChange('default', copy.filter((e) => !!e).join(', '))
                                            }
                                        }}
                                    />
                                </Space.Compact>
                            ))}

                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                size="small"
                                onClick={() =>
                                    onChange(`options.${field.options?.length || 0}`, {
                                        label: '',
                                        value: '',
                                    })
                                }
                            >
                                Add
                            </Button>
                        </Space>
                    </WithLabel>
                </Col>
                {/* <Col span={8}>
                    <WithLabel label="Default" error={errors?.default}>
                        {`${defaultValues.join(', ')}/${defaultValues.length}`}
                        <Select
                            allowClear
                            size="small"
                            mode="multiple"
                            style={{ width: '100%' }}
                            options={field.options
                                ?.filter((option) => !!option.value)
                                .map((option) => ({
                                    value: option.value,
                                    label: option.label || option.value,
                                }))}
                            value={defaultValues}
                            onChange={(e) => onChange('default', e?.join(', '))}
                        />
                    </WithLabel>
                </Col> */}
            </Row>
        </>
    )
}

export default TextInputs
