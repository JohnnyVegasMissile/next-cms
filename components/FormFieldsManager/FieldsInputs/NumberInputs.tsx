import { Col, Row, Input, Space, InputNumber, Divider, Radio } from 'antd'
import { FieldInputsProps } from '.'
import WithLabel from '~/components/WithLabel'

const NumberInputs = ({ field, errors, onChange }: FieldInputsProps) => {
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
                    <WithLabel label="Min/Max">
                        <Space.Compact size="small">
                            <InputNumber
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
                                onChange={(e) => onChange('min', e)}
                            />
                        </Space.Compact>
                    </WithLabel>
                </Col>
                <Col span={8}>
                    <WithLabel label="Default" error={errors?.default}>
                        <Input
                            size="small"
                            value={field.default}
                            onChange={(e) => onChange('default', e.target.value)}
                        />
                    </WithLabel>
                </Col>
            </Row>
        </>
    )
}

export default NumberInputs
