'use client'

import { Badge, Button, Card, Divider, Input, Radio, Select, Space, Table } from 'antd'
import {
    SearchOutlined,
    PlusOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    ClearOutlined,
} from '@ant-design/icons'
import { usePathname } from 'next/navigation'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SorterResult } from 'antd/es/table/interface'
import { PAGE_SIZE } from '~/utilities/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { ObjectId } from '~/types'
import { getContainer } from '~/network/containers'
import ListSelect from '../ListSelect'
import ContentsFilter from '../ContentsFilter'

interface AdminTableProps<T> {
    name: string
    columns: ColumnsType<T>
    request(
        page: number,
        q: string,
        sort: `${string},${'asc' | 'desc'}` | undefined,
        others: any
    ): Promise<{ results: T[]; count: number }>
    filters?: {
        key: string
        type: 'select' | 'input' | 'radio'
        default?: string
        options?: { value: string; label: string; icon?: JSX.Element }[]
    }[]
    extra?: React.ReactNode
    isContent?: boolean
}

const AdminTable = <T,>({ name, columns, request, filters, extra, isContent }: AdminTableProps<T>) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [page, setPage] = useState(1)
    const [q, setQ] = useState<string>(searchParams?.has('q') ? searchParams.get('q')! : '')
    const [sort, setSort] = useState<`${string},${'asc' | 'desc'}`>()
    const [extraFilters, setExtraFilters] = useState<any>({})

    const [advacedSort, seAdvacedSort] = useState<{ field: ObjectId | undefined; order: 'asc' | 'desc' }>({
        field: undefined,
        order: 'asc',
    })
    const [advacedFilters, seAdvacedFilters] = useState<Map<ObjectId, { operator?: string; value?: any }>>(
        new Map()
    )
    const [containerId, setContainerId] = useState<ObjectId>()
    const [advancedOpen, setAdvancedOpen] = useState(false)

    const clearAdvacedFilters = () => {
        const copyValue = new Map(advacedFilters)
        copyValue.forEach((value, key) => copyValue.set(key, { ...value, value: undefined }))
        seAdvacedFilters(copyValue)

        seAdvacedSort({ ...advacedSort, field: undefined })

        setAdvancedOpen(false)
    }

    let nbFilters = 0
    advacedFilters.forEach((value) => {
        if (value.value !== undefined && value.value !== '') nbFilters++
    })
    if (advacedSort.field !== undefined) nbFilters++

    const container = useQuery(['containers', { id: containerId }], () => getContainer(containerId!), {
        enabled: isContent && !!containerId,
    })

    const results = useQuery([name, { page, q, sort, ...extraFilters }], () =>
        request(page, q, sort, extraFilters)
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
                            prefix={<SearchOutlined />}
                            placeholder="Search by name"
                            style={{ width: 190 }}
                            value={q}
                            onChange={(e) => onQChange(e.target.value)}
                        />
                        {filters?.map((filter) => {
                            switch (filter.type) {
                                case 'select':
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
                                            seAdvacedSort({
                                                field: undefined,
                                                order: 'asc',
                                            })
                                            seAdvacedFilters(new Map())
                                        }
                                    }}
                                />
                                <Badge count={nbFilters} size="small">
                                    <Button
                                        type="link"
                                        size="small"
                                        loading={container.isFetching}
                                        disabled={!containerId || container.data?.fields?.length === 0}
                                        icon={advancedOpen ? <CaretUpOutlined /> : <CaretDownOutlined />}
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
                            <Button type="primary" icon={<PlusOutlined />} size="small">
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
                                icon={<ClearOutlined />}
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
                                value={advacedSort}
                                onChange={seAdvacedSort}
                            />
                            <div />
                            <div />
                            <ContentsFilter
                                fields={container.data?.fields}
                                values={advacedFilters}
                                onChange={seAdvacedFilters}
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
                />
            </Card>
        </>
    )
}

export default AdminTable
