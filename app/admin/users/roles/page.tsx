'use client'

import { Badge, Button, Divider, Popconfirm, Space, Tag, Tooltip } from 'antd'
import { CopyOutlined, EditOutlined, DeleteOutlined, PicCenterOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getPages } from '~/network/pages'
import { Page, PageType, Role, Slug } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AdminTable from '~/components/AdminTable'
import BreadcrumdLink from '~/components/BreadcrumdLink'

dayjs.extend(relativeTime)

type DataType = Role & {}

const columns: ColumnsType<DataType> = [
    {
        sorter: true,
        title: 'Name',
        key: 'name',
        render: (page: DataType) => 'Jack',
    },
    {
        sorter: true,
        title: 'Nb of users',
        key: 'nbUsers',
        render: (page: DataType) => '5',
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (page: DataType) => dayjs(page.updatedAt).fromNow(),
    },
    {
        width: 1,
        key: 'action',
        render: (page: DataType) => (
            <Space>
                {false ? (
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
                    disabled={false}
                >
                    <Tooltip title="Delete">
                        <Button
                            disabled={false}
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

const Roles = () => {
    return <AdminTable name="roles" columns={columns} request={getPages} />
}

export const dynamic = 'force-dynamic'
export default Roles
