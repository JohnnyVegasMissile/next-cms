import { useState, useEffect } from 'react'
import type { Page } from '@prisma/client'
import { Space, Button, Table, Breadcrumb, Badge, Tag } from 'antd'
import Link from 'next/link'
import moment from 'moment'

const AdminUsers = () => {
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const getPages = async () => {
            setLoading(true)
            const res = await fetch('/api/pages')

            const pages: Page[] = await res.json()
            setPages(pages)
            setLoading(false)
        }

        getPages()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Space
            direction="vertical"
            size="large"
            style={{ width: '100%', padding: 15 }}
        >
            <Button type="primary">
                <Link href="/admin/pages/create">
                    <a>Create</a>
                </Link>
            </Button>
            <Table
                bordered={false}
                loading={loading}
                dataSource={pages}
                columns={columns}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: pages?.length,
                }}
            />
        </Space>
    )
}

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Title',
        dataIndex: 'title',
    },
    {
        title: 'Title',
        render: (e: Page) => (
            <Link href={`/${e}`}>
                <a>
                    {e.type !== 'page' ? (
                        <Tag color="cyan">{e.type}</Tag>
                    ) : (
                        <Breadcrumb>
                            {e.slug.split('/').map((s: string, idx: number) => (
                                <Breadcrumb.Item key={idx}>{s}</Breadcrumb.Item>
                            ))}
                        </Breadcrumb>
                    )}
                </a>
            </Link>
        ),
    },
    {
        title: 'Published',
        dataIndex: 'published',
        render: (e: boolean) => {
            return (
                <Badge
                    status={e ? 'success' : 'error'}
                    text={e ? 'Published' : 'Unpublished'}
                />
            )
        },
    },

    {
        title: 'Last updated',
        dataIndex: 'updatedAt',
        render: (e: Date) => moment(e).fromNow(),
    },
    {
        width: 1,
        render: (e: Page) => (
            <Space>
                <Button type="primary">
                    <Link href={`/admin/pages/${e.id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>
                <Button
                    danger
                    disabled={e.type !== 'page'}
                    onClick={() => {
                        fetch(`/api/pages/${e.id}`, {
                            method: 'DELETE',
                        })
                    }}
                >
                    Delete
                </Button>
            </Space>
        ),
    },
]

AdminUsers.requireAuth = true

export default AdminUsers
