'use client'

import { Badge, Button, Card, Divider, Input, Radio, Select, Space, Table } from 'antd'
import {
    SearchOutlined,
    PlusOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    ClearOutlined,
} from '@ant-design/icons'
import {} from 'next/navigation'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ExpandableConfig, SorterResult } from 'antd/es/table/interface'
import { PAGE_SIZE } from '~/utilities/constants'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ObjectId } from '~/types'
import { getContainer } from '~/network/containers'
import ListSelect from '../ListSelect'
import ContentsFilter from '../ContentsFilter'

type FiltersType =
    | {
          key: string
          type: 'select' | 'input' | 'radio'
          default?: string
          options: { value: string; label: string; icon?: JSX.Element }[]

          name?: never
          request?: never
      }
    | {
          key: string
          type: 'select'
          name: string
          request: () => Promise<{ id: ObjectId; name: string }[]>

          default?: never
          options?: never
      }

interface AdminTableProps<T> {
    name: string
    columns: ColumnsType<T>
    request(
        page: number,
        q: string,
        sort: `${string},${'asc' | 'desc'}` | undefined,
        others: any
    ): Promise<{ results: T[]; count: number }>
    filters?: FiltersType[]
    extra?: React.ReactNode
    isContent?: boolean
    expandedRowRender?: ExpandableConfig<T>['expandedRowRender']
}

