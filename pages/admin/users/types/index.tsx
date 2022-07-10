// import { useState, useEffect } from 'react'
import type { User, Login, UserType } from '@prisma/client'
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
import { getUserTypes } from '../../../../network/userTypes'
import type { FullUser, UserRoleTypes } from '../../../../types'
import get from 'lodash.get'
import trim from 'lodash.trim'
import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import useDebounce from '../../../../hooks/useDebounce'
import moment from 'moment'

const AdminUserTypes = () => {
    const [q, setQ] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const userTypes: UseQueryResult<UserType[], Error> = useQuery<UserType[], Error>(
        ['userTypes', { q: trim(debouncedQ)?.toLocaleLowerCase() || undefined }],
        () => getUserTypes(trim(debouncedQ)?.toLocaleLowerCase()),
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
                <Input
                    value={q}
                    allowClear
                    placeholder="Search"
                    style={{ width: 180 }}
                    onChange={(e) => setQ(e.target.value)}
                />
                <Link href="/admin/users/types/create">
                    <a>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Create
                        </Button>
                    </a>
                </Link>
            </div>
            <Table
                bordered={false}
                loading={userTypes.isLoading}
                dataSource={get(userTypes, 'data', [])}
                columns={columns}
                size="small"
                scroll={{ y: 'calc(100vh - 300px)' }}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: get(userTypes, 'data', []).length,
                }}
            />
        </Space>
    )
}

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        width: 150,
        title: 'Last updated',
        dataIndex: 'updatedAt',
        render: (e: Date) => moment(e).fromNow(),
    },
    {
        width: 155,
        render: (e: UserType) => (
            <Space>
                <Button type="primary">
                    <Link href={`/admin/users/types/${e.id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>

                <Popconfirm
                    placement="topRight"
                    title={'Are you sur to delete this page?'}
                    disabled={e.id === 'super-admin' || e.id === 'admin'}
                    onConfirm={() => {}} //deletePage(e.id)}
                    okText="Delete"
                    cancelText="Cancel"
                >
                    <Button danger disabled={e.id === 'super-admin' || e.id === 'admin'}>
                        Delete
                    </Button>
                </Popconfirm>
            </Space>
        ),
    },
]

AdminUserTypes.requireAuth = true

export default AdminUserTypes
