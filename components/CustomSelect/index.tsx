import { Select } from 'antd'
import { useQuery, UseQueryResult /*, useQueryClient*/ } from 'react-query'
import type { Page } from '@prisma/client'
import { getPages } from '../../network/pages'
import get from 'lodash.get'

const { Option } = Select

const CustomSelect = () => null

type PageId = number | undefined

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

CustomSelect.ListPages = ListPages

export default CustomSelect
