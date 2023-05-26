import { Col, Row, Input, Switch } from 'antd'
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
                    <WithLabel label="Default" error={errors?.default}>
                        <Switch
                            size="small"
                            checked={field.default === 'true'}
                            onChange={(e) => onChange('default', e ? 'true' : 'false')}
                            checkedChildren="Checked"
                            unCheckedChildren="Unchecked"
                        />
                    </WithLabel>
                </Col>
            </Row>
        </>
    )
}

export default TextInputs
