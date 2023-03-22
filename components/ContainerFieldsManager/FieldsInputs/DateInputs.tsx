import { Col, Input, Row, Space, Switch, Typography } from 'antd'
import WithLabel from '~/components/WithLabel'
import { FieldInputsProps } from '.'

const { Text } = Typography

const DateInputs = ({ field, onChange }: FieldInputsProps) => {
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
        </Row>
    )
}

export default DateInputs
