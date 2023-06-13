'use client'

import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Role, User } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AdminTable from '~/components/AdminTable'
import { getRolesSimple } from '~/network/roles'
import { getUsers } from '~/network/users'

dayjs.extend(relativeTime)

type DataType = User & {
    login: {
        role: Role | null
        email: string
    } | null
}

const columns: ColumnsType<DataType> = [
    {
        sorter: true,
        title: 'Name',
        key: 'name',
        render: (user: DataType) => user.name,
    },
    {
        sorter: true,
        title: 'Email',
        key: 'email',
        render: (user: DataType) => user.login?.email,
    },
    {
        sorter: true,
        title: 'Role',
        key: 'role',
        render: (user: DataType) => user.login?.role?.name,
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (user: DataType) => dayjs(user.updatedAt).fromNow(),
    },
    {
        width: 1,
        key: 'action',
        render: (user: DataType) => (
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
                    <Link href={`/admin/users/${user.id}`} prefetch={false}>
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

const Users = () => {
    return (
        <AdminTable
            name="users"
            columns={columns}
            request={getUsers}
            filters={[
                {
                    type: 'select',
                    key: 'roleId',
                    name: 'roles-simple',
                    request: getRolesSimple,
                },
            ]}
        />
    )
}

export const dynamic = 'force-dynamic'
export default Users
