'use client'

import { Button, Typography, Popconfirm, Space, Tag, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Role } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AdminTable from '~/components/AdminTable'
import { getRoles } from '~/network/roles'

const { Text } = Typography

dayjs.extend(relativeTime)

type DataType = Role & {
    _count: {
        logins: number
    }
}

const columns: ColumnsType<DataType> = [
    {
        sorter: true,
        title: 'Name',
        key: 'name',
        render: (role: DataType) => role.name,
    },
    {
        sorter: true,
        title: 'Nb of users',
        key: 'nbUsers',
        render: (role: DataType) => role._count.logins,
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (role: DataType) => dayjs(role.updatedAt).fromNow(),
    },
    {
        width: 1,
        key: 'action',
        render: (role: DataType) => (
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
                    <Link href={`/admin/users/roles/${role.id}`} prefetch={false}>
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
    return (
        <AdminTable
            name="roles"
            columns={columns}
            request={getRoles}
            expandedRowRender={(record) => {
                const roles = record.rights.sort((a, b) => {
                    const strA = a.split('_').reverse().join('_')
                    const strB = b.split('_').reverse().join('_')

                    return strA.localeCompare(strB)
                })

                return (
                    <>
                        <Text strong>Rights :</Text>
                        <br />
                        <Space size={[0, 8]} wrap>
                            {roles.map((e, idx) => {
                                const withSpace = e.toLocaleLowerCase().replaceAll('_', ' ')
                                const withCaps = withSpace.charAt(0).toUpperCase() + withSpace.slice(1)

                                return (
                                    <Tag key={idx} color="blue">
                                        {withCaps}
                                    </Tag>
                                )
                            })}
                        </Space>
                    </>
                )
            }}
        />
    )
}

export const dynamic = 'force-dynamic'
export default Roles
