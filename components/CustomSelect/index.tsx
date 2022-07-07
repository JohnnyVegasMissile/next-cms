import { Cascader, Select, Typography } from 'antd'
import { useQuery, UseQueryResult /*, useQueryClient*/ } from 'react-query'
import type { Page } from '@prisma/client'
import { getPages } from '../../network/pages'
import get from 'lodash.get'
import { getElements } from '../../network/elements'
import type { Element } from '@prisma/client'
import Blocks from '../../blocks'

const { Option } = Select
const { Title, Text } = Typography

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
                width: 240,
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
        ['elements'],
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

export default CustomSelect
