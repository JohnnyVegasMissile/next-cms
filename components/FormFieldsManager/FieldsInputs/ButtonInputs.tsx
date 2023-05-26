import { Col, Row, Input, Divider, Select } from 'antd'
import { FieldInputsProps } from '.'
import WithLabel from '~/components/WithLabel'
import LinkSelect from '~/components/LinkSelect'

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
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <WithLabel label="Type">
                        <Select
                            size="small"
                            style={{ width: '100%' }}
                            options={[
                                { key: 'submit', label: 'Submit' },
                                { key: 'link', label: 'Link' },
                            ]}
                            value={field.buttonType}
                            onChange={(e) => onChange('buttonType', e)}
                        />
                    </WithLabel>
                </Col>
                <Col span={8}>
                    <WithLabel label="Link">
                        <LinkSelect
                            value={{
                                type: 'OUT',
                            }}
                            onChange={(e) => onChange('link', e)}
                        />
                    </WithLabel>
                </Col>
            </Row>
        </>
    )
}

export default TextInputs
