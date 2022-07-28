import { useState } from 'react'
import type { User, Login } from '@prisma/client'
import { Tag, Space, Input, Table, Button, Popconfirm } from 'antd'
import Link from 'next/link'
import Head from 'next/head'
import get from 'lodash.get'
import trim from 'lodash.trim'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery, UseQueryResult } from 'react-query'

import { getUsers } from '../../../network/users'
import type { FullUser } from '../../../types'
import useDebounce from '../../../hooks/useDebounce'
import CustomSelect from '../../../components/CustomSelect'

const AdminUsers = () => {
    // const router = useRouter()
    // const { search, role } = router.query
    const [q, setQ] = useState<string | undefined>()
    const [roleId, setTypeId] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const users: UseQueryResult<User[], Error> = useQuery<User[], Error>(
        ['users', { q: trim(debouncedQ)?.toLocaleLowerCase() || undefined, roleId }],
        () => getUsers(roleId, trim(debouncedQ)?.toLocaleLowerCase())
    )

    return (
        <>
            <Head>
                <title>Admin - Users</title>
            </Head>

            <Space
                direction="vertical"
                size="middle"
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
                            placeholder="Search by name"
                            style={{ width: 180 }}
                            onChange={(e) => setQ(e.target.value)}
                        />

                        <CustomSelect.ListRoles width={180} value={roleId} onChange={setTypeId} />
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
                    rowKey={(record) => record.id}
                    bordered={false}
                    loading={users.isLoading}
                    dataSource={get(users, 'data', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 155px)' }}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(users, 'data', []).length,
                    }}
                />
            </Space>
        </>
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
            const type: string = get(e, 'role.id', '')
            const color = type === 'super-admin' ? 'magenta' : type === 'admin' ? 'red' : 'blue'

            return <Tag color={color}>{get(e, 'role.name', '')}</Tag>
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
                    disabled={e?.login?.role?.id === 'super-admin'}
                    onConfirm={() => {
                        fetch(`/api/users/${e.id}`, {
                            method: 'DELETE',
                        })
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger disabled={e?.login?.role?.id === 'super-admin'}>
                        Delete
                    </Button>
                </Popconfirm>
            </Space>
        ),
    },
]

AdminUsers.requireAuth = true

export default AdminUsers
