import { Col, Row, Input, Divider, Radio } from 'antd'
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
                    <WithLabel label="Required">
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
                    <WithLabel label="Placeholder">
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
                    <WithLabel label="Default" error={errors.default}>
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

export default TextInputs
