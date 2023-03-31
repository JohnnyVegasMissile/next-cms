import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'
import { getContainersSimple } from '~/network/containers'
import { ObjectId } from '~/types'

interface ListSelectProps {
    value: ObjectId | undefined
    onChange(id: ObjectId): void
    error?: boolean
    disabled?: boolean
}

const ListSelect = () => null

const ContainerSelect = ({ value, onChange, error, disabled }: ListSelectProps) => {
    const containers = useQuery(['containers-simple'], getContainersSimple)

    return (
        <Select
            allowClear
            size="small"
            disabled={disabled}
            status={error ? 'error' : undefined}
            style={{ width: '100%' }}
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
