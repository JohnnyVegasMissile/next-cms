import { Col, Row, Input } from 'antd'
import { FieldInputsProps } from '.'
import WithLabel from '~/components/WithLabel'

const TextInputs = ({ field, errors, onChange }: FieldInputsProps) => {
    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <WithLabel label="Title" error={errors?.label}>
                    <Input
                        size="small"
                        value={field.label}
                        onChange={(e) => onChange('label', e.target.value)}
                    />
                </WithLabel>
            </Col>
        </Row>
    )
}

export default TextInputs
