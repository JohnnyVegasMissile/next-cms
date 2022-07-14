import { Cascader, Select, Typography } from 'antd'
import { useQuery, UseQueryResult /*, useQueryClient*/ } from 'react-query'
import type { Page, Role } from '@prisma/client'
import { getPages } from '../../network/pages'
import get from 'lodash.get'
import { getElements } from '../../network/elements'
import type { Element } from '@prisma/client'
import Blocks from '../../blocks'
import { getRoles } from '../../network/roles'

const { Option } = Select
const { Text } = Typography

const CustomSelect = () => null

interface CustomSelectProps {
    value: string | undefined
    onChange(value: string | undefined): void
    width?: number
}

const ListPages = ({ value, onChange, width = 240 }: CustomSelectProps) => {
    const pages: UseQueryResult<Page[], Error> = useQuery<Page[], Error>(
        ['pages', { type: 'list' }],
        () => getPages('list'),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Select
            allowClear
            value={value}
            onChange={onChange}
            style={{
                width,
            }}
            placeholder="List"
            loading={pages.isLoading}
        >
            {get(pages, 'data', [])
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((page) => (
                    <Option key={page.id} value={page.id}>
                        {page.title}
                    </Option>
                ))}
        </Select>
    )
}

const ListElements = ({
    id,
    value,
    onChange,
}: {
    id?: string
    value?: string
    onChange(value: string | undefined): void
}) => {
    const elements: UseQueryResult<Element[], Error> = useQuery<Element[], Error>(
        ['elements', {}],
        () => getElements(),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Select
            id={id}
            allowClear
            placeholder="Please select"
            value={value}
            onChange={onChange}
            style={{ width: 240, fontWeight: 'normal' }}
            status={elements.isError ? 'error' : undefined}
            loading={elements.isLoading}
        >
            {elements.data?.map((e) => (
                <Select.Option key={e.id} value={e.id}>
                    {e.title}
                </Select.Option>
            ))}
        </Select>
    )
}

const ListRoles = ({
    value,
    onChange,
    width = 240,
}: {
    value?: string
    onChange(value: string | undefined): void
    width?: number
}) => {
    const roles: UseQueryResult<Role[], Error> = useQuery<Role[], Error>(
        ['roles', {}],
        () => getRoles(),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Select
            allowClear
            placeholder="Please select"
            value={value}
            onChange={onChange}
            style={{ width, fontWeight: 'normal' }}
            status={roles.isError ? 'error' : undefined}
            loading={roles.isLoading}
        >
            {roles.data
                ?.filter((e) => e.id !== 'super-admin')
                ?.map((e) => (
                    <Select.Option key={e.id} value={e.id}>
                        {e.name}
                    </Select.Option>
                ))}
        </Select>
    )
}

interface SectionCascaderProps {
    page?: string
    section?: string
    element?: string
    onSectionChange(type: string | undefined): void
    onElementChange(type: string | undefined): void
}

const SectionCascader = ({
    page,
    section,
    element,
    onSectionChange,
    onElementChange,
}: SectionCascaderProps) => {
    const elements: UseQueryResult<Element[], Error> = useQuery<Element[], Error>(
        ['elements', {}],
        () => getElements(),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Cascader
            placeholder="Please select"
            value={!!section ? [section] : !!element ? ['', element] : []}
            displayRender={(labels: string[]) => {
                if (labels.length === 1) {
                    return labels[0]
                }
                if (labels.length === 2) {
                    return (
                        <Text>
                            {labels[1]}
                            <Text type="secondary"> (Element)</Text>
                        </Text>
                    )
                }
                return
            }}
            style={{ width: 240, fontWeight: 'normal' }}
            options={[
                {
                    value: '',
                    label: 'Elements:',
                    loading: elements.isLoading,
                    disabled: !get(elements, 'data', []).length && !elements.isLoading,
                    children: get(elements, 'data', []).map((e) => ({
                        value: e.id,
                        label: e.title,
                    })),
                },
                ...Object.keys(Blocks).map((key) => ({
                    value: key,
                    label: get(Blocks, `${key}.name`, ''),
                    disabled: !get(Blocks, `${key}.pages`, []).includes(page),
                })),
            ]}
            onChange={(e) => {
                if (e?.length === 1) {
                    onSectionChange(`${e[0]}`)
                    onElementChange(undefined)
                } else if (e?.length === 2) {
                    onSectionChange(undefined)
                    onElementChange(`${e[1]}`)
                } else {
                    onSectionChange(undefined)
                    onElementChange(undefined)
                }
            }}
        />
    )
}

CustomSelect.ListPages = ListPages
CustomSelect.ListElements = ListElements
CustomSelect.ListSections = SectionCascader
CustomSelect.ListRoles = ListRoles

export default CustomSelect
