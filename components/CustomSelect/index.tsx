import { Select } from 'antd'
import { useQuery, UseQueryResult /*, useQueryClient*/ } from 'react-query'
import type { Page } from '@prisma/client'
import { getPages } from '../../network/pages'
import get from 'lodash.get'
import { getElements } from '../../network/elements'
import type { Element } from '@prisma/client'

const { Option } = Select

const CustomSelect = () => null

type PageId = string | undefined

interface CustomSelectProps {
    value: PageId
    onChange(value: PageId): void
}

const ListPages = ({ value, onChange }: CustomSelectProps) => {
    const pages: UseQueryResult<Page[], Error> = useQuery<Page[], Error>(
        ['pages', { type: 'list' }],
        () => getPages('list'),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Select
            value={value}
            onChange={onChange}
            style={{
                width: 200,
            }}
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
    value,
    onChange,
}: {
    value?: string
    onChange(value: string | undefined): void
}) => {
    const elements: UseQueryResult<Element[], Error> = useQuery<Element[], Error>(
        ['elements'],
        () => getElements(),
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

CustomSelect.ListPages = ListPages
CustomSelect.ListElements = ListElements

export default CustomSelect
