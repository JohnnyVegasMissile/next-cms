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
import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MultiInput from '~/components/MultiInputs'

dayjs.extend(customParseFormat)

const { Text } = Typography

const DateInputs = ({ field, errors, onChange }: FieldInputsProps) => {
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

    // const errorMultiDefault = errors?.defaultMultipleDateValue?.find((e: string) => !!e)

    const disabledDate = (current: Dayjs) => {
        if (!current || (!field.startDate && !field.endDate)) return false

        if (!field.startDate) return current.startOf('day') > field.endDate!.startOf('day')

        if (!field.endDate) return current.endOf('day') < field.startDate.endOf('day')

        return !(field.startDate.startOf('day') < current && current < field.endDate.endOf('day'))
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <WithLabel
                    error={errors?.name}
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
                >
                    <Input
                        size="small"
                        status={!!errors?.name ? 'error' : undefined}
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
                        <MultiInput.Date
                            startDate={field.startDate}
                            endDate={field.endDate}
                            values={field.defaultMultipleDateValue}
                            onChange={(e) => onChange('defaultMultipleDateValue', e)}
                            errors={errors?.defaultMultipleDateValue}
                        />
                    </Card>
                ) : (
                    <WithLabel label="Default :" error={errors?.defaultDateValue}>
                        <DatePicker
                            size="small"
                            status={!!errors?.defaultDateValue ? 'error' : undefined}
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
                                if (!current || !field.endDate) return false

                                return current > field.endDate.endOf('day')
                            }}
                        />
                        <DatePicker
                            size="small"
                            style={{ width: '50%' }}
                            value={field.endDate}
                            onChange={(e) => onChange('endDate', e)}
                            disabledDate={(current) => {
                                if (!current || !field.startDate) return false

                                return current < field.startDate.startOf('day')
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
                                    precision={0}
                                    min={1}
                                    max={field.max}
                                    size="small"
                                    style={{ width: '50%' }}
                                    value={field.min}
                                    onChange={(e) => onChange('min', e)}
                                />
                                <InputNumber
                                    precision={0}
                                    min={field.min || 2}
                                    size="small"
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
