import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'
import { CSSProperties } from 'react'
import { getContainersSimple } from '~/network/containers'
import { ObjectId } from '~/types'

interface ListSelectProps {
    value: ObjectId | undefined
    onChange(id: ObjectId): void
    error?: boolean
    disabled?: boolean
    style?: CSSProperties | undefined
}

const ListSelect = () => null

const ContainerSelect = ({ value, onChange, error, disabled, style }: ListSelectProps) => {
    const containers = useQuery(['containers-simple'], getContainersSimple)

    return (
        <Select
            allowClear
            size="small"
            disabled={disabled}
            status={error ? 'error' : undefined}
            style={{ width: '100%', ...style }}
            fieldNames={{ label: 'name', value: 'id' }}
            loading={containers.isFetching}
            options={containers.data}
            value={value}
            onChange={onChange}
        />
    )
}

ListSelect.Container = ContainerSelect

export default ListSelect
