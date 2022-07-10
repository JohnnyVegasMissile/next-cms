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
    Select,
} from 'antd'
import Link from 'next/link'
// import moment from 'moment'
import { useQuery, UseQueryResult } from 'react-query'
import { getUsers } from '../../../network/users'
import type { FullUser, UserRoleTypes } from '../../../types'
import get from 'lodash.get'
import trim from 'lodash.trim'
import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useDebounce from '../../../hooks/useDebounce'
import CustomSelect from '@components/CustomSelect'

const { Option } = Select

const AdminUsers = () => {
    const [q, setQ] = useState<string | undefined>()
    const [typeId, setTypeId] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const users: UseQueryResult<User[], Error> = useQuery<User[], Error>(
        ['users', { q: trim(debouncedQ)?.toLocaleLowerCase() || undefined, typeId }],
        () => getUsers(typeId, trim(debouncedQ)?.toLocaleLowerCase()),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Space
            direction="vertical"
            size="large"
            style={{
                width: '100%',
                padding: 15,
                backgroundColor: '#f0f2f5',
                minHeight: 'calc(100vh - 29px)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                    <Input
                        value={q}
                        allowClear
                        placeholder="Search"
                        style={{ width: 180 }}
                        onChange={(e) => setQ(e.target.value)}
                    />

                    <CustomSelect.ListUserTypes value={typeId} onChange={setTypeId} />
                    {/* <Select
                        allowClear
                        value={type}
                        onChange={setType}
                        placeholder="Role"
                        style={{ width: 180 }}
                    >
                        <Option value="admin">Admin</Option>
                        <Option value="user">User</Option>
                    </Select> */}
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
                size="small"
                scroll={{ y: 'calc(100vh - 300px)' }}
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
            const type: string = get(e, 'type.id', '')
            const color =
                type === 'super-admin' ? 'magenta' : type === 'admin' ? 'red' : 'blue'
            const types = {
                admin: { label: 'Admin', color: 'red' },
                'super-admin': { label: 'Admin', color: 'magenta' },
                user: { label: 'User', color: 'blue' },
            }

            return <Tag color={color}>{get(e, 'type.name', '')}</Tag>
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
        width: 155,
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
                    // disabled={e?.login?.type === 'super-admin'}
                    onConfirm={() => {
                        fetch(`/api/users/${e.id}`, {
                            method: 'DELETE',
                        })
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger /*disabled={e?.login?.type === 'super-admin'}*/>
                        Delete
                    </Button>
                </Popconfirm>
            </Space>
        ),
    },
]

AdminUsers.requireAuth = true

export default AdminUsers
