// import { useState, useEffect } from 'react'
import type { User, Login } from '@prisma/client'
import {
    Space,
    Button,
    Table,
    // Breadcrumb,
    // Badge,
    Tag,
    // Typography,
    Popconfirm,
    Input,
} from 'antd'
import Link from 'next/link'
// import moment from 'moment'
import { useQuery, UseQueryResult } from 'react-query'
import { getUsers } from '../../../network/users'
import type { FullUser } from '../../../types'
import get from 'lodash.get'
import { PlusOutlined } from '@ant-design/icons'

const AdminUsers = () => {
    const users: UseQueryResult<User[], Error> = useQuery<User[], Error>(
        ['users'],
        () => getUsers(),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Space direction="vertical" size="large" style={{ width: '100%', padding: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                    <Input placeholder="Search" />
                    <Input placeholder="Role" />
                </Space>
                <Link href="/admin/users/create">
                    <a>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Create
                        </Button>
                    </a>
                </Link>
            </div>
            <Table
                bordered={false}
                loading={users.isLoading}
                dataSource={get(users, 'data', [])}
                columns={columns}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: get(users, 'data', []).length,
                }}
            />
        </Space>
    )
}

const columns = [
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    // },
    {
        title: 'Type',
        dataIndex: 'login',
        render: (e: Login) => {
            const types = {
                admin: { label: 'Admin', color: 'red' },
                'super-admin': { label: 'Admin', color: 'magenta' },
                user: { label: 'User', color: 'blue' },
            }

            return (
                <Tag color={get(types, e?.type, types.user).color}>
                    {get(types, e?.type, types.user).label}
                </Tag>
            )
        },
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'login',
        render: (e: Login) => e?.email,
    },
    {
        width: 1,
        render: (e: FullUser) => (
            <Space>
                <Button type="primary">
                    <Link href={`/admin/users/${e.id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>

                <Popconfirm
                    placement="topRight"
                    title={'ho la la'}
                    disabled={e?.login?.type === 'super-admin'}
                    onConfirm={() => {
                        fetch(`/api/users/${e.id}`, {
                            method: 'DELETE',
                        })
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger disabled={e?.login?.type === 'super-admin'}>
                        Delete
                    </Button>
                </Popconfirm>
            </Space>
        ),
    },
]

AdminUsers.requireAuth = true

export default AdminUsers
