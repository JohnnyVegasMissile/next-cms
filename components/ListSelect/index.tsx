import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'
import { CSSProperties, useState } from 'react'
import { getContainersSimple } from '~/network/containers'
import { getFormsSimple } from '~/network/forms'
import { getRolesSimple } from '~/network/roles'
import { ObjectId } from '~/types'

interface ListSelectProps<T> {
    value: ObjectId | undefined
    onChange(id: ObjectId, object?: T): void
    error?: boolean
    disabled?: boolean
    style?: CSSProperties | undefined
}

const ListSelect = () => null

const ContainerSelect = ({ value, onChange, error, disabled, style }: ListSelectProps<any>) => {
    const [q, setQ] = useState<string>('')
    const containers = useQuery(['containers-simple', { q }], () => getContainersSimple(q))

    return (
        <Select
            showSearch
            searchValue={q}
            onSearch={setQ}
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

const RoleSelect = ({ value, onChange, error, disabled, style }: ListSelectProps<any>) => {
    const [q, setQ] = useState<string>('')
    const roles = useQuery(['roles-simple', { q }], () => getRolesSimple(q))

    return (
        <Select
            showSearch
            searchValue={q}
            onSearch={setQ}
            allowClear
            size="small"
            disabled={disabled}
            status={error ? 'error' : undefined}
            style={{ width: '100%', ...style }}
            fieldNames={{ label: 'name', value: 'id' }}
            loading={roles.isFetching}
            options={roles.data}
            value={value}
            onChange={onChange}
        />
    )
}

const FormSelect = ({ value, onChange, error, disabled, style }: ListSelectProps<any>) => {
    const [q, setQ] = useState<string>('')
    const forms = useQuery(['forms-simple', { q, showFields: true }], () => getFormsSimple(q, true))

    return (
        <Select
            showSearch
            searchValue={q}
            onSearch={setQ}
            allowClear
            size="small"
            disabled={disabled}
            status={error ? 'error' : undefined}
            style={{ width: '100%', ...style }}
            fieldNames={{ label: 'name', value: 'id' }}
            loading={forms.isFetching}
            options={forms.data}
            value={value}
            onChange={(value) =>
                onChange(
                    value,
                    forms.data?.find((e) => e.id === value)
                )
            }
        />
    )
}

ListSelect.Container = ContainerSelect
ListSelect.Role = RoleSelect
ListSelect.Form = FormSelect

export default ListSelect
