import { ContainerField, ContainerFieldType } from '@prisma/client'
import { DatePicker, Input, InputNumber, Select, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { ObjectId } from '~/types'

const { Text } = Typography

interface ContentsFilterProps {
    values: Map<ObjectId, { operator?: string; value?: any }>
    onChange(value: Map<ObjectId, { operator?: string; value?: any }>): void
    fields: ContainerField[]
}

const ContentsFilter = ({ fields, values, onChange }: ContentsFilterProps) => {
    // const [values, setValue] = useState<Map<ObjectId, { operator?: string; value?: any }>>(new Map())

    useEffect(() => {
        const copyValue = new Map()

        fields.forEach((field) => {
            switch (field.type) {
                case ContainerFieldType.STRING:
                    copyValue.set(field.id, { operator: 'in', value: '' })
                    break

                case ContainerFieldType.DATE:
                    copyValue.set(field.id, { operator: 'bf', value: undefined })
                    break

                case ContainerFieldType.NUMBER:
                    copyValue.set(field.id, { operator: 'eq', value: undefined })
                    break

                default:
                    break
            }
        })

        onChange(copyValue)
    }, [])

    const onChangeOperator = (fieldId: string, operator: string) => {
        const copyValue = new Map(values)
        copyValue.set(fieldId, { ...copyValue.get(fieldId), operator })
        onChange(copyValue)
    }

    const onChangeValue = (fieldId: string, value: any) => {
        const copyValue = new Map(values)
        copyValue.set(fieldId, { ...copyValue.get(fieldId), value })
        onChange(copyValue)
    }

    return (
        <>
            {fields
                .filter((e) => !e.multiple)
                .map((field) => (
                    <div key={field.id} style={{ display: 'flex' }}>
                        <div style={{ minWidth: 85 }}>
                            <Text type="secondary">{field.name} :</Text>
                        </div>
                        <div style={{ flex: 1 }}>
                            {field.type === ContainerFieldType.STRING && (
                                <Space.Compact block size="small">
                                    <Select
                                        value={values.get(field.id)?.operator}
                                        onChange={(e) => onChangeOperator(field.id, e)}
                                        style={{ width: '33%', maxWidth: 121 }}
                                        options={[
                                            { value: 'in', label: 'Contains' },
                                            { value: 'eq', label: 'Equals' },
                                        ]}
                                    />
                                    <Input
                                        value={values.get(field.id)?.value}
                                        onChange={(e) => onChangeValue(field.id, e.target.value)}
                                        size="small"
                                        style={{ width: '67%' }}
                                        allowClear
                                    />
                                </Space.Compact>
                            )}

                            {field.type === ContainerFieldType.DATE && (
                                <Space.Compact block size="small">
                                    <Select
                                        value={values.get(field.id)?.operator}
                                        onChange={(e) => onChangeOperator(field.id, e)}
                                        style={{ width: '33%', maxWidth: 121 }}
                                        options={[
                                            { value: 'bf', label: 'Before' },
                                            { value: 'af', label: 'After' },
                                        ]}
                                    />
                                    <DatePicker
                                        value={values.get(field.id)?.value}
                                        onChange={(e) => onChangeValue(field.id, e)}
                                        size="small"
                                        style={{ width: '67%' }}
                                        allowClear
                                    />
                                </Space.Compact>
                            )}

                            {field.type === ContainerFieldType.NUMBER && (
                                <Space.Compact block size="small">
                                    <Select
                                        value={values.get(field.id)?.operator}
                                        onChange={(e) => onChangeOperator(field.id, e)}
                                        style={{ width: '33%', maxWidth: 121 }}
                                        options={[
                                            { value: 'gt', label: 'Greater than' },
                                            { value: 'lt', label: 'Lower than' },
                                            { value: 'eq', label: 'Equals' },
                                        ]}
                                    />
                                    <InputNumber
                                        value={values.get(field.id)?.value}
                                        onChange={(e) => onChangeValue(field.id, e)}
                                        min={typeof field.min === 'number' ? field.min - 1 : undefined}
                                        max={typeof field.max === 'number' ? field.max + 1 : undefined}
                                        style={{ width: '67%' }}
                                    />
                                </Space.Compact>
                            )}
                        </div>
                    </div>
                ))}
        </>
    )
}

interface OrderByProps {
    value: { field: ObjectId | undefined; order: 'asc' | 'desc' }
    onChange(value: { field: ObjectId | undefined; order: 'asc' | 'desc' }): void
    fields: ContainerField[]
}

const OrderBy = ({ fields, value, onChange }: OrderByProps) => {
    // const options = fields.map()

    const handleChange = (e: { field: ObjectId | undefined } | { order: 'asc' | 'desc' }) => {
        onChange({ ...value, ...e })
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ minWidth: 85 }}>
                <Text type="secondary">Order by :</Text>
            </div>
            <div style={{ flex: 1 }}>
                <Space.Compact block size="small">
                    <Select
                        allowClear
                        value={value.field}
                        onChange={(field) => handleChange({ field })}
                        style={{ flex: 1 }}
                        options={fields
                            .filter((e) => !e.multiple)
                            .map((field) => ({ value: field.id, label: field.name }))}
                    />
                    <Select
                        value={value.order}
                        onChange={(order) => handleChange({ order })}
                        style={{ width: '33%' }}
                        options={[
                            { value: 'asc', label: 'Asc' },
                            { value: 'desc', label: 'Desc' },
                        ]}
                    />
                </Space.Compact>
            </div>
        </div>
    )
}

ContentsFilter.OrderBy = OrderBy

export default ContentsFilter
