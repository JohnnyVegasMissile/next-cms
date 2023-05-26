import { Button, Col, Row, Input, Space, Divider, Radio, Select } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { FieldInputsProps } from '.'
import WithLabel from '~/components/WithLabel'

const TextInputs = ({ field, errors, onChange }: FieldInputsProps) => {
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
                    <WithLabel label="Options" error={errors?.options}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {field.options?.map((option, idx) => (
                                <Space.Compact key={idx} size="small" style={{ width: '100%' }}>
                                    <Input
                                        size="small"
                                        placeholder="Value"
                                        value={option.value}
                                        onChange={(e) => onChange(`options.${idx}.value`, e.target.value)}
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
                                        icon={<DeleteOutlined rev={undefined} />}
                                        onClick={() => {
                                            const optionsCopy = [...(field.options || [])]

                                            optionsCopy.splice(idx, 1)
                                            onChange('options', optionsCopy)
                                        }}
                                    />
                                </Space.Compact>
                            ))}

                            <Button
                                icon={<PlusOutlined rev={undefined} />}
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
                <Col span={8}>
                    <WithLabel label="Default" error={errors?.default}>
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
                            value={field.default?.split(', ')}
                            onChange={(e) => onChange('default', e?.join(', '))}
                        />
                    </WithLabel>
                </Col>
            </Row>
        </>
    )
}

export default TextInputs
