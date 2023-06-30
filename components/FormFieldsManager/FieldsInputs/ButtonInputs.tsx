import { Col, Row, Input, Divider, Select } from 'antd'
import { FieldInputsProps } from '.'
import WithLabel from '~/components/WithLabel'
import LinkSelect from '~/components/LinkSelect'
import { LinkProtocol, FormButtonType } from '@prisma/client'

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
                                { value: FormButtonType.SUBMIT, label: 'Submit' },
                                { value: FormButtonType.LINK, label: 'Link' },
                                { value: FormButtonType.RESET, label: 'Reset', disabled: true },
                            ]}
                            value={field.buttonType}
                            onChange={(e) => {
                                onChange('buttonType', e)

                                if (e === 'link') {
                                    onChange('link', {
                                        type: 'OUT',
                                        protocol: LinkProtocol.HTTPS,
                                    })
                                } else {
                                    onChange('link', undefined)
                                }
                            }}
                        />
                    </WithLabel>
                </Col>
                {field.buttonType === 'link' && (
                    <Col span={8}>
                        <WithLabel label="Link">
                            <LinkSelect value={field.link!} onChange={(e) => onChange('link', e)} />
                        </WithLabel>
                    </Col>
                )}
            </Row>
        </>
    )
}

export default TextInputs
