'use client'

import { Badge, Button, Divider, Popconfirm, Space, Tag, Tooltip } from 'antd'
import { CopyOutlined, EditOutlined, DeleteOutlined, PicCenterOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getPages } from '~/network/pages'
import { Page, PageType, Slug } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AdminTable from '~/components/AdminTable'
import BreadcrumdLink from '~/components/BreadcrumdLink'

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
                    return <BreadcrumdLink url="" />

                case PageType.SIGNIN:
                    return <BreadcrumdLink url="sign-in" />

                case PageType.PAGE:
                    return <BreadcrumdLink url={`${page?.slug?.full}`} />

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
                        <Button icon={<PicCenterOutlined rev={undefined} />} size="small" type="dashed" />
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
                        <Button icon={<CopyOutlined rev={undefined} />} size="small" />
                    </Tooltip>
                </Link>
                {page.type !== PageType.HOMEPAGE && page.type !== PageType.PAGE ? (
                    <Button
                        type="primary"
                        icon={<EditOutlined rev={undefined} />}
                        size="small"
                        disabled={true}
                    >
                        Edit
                    </Button>
                ) : (
                    <Link href={`/admin/pages/${page.id}`} prefetch={false}>
                        <Tooltip title="Edit">
                            <Button type="primary" icon={<EditOutlined rev={undefined} />} size="small">
                                Edit
                            </Button>
                        </Tooltip>
                    </Link>
                )}
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
                            icon={<DeleteOutlined rev={undefined} />}
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
    return (
        <AdminTable
            name="pages"
            columns={columns}
            request={getPages}
            filters={[
                {
                    type: 'select',
                    key: 'type',
                    options: [
                        { label: 'Page', value: PageType.PAGE },
                        { label: 'Homepage', value: PageType.HOMEPAGE },
                        { label: 'Error', value: PageType.ERROR },
                        { label: 'Maintenance', value: PageType.MAINTENANCE },
                        { label: 'Not found', value: PageType.NOTFOUND },
                        { label: 'Sign in', value: PageType.SIGNIN },
                    ],
                },
            ]}
        />
    )
}

export const dynamic = 'force-dynamic'
export default Pages
