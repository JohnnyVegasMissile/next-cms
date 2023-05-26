import { Col, Row, Input, Radio, Divider } from 'antd'
import { FieldInputsProps } from '.'
import WithLabel from '~/components/WithLabel'
import ListSelect from '~/components/ListSelect'

const TextInputs = ({ field, errors, onChange }: FieldInputsProps) => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <WithLabel label="Label" error={errors?.label}>
                        <Input
                            size="small"
                            style={{ width: '100%' }}
                            name="title"
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
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <WithLabel label="Container" error={errors?.containerId}>
                        <ListSelect.Container
                            value={field.containerId}
                            onChange={(e) => onChange('containerId', e)}
                        />
                    </WithLabel>
                </Col>
            </Row>
        </>
    )
}

export default TextInputs
