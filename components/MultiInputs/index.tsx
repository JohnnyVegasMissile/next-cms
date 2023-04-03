import { DatePicker, Input, InputNumber, Space, Typography } from 'antd'
import { Dayjs } from 'dayjs'
import { useState } from 'react'

const { Text } = Typography

export interface MultiInputProps<T> {
    values: T[] | undefined
    onChange(value: T[]): void
    errors: (string | undefined)[] | undefined
}

const MultiInput = ({ values = [], onChange, errors }: MultiInputProps<string>) => {
    const [newValue, setNewValue] = useState('')

    const onFieldChange = (index: number, value: string) => {
        const copyTexts = [...values]
        copyTexts[index] = value
        onChange(copyTexts)
    }

    const onDeleteField = (index: number) => {
        const copyTexts = [...values]
        copyTexts.splice(index, 1)
        onChange(copyTexts)
    }

    const addNew = () => {
        onChange([...values, newValue])
        setNewValue('')
    }

    const errorMultiDefault = errors?.find((e) => !!e)

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {values?.map((text, idx) => (
                <Input
                    key={idx}
                    allowClear
                    status={!!errors?.[idx] ? 'error' : undefined}
                    size="small"
                    placeholder="Detault text"
                    style={{ width: '100%' }}
                    value={text}
                    onBlur={() => {
                        if (!text) onDeleteField(idx)
                    }}
                    onChange={(e) => onFieldChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter' && !(e.target as any).value) onDeleteField(idx)
                    }}
                />
            ))}
            {!!errorMultiDefault && <Text type="danger">{errorMultiDefault}</Text>}
            <Input
                key="new"
                allowClear
                size="small"
                placeholder="+ Add new value"
                style={{ width: '100%' }}
                value={newValue}
                onBlur={() => {
                    if (!!newValue) addNew()
                }}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.code === 'Enter') addNew()
                }}
            />
        </Space>
    )
}

const NumberComponent = ({
    values = [],
    onChange,
    errors,
    min,
    max,
}: MultiInputProps<number | undefined> & { min: number | undefined; max: number | undefined }) => {
    const [newValue, setNewValue] = useState<number>()

    const onFieldChange = (index: number, value: number | undefined) => {
        const copyTexts = [...values]
        copyTexts[index] = value
        onChange(copyTexts)
    }

    const onDeleteField = (index: number) => {
        const copyTexts = [...values]
        copyTexts.splice(index, 1)
        onChange(copyTexts)
    }

    const addNew = () => {
        onChange([...values, newValue!])
        setNewValue(undefined)
    }

    const errorMultiDefault = errors?.find((e) => !!e)

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {values?.map((number, idx) => (
                <InputNumber
                    key={idx}
                    min={min}
                    max={max}
                    status={!!errors?.[idx] ? 'error' : undefined}
                    size="small"
                    placeholder="Detault text"
                    style={{ width: '100%' }}
                    value={number}
                    onBlur={() => {
                        if (number === undefined || number === null) onDeleteField(idx)
                    }}
                    onChange={(e) => onFieldChange(idx, e || undefined)}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter' && (e.target as any).value !== undefined) onDeleteField(idx)
                    }}
                />
            ))}
            {!!errorMultiDefault && <Text type="danger">{errorMultiDefault}</Text>}
            <InputNumber
                key="new"
                min={min}
                max={max}
                size="small"
                placeholder="+ Add new value"
                style={{ width: '100%' }}
                value={newValue}
                onBlur={() => {
                    if (newValue !== undefined) addNew()
                }}
                onChange={(e) => setNewValue(e || undefined)}
                onKeyDown={(e) => {
                    if (e.code === 'Enter' && (e.target as any).value !== undefined) addNew()
                }}
            />
        </Space>
    )
}

const DateComponent = ({
    values = [],
    onChange,
    errors,
    startDate,
    endDate,
}: MultiInputProps<Dayjs | undefined> & { startDate: Dayjs | undefined; endDate: Dayjs | undefined }) => {
    const onFieldChange = (index: number, value: Dayjs | undefined) => {
        const copyTexts = [...values]
        copyTexts[index] = value
        onChange(copyTexts)
    }

    const onDeleteField = (index: number) => {
        const copyTexts = [...values]
        copyTexts.splice(index, 1)
        onChange(copyTexts)
    }

    const disabledDate = (current: Dayjs) => {
        if (!current || (!startDate && !endDate)) return false

        if (!startDate) return current.startOf('day') > endDate!.startOf('day')

        if (!endDate) return current.endOf('day') < startDate.endOf('day')

        return !(startDate.startOf('day') < current && current < endDate.endOf('day'))
    }

    const errorMultiDefault = errors?.find((e) => !!e)

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {values?.map((date, idx) => (
                <DatePicker
                    key={idx}
                    status={!!errors?.[idx] ? 'error' : undefined}
                    placeholder="Date"
                    allowClear
                    size="small"
                    style={{ width: '100%' }}
                    value={date}
                    onChange={(e) => {
                        if (!!e) {
                            onFieldChange(idx, e)
                        } else {
                            onDeleteField(idx)
                        }
                    }}
                    disabledDate={disabledDate}
                />
            ))}
            {!!errorMultiDefault && <Text type="danger">{errorMultiDefault}</Text>}
            <DatePicker
                key={values?.length}
                placeholder="+ Add new value"
                allowClear
                size="small"
                style={{ width: '100%' }}
                value={undefined}
                onChange={(e) => {
                    if (!!e) onChange([...values, e])
                }}
                disabledDate={disabledDate}
            />
        </Space>
    )
}

MultiInput.Date = DateComponent
MultiInput.Number = NumberComponent

export default MultiInput