const AdminTable = <T,>({
    name,
    columns,
    request,
    filters,
    extra,
    isContent,
    expandedRowRender,
}: AdminTableProps<T>) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [page, setPage] = useState(1)
    const [q, setQ] = useState<string>(searchParams?.has('q') ? searchParams.get('q')! : '')
    const [sort, setSort] = useState<`${string},${'asc' | 'desc'}`>()
    const [extraFilters, setExtraFilters] = useState<any>({})

    const [advancedSort, seAdvancedSort] = useState<{ field: ObjectId | undefined; order: 'asc' | 'desc' }>({
        field: undefined,
        order: 'asc',
    })
    const [advancedFilters, seAdvancedFilters] = useState<Map<ObjectId, { operator?: string; value?: any }>>(
        new Map()
    )
    const [containerId, setContainerId] = useState<ObjectId>()
    const [advancedOpen, setAdvancedOpen] = useState(false)

    const parsedFilters: any = {}
    advancedFilters.forEach((value, key) => {
        if (!!value.value) parsedFilters[key] = { ...value }
    })

    const clearAdvacedFilters = () => {
        const copyValue = new Map(advancedFilters)
        copyValue.forEach((value, key) => copyValue.set(key, { ...value, value: undefined }))
        seAdvancedFilters(copyValue)

        seAdvancedSort({ ...advancedSort, field: undefined })

        setAdvancedOpen(false)
    }

    let nbFilters = 0
    advancedFilters.forEach((value) => {
        if (value.value !== undefined && value.value !== '') nbFilters++
    })
    if (advancedSort.field !== undefined) nbFilters++

    const container = useQuery(['containers', { id: containerId }], () => getContainer(containerId!), {
        enabled: isContent && !!containerId,
    })

    const results = useQuery(
        [
            name,
            {
                page,
                q,
                sort,
                ...extraFilters,
                containerId,
                advancedSort: advancedSort.field ? advancedSort : undefined,
                advancedFilters: !!Object.keys(parsedFilters).length ? parsedFilters : undefined,
            },
        ],
        () =>
            request(page, q, sort, {
                ...extraFilters,
                containerId,
                advancedSort: advancedSort.field ? JSON.stringify(advancedSort) : undefined,
                advancedFilters: !!Object.keys(parsedFilters).length
                    ? JSON.stringify(parsedFilters)
                    : undefined,
            })
    )

    useEffect(() => {
        if (!filters || !searchParams) return

        let filtersFromSearch: any = {}
        const params = new URLSearchParams(searchParams)

        for (const filter of filters) {
            if (searchParams?.has(filter.key)) {
                filtersFromSearch[filter.key] = searchParams.get(filter.key)
            } else if (filter.default) {
                filtersFromSearch[filter.key] = filter.default
                params.set(filter.key, filter.default)
            }
        }

        setExtraFilters(filtersFromSearch)
        router.push(`${pathname}?${params.toString()}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onQChange = (value: string) => {
        setQ(value)
        if (!!searchParams) {
            const params = new URLSearchParams(searchParams)
            if (!!value) {
                params.set('q', value)
            } else {
                params.delete('q')
            }
            router.push(`${pathname}?${params.toString()}`)
        }
    }

    const onFilterChange = (key: string, value: string) => {
        setExtraFilters({ ...extraFilters, [key]: value })
        if (!!searchParams) {
            const params = new URLSearchParams(searchParams)
            if (!!value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
            router.push(`${pathname}?${params.toString()}`)
        }
    }

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _: any,
        sorter: SorterResult<any> | SorterResult<any>[]
    ) => {
        const params = new URLSearchParams(searchParams!)

        if (!Array.isArray(sorter) && !!sorter.columnKey && !!sorter.order) {
            setSort(`${sorter.columnKey},${sorter.order === 'ascend' ? 'asc' : 'desc'}`)
            params.set('sort', `${sorter.columnKey},${sorter.order === 'ascend' ? 'asc' : 'desc'}`)
        } else {
            setSort(undefined)
            params.delete('sort')
        }

        params.set('page', `${pagination.current || 1}`)
        setPage(pagination.current || 1)

        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input
                            allowClear
                            size="small"
                            prefix={<SearchOutlined rev={undefined} />}
                            placeholder="Search by name"
                            style={{ width: 190 }}
                            value={q}
                            onChange={(e) => onQChange(e.target.value)}
                        />
                        {filters?.map((filter) => {
                            switch (filter.type) {
                                case 'select':
                                    if (filter.request)
                                        return (
                                            <RequestSelect
                                                key={filter.key}
                                                name={filter.name}
                                                request={filter.request}
                                                value={extraFilters[filter.key]}
                                                onChange={(e) => onFilterChange(filter.key, e)}
                                            />
                                        )

                                    return (
                                        <Select
                                            allowClear
                                            size="small"
                                            key={filter.key}
                                            style={{ width: 190 }}
                                            options={filter.options}
                                            value={extraFilters[filter.key]}
                                            onChange={(e) => onFilterChange(filter.key, e)}
                                        />
                                    )
                                case 'input':
                                    return (
                                        <Input
                                            allowClear
                                            size="small"
                                            key={filter.key}
                                            style={{ width: 190 }}
                                            value={extraFilters[filter.key]}
                                            onChange={(e) => onFilterChange(filter.key, e.target.value)}
                                        />
                                    )

                                case 'radio':
                                    return (
                                        <Radio.Group
                                            buttonStyle="solid"
                                            size="small"
                                            value={extraFilters[filter.key]}
                                            onChange={(e) => onFilterChange(filter.key, e.target.value)}
                                        >
                                            {filter.options?.map((option) => (
                                                <Radio.Button key={option.value} value={option.value}>
                                                    <Space align="center">
                                                        {option.icon}
                                                        {option.label}
                                                    </Space>
                                                </Radio.Button>
                                            ))}
                                        </Radio.Group>
                                    )
                            }
                        })}
                        {isContent && (
                            <>
                                <ListSelect.Container
                                    style={{ width: 190 }}
                                    value={containerId}
                                    onChange={(e) => {
                                        setContainerId(e)

                                        if (!e) {
                                            setAdvancedOpen(false)
                                            seAdvancedSort({
                                                field: undefined,
                                                order: 'asc',
                                            })
                                            seAdvancedFilters(new Map())
                                        }
                                    }}
                                />
                                <Badge count={nbFilters} size="small">
                                    <Button
                                        type="link"
                                        size="small"
                                        loading={container.isFetching}
                                        disabled={!containerId || container.data?.fields?.length === 0}
                                        icon={
                                            advancedOpen ? (
                                                <CaretUpOutlined rev={undefined} />
                                            ) : (
                                                <CaretDownOutlined rev={undefined} />
                                            )
                                        }
                                        onClick={() => setAdvancedOpen(!advancedOpen)}
                                    >
                                        Advanced
                                    </Button>
                                </Badge>
                            </>
                        )}
                    </Space>

                    {!!extra ? (
                        extra
                    ) : (
                        <Link href={`${pathname}/create`} prefetch={false}>
                            <Button type="primary" icon={<PlusOutlined rev={undefined} />} size="small">
                                Create new
                            </Button>
                        </Link>
                    )}
                </div>
                {advancedOpen && !!containerId && !!container.data?.fields?.length && (
                    <>
                        <Divider orientation="right" plain>
                            <Button
                                type="link"
                                size="small"
                                icon={<ClearOutlined rev={undefined} />}
                                danger
                                onClick={clearAdvacedFilters}
                            >
                                Clear filters
                            </Button>
                        </Divider>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gridColumnGap: '1rem',
                                gridRowGap: '1rem',
                            }}
                        >
                            <ContentsFilter.OrderBy
                                fields={container.data?.fields}
                                value={advancedSort}
                                onChange={seAdvancedSort}
                            />
                            <div />
                            <div />
                            <ContentsFilter
                                fields={container.data?.fields}
                                values={advancedFilters}
                                onChange={seAdvancedFilters}
                            />
                        </div>
                    </>
                )}
            </Card>
            <Card size="small" style={{ flex: 1 }}>
                <Table
                    onChange={handleTableChange}
                    rowKey="id"
                    size="small"
                    loading={results.isLoading}
                    columns={
                        columns.filter((e: any) =>
                            !!e.condition ? e.condition(extraFilters) : true
                        ) as any[]
                    }
                    dataSource={results.data?.results as object[]}
                    pagination={{
                        total: results.data?.count,
                        pageSize: PAGE_SIZE,
                        showSizeChanger: false,
                        current: page,
                        showTotal: (total) =>
                            `${(page - 1) * PAGE_SIZE}-${
                                (page - 1) * PAGE_SIZE + (results.data?.results.length || 0)
                            } of ${total}`,
                    }}
                    // scroll={{ y: 300 }}
                    expandable={
                        !expandedRowRender
                            ? undefined
                            : {
                                  expandedRowRender:
                                      expandedRowRender as ExpandableConfig<object>['expandedRowRender'],
                              }
                    }
                />
            </Card>
        </>
    )
}

export default AdminTable

interface RequestSelectProps {
    name: string
    value: string
    onChange: (value: string) => void
    request: () => Promise<{ id: ObjectId; name: string }[]>
}

const RequestSelect = ({ name, value, onChange, request }: RequestSelectProps) => {
    const data = useQuery([name], request)

    return (
        <Select
            loading={data.isFetching}
            options={data.data}
            fieldNames={{ label: 'name', value: 'id' }}
            allowClear
            size="small"
            style={{ width: 190 }}
            value={value}
            onChange={onChange}
        />
    )
}
