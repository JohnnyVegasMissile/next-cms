'use client'

import {
    Badge,
    Breadcrumb,
    Button,
    Card,
    Divider,
    Input,
    Popconfirm,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
} from 'antd'
import {
    UnorderedListOutlined,
    CopyOutlined,
    FileAddOutlined,
    EditOutlined,
    DeleteOutlined,
    PicCenterOutlined,
    PicLeftOutlined,
    SearchOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table'
import { useQuery } from '@tanstack/react-query'
import { getPages } from '~/network/pages'
import { Page, PageType, Slug } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface'
import { PAGE_PAGE_SIZE } from '~/utilities/constants'
import { useRouter, useSearchParams } from 'next/navigation'

dayjs.extend(relativeTime)

type DataType = Page & {
    slug: Slug | null
}

const columns: ColumnsType<DataType> = [
    {
        sorter: true,
        title: 'Name',
        key: 'name',
        render: (page: DataType) => {
            if (page.type !== PageType.PAGE) {
                switch (page.type) {
                    case PageType.HOMEPAGE:
                        return <Tag color="blue">Homepage</Tag>
                    case PageType.SIGNIN:
                        return <Tag color="green">Sign in</Tag>
                    case PageType.NOTFOUND:
                        return <Tag color="orange">Not found</Tag>
                    case PageType.ERROR:
                        return <Tag color="red">Error</Tag>
                    case PageType.MAINTENANCE:
                        return <Tag color="purple">Maintenance</Tag>

                    default:
                        break
                }
            }
            return page?.name
        },
    },
    {
        sorter: true,
        title: 'Url',
        key: 'slug',
        render: (page: DataType) => {
            switch (page.type) {
                case PageType.HOMEPAGE:
                    return (
                        <Link href={'/'} prefetch={false}>
                            <Breadcrumb>
                                <Breadcrumb.Item>&#8203;</Breadcrumb.Item>
                                <Breadcrumb.Item>&#8203;</Breadcrumb.Item>
                            </Breadcrumb>
                        </Link>
                    )

                case PageType.SIGNIN:
                    return (
                        <Link href={`/${encodeURIComponent(page?.slug?.full || '')}`} prefetch={false}>
                            <Breadcrumb>
                                <Breadcrumb.Item>&#8203;</Breadcrumb.Item>
                                <Breadcrumb.Item>sign-in</Breadcrumb.Item>
                            </Breadcrumb>
                        </Link>
                    )

                case PageType.PAGE:
                    return (
                        <Link href={`/${encodeURIComponent(page?.slug?.full || '')}`} prefetch={false}>
                            <Breadcrumb>
                                <Breadcrumb.Item>&#8203;</Breadcrumb.Item>
                                {page?.slug?.full?.split('/').map((word: string, idx: number) => (
                                    <Breadcrumb.Item key={idx}>{word}</Breadcrumb.Item>
                                ))}
                            </Breadcrumb>
                        </Link>
                    )

                default:
                    return null
            }
        },
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (page: DataType) => dayjs(page.updatedAt).fromNow(),
    },
    {
        sorter: true,
        title: 'Status',
        key: 'published',
        render: (page: DataType) => (
            <Badge
                status={page.published ? 'success' : 'error'}
                text={`${page.published ? 'P' : 'Unp'}ublished`}
            />
        ),
    },
    {
        width: 1,
        key: 'action',
        render: (page: DataType) => (
            <Space>
                <Link href={`/admin/pages/${page.id}/sections`} prefetch={false}>
                    <Tooltip title="Custom sections">
                        <Button icon={<PicCenterOutlined />} size="small" type="dashed" />
                    </Tooltip>
                </Link>
                <Divider type="vertical" style={{ margin: 0 }} />
                <Link
                    href={{
                        pathname: '/admin/pages',
                        query: { duplicate: page.id },
                    }}
                    prefetch={false}
                >
                    <Tooltip title="Duplicate">
                        <Button icon={<CopyOutlined />} size="small" />
                    </Tooltip>
                </Link>
                <Link href={`/admin/pages/${page.id}`} prefetch={false}>
                    <Tooltip title="Edit">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            disabled={page.type !== PageType.HOMEPAGE && page.type !== PageType.PAGE}
                        >
                            Edit
                        </Button>
                    </Tooltip>
                </Link>
                <Popconfirm
                    placement="left"
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    // onConfirm={(e) => e?.stopPropagation()}
                    // onCancel={(e) => e?.stopPropagation()}
                    okText="Delete"
                    cancelText="Cancel"
                    disabled={page.type !== PageType.PAGE}
                >
                    <Tooltip title="Delete">
                        <Button
                            disabled={page.type !== PageType.PAGE}
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Tooltip>
                </Popconfirm>
            </Space>
        ),
    },
]

const Pages = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [page, setPage] = useState(1)
    const [q, setQ] = useState<string>(searchParams.has('q') ? searchParams.get('q')! : '')
    const [type, setType] = useState<PageType | undefined>(
        searchParams.has('type') ? (searchParams.get('type') as PageType) : undefined
    )
    const [sort, setSort] = useState<`${string},${'asc' | 'desc'}`>()
    const pages = useQuery(['pages', { page, q, type, sort }], () => getPages(page, q, type, sort))

    const onQChange = (value: string) => {
        setQ(value)
        const params = new URLSearchParams(searchParams)
        if (!!value) {
            params.set('q', value)
        } else {
            params.delete('q')
        }
        router.push(`/admin/pages?${params.toString()}`)
    }

    const onTypeChange = (value: PageType) => {
        setType(value)
        const params = new URLSearchParams(searchParams)
        if (!!value) {
            params.set('type', value)
        } else {
            params.delete('type')
        }
        router.push(`/admin/pages?${params.toString()}`)
    }

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _: any,
        sorter: SorterResult<DataType> | SorterResult<any>[]
    ) => {
        const params = new URLSearchParams(searchParams)

        if (!Array.isArray(sorter) && !!sorter.columnKey && !!sorter.order) {
            setSort(`${sorter.columnKey},${sorter.order === 'ascend' ? 'asc' : 'desc'}`)
            params.set('sort', `${sorter.columnKey},${sorter.order === 'ascend' ? 'asc' : 'desc'}`)
        } else {
            setSort(undefined)
            params.delete('sort')
        }

        params.set('page', `${pagination.current || 1}`)
        setPage(pagination.current || 1)

        router.push(`/admin/pages?${params.toString()}`)
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
                        <Select
                            size="small"
                            placeholder="Type"
                            style={{ width: 190 }}
                            allowClear
                            options={[
                                { label: 'Page', value: PageType.PAGE },
                                { label: 'Homepage', value: PageType.HOMEPAGE },
                                { label: 'Not found', value: PageType.NOTFOUND },
                                { label: 'Error', value: PageType.ERROR },
                                { label: 'Sign in', value: PageType.SIGNIN },
                            ]}
                            value={type}
                            onChange={(e) => onTypeChange(e)}
                        />
                    </Space>

                    <Link href={`/pages/create`} prefetch={false}>
                        <Button type="primary" icon={<PlusOutlined />} size="small">
                            Create new
                        </Button>
                    </Link>
                </div>
            </Card>
            <Card size="small" style={{ flex: 1 }}>
                <Table
                    onChange={handleTableChange}
                    rowKey="id"
                    size="small"
                    loading={pages.isLoading}
                    columns={columns}
                    dataSource={pages.data?.pages}
                    pagination={{
                        total: pages.data?.count,
                        pageSize: PAGE_PAGE_SIZE,
                        showSizeChanger: false,
                        current: page,
                        showTotal: (total, range) =>
                            `${(page - 1) * PAGE_PAGE_SIZE}-${
                                (page - 1) * PAGE_PAGE_SIZE + (pages.data?.pages.length || 0)
                            } of ${total} pages`,
                    }}
                    scroll={{ y: 300 }}
                />
            </Card>
        </>
    )
}

export const dynamic = 'force-dynamic'
export default Pages
