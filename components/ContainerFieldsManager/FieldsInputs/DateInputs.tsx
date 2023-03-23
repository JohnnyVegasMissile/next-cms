import {
    Card,
    Col,
    DatePicker,
    Divider,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Switch,
    Typography,
} from 'antd'
import WithLabel from '~/components/WithLabel'
import { FieldInputsProps } from '.'
import { useEffect } from 'react'
import metadataTypes from '~/utilities/metadataTypes'
import dayjs from 'dayjs'
import { RangePickerProps } from 'antd/es/date-picker'

const { Text } = Typography

const DateInputs = ({ field, onChange }: FieldInputsProps) => {
    useEffect(() => {
        if (field.multiple) {
            if (field.defaultDateValue) {
                onChange('defaultMultipleDateValue', [field.defaultDateValue])
            } else {
                onChange('defaultMultipleDateValue', [])
            }
        } else {
            if (!!field.defaultMultipleDateValue?.length)
                onChange('defaultDateValue', field.defaultMultipleDateValue[0])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.multiple])

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        if (!current || (!field.startDate && !field.endDate)) return true

        if (!field.startDate) return current > field.endDate!.endOf('day')

        if (!field.endDate) return current < field.startDate.endOf('day')

        return current > field.startDate.endOf('day') && current < field.endDate.endOf('day')
    }

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
            <Col span={12}>
                {field.multiple ? (
                    <Card
                        title={
                            <Text style={{ fontWeight: 'normal' }} type="secondary">
                                Default :
                            </Text>
                        }
                        size="small"
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {field.defaultMultipleDateValue?.map((date, idx) => (
                                <DatePicker
                                    placeholder="Date"
                                    key={idx}
                                    allowClear
                                    size="small"
                                    style={{ width: '100%' }}
                                    value={date}
                                    onChange={(e) => {
                                        if (!!e) {
                                            onChange(`defaultMultipleDateValue.${idx}`, e)
                                        } else {
                                            const copyDates = [...field.defaultMultipleDateValue!]
                                            copyDates.splice(idx, 1)
                                            onChange('defaultMultipleDateValue', copyDates)
                                        }
                                    }}
                                    disabledDate={disabledDate}
                                />
                            ))}
                            <DatePicker
                                key={field.defaultMultipleDateValue?.length}
                                placeholder="+ Add new value"
                                allowClear
                                size="small"
                                style={{ width: '100%' }}
                                value={undefined}
                                onChange={(e) => {
                                    if (!!e)
                                        onChange(
                                            `defaultMultipleDateValue.${field.defaultMultipleDateValue?.length}`,
                                            e
                                        )
                                }}
                                disabledDate={disabledDate}
                            />
                        </Space>
                    </Card>
                ) : (
                    <WithLabel label="Default :">
                        <DatePicker
                            size="small"
                            style={{ width: '100%' }}
                            value={field.defaultDateValue}
                            onChange={(e) => onChange('defaultDateValue', e)}
                            disabledDate={disabledDate}
                        />
                    </WithLabel>
                )}
            </Col>

            <Col span={12}>
                <WithLabel label="Metadata :">
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        allowClear
                        size="small"
                        style={{ width: '100%' }}
                        value={field.metadatas}
                        onChange={(e) => onChange('metadatas', e)}
                        options={metadataTypes}
                    />
                </WithLabel>
            </Col>
            <Col span={12}>
                <WithLabel
                    label={
                        <div style={{ display: 'flex' }}>
                            <Text type="secondary" style={{ flex: 1 }}>
                                From :
                            </Text>
                            <Text type="secondary" style={{ flex: 1 }}>
                                To :
                            </Text>
                        </div>
                    }
                >
                    <Space.Compact size="small" style={{ width: '100%' }}>
                        <DatePicker
                            size="small"
                            style={{ width: '50%' }}
                            value={field.startDate}
                            onChange={(e) => onChange('startDate', e)}
                            disabledDate={(current) => {
                                if (!current || !field.endDate) return true

                                return current < field.endDate.endOf('day')
                            }}
                        />
                        <DatePicker
                            size="small"
                            style={{ width: '50%' }}
                            value={field.endDate}
                            onChange={(e) => onChange('endDate', e)}
                            disabledDate={(current) => {
                                if (!current || !field.startDate) return true

                                return current > field.startDate.endOf('day')
                            }}
                        />
                    </Space.Compact>
                </WithLabel>
            </Col>

            {field.multiple && (
                <>
                    <Col span={24}>
                        <Divider style={{ margin: 0, marginBottom: -10 }}>
                            <Text type="secondary">Multiple selection</Text>
                        </Divider>
                    </Col>
                    <Col span={12}>
                        <WithLabel
                            label={
                                <div style={{ display: 'flex' }}>
                                    <Text type="secondary" style={{ flex: 1 }}>
                                        Min :
                                    </Text>
                                    <Text type="secondary" style={{ flex: 1 }}>
                                        Max :
                                    </Text>
                                </div>
                            }
                        >
                            <Space.Compact size="small" style={{ width: '100%' }}>
                                <InputNumber
                                    size="small"
                                    min={field.required ? 1 : undefined}
                                    max={field.max}
                                    style={{ width: '50%' }}
                                    value={field.min}
                                    onChange={(e) => onChange('min', e)}
                                />
                                <InputNumber
                                    size="small"
                                    min={field.min}
                                    style={{ width: '50%' }}
                                    value={field.max}
                                    onChange={(e) => onChange('max', e)}
                                />
                            </Space.Compact>
                        </WithLabel>
                    </Col>
                    <Col span={12} />
                </>
            )}
        </Row>
    )
}

export default DateInputs
