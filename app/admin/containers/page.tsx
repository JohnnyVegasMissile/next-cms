'use client'

import { Badge, Breadcrumb, Button, Divider, Popconfirm, Space, Tooltip } from 'antd'
import {
    UnorderedListOutlined,
    CopyOutlined,
    FileAddOutlined,
    EditOutlined,
    DeleteOutlined,
    PicCenterOutlined,
    PicLeftOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import AdminTable from '~/components/AdminTable'
import { getContainers } from '~/network/containers'
import { Container, ContainerField, Metadata, Slug } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type DataType = Container & {
    slug: Slug | null
    fields: ContainerField[]
    metadatas: Metadata[]
    contentsMetadatas: Metadata[]
}

const columns: ColumnsType<DataType> = [
    {
        sorter: true,
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        sorter: true,
        title: 'Url',
        key: 'slug',
        render: (container) => (
            <Link href={`/${encodeURIComponent(container?.slug?.full || '')}`} prefetch={false}>
                <Breadcrumb>
                    <Breadcrumb.Item>&#8203;</Breadcrumb.Item>
                    {container?.slug?.full?.split('/').map((word: string, idx: number) => (
                        <Breadcrumb.Item key={idx}>{word}</Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </Link>
        ),
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (container) => dayjs(container.updatedAt).fromNow(),
    },
    {
        sorter: true,
        title: 'Status',
        key: 'published',
        render: (container) => (
            <Badge
                status={container.published ? 'success' : 'error'}
                text={`${container.published ? 'P' : 'Unp'}ublished`}
            />
        ),
    },
    {
        width: 1,
        key: 'action',
        render: (container) => (
            <Space>
                <Link href={`/admin/containers/${container.id}/sections`} prefetch={false}>
                    <Tooltip title="Custom sections">
                        <Button icon={<PicCenterOutlined />} size="small" type="dashed" />
                    </Tooltip>
                </Link>
                <Link href={`/admin/containers/${container.id}/template/sections`} prefetch={false}>
                    <Tooltip title="Custom template sections">
                        <Button icon={<PicLeftOutlined />} size="small" type="dashed" />
                    </Tooltip>
                </Link>
                <Divider type="vertical" style={{ margin: 0 }} />
                <Tooltip title="Duplicate">
                    <Button icon={<CopyOutlined />} size="small" />
                </Tooltip>
                <Tooltip title="See all contents">
                    <Button icon={<UnorderedListOutlined />} size="small" />
                </Tooltip>
                <Tooltip title="Create new content">
                    <Button icon={<FileAddOutlined />} size="small" />
                </Tooltip>
                <Link href={`/admin/containers/${container.id}`} prefetch={false}>
                    <Tooltip title="Edit">
                        <Button type="primary" icon={<EditOutlined />} size="small">
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
                >
                    <Tooltip title="Delete">
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Tooltip>
                </Popconfirm>
            </Space>
        ),
    },
]

const Containers = () => {
    return <AdminTable isContent name="containers" columns={columns} request={getContainers} />
}

export const dynamic = 'force-dynamic'
export default Containers
