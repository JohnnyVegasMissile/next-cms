import { useState, useEffect } from 'react'
import type { Page } from '@prisma/client'
import { Space, Button, Table, Breadcrumb, Badge, Tag } from 'antd'
import Link from 'next/link'
import moment from 'moment'
import { useQuery, UseQueryResult } from 'react-query'
import { getPages } from '../../../network/pages'
import get from 'lodash.get'

const AdminPages = () => {
    const pages: UseQueryResult<Page[], Error> = useQuery<Page[], Error>(
        ['pages'],
        () => getPages(),
        {
            refetchOnWindowFocus: false,
        }
    )

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
                loading={pages.isLoading}
                dataSource={get(pages, 'data', [])}
                columns={columns}
                pagination={{
                    hideOnSinglePage: true,
                    pageSize: get(pages, 'data', []).length,
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

AdminPages.requireAuth = true

export default AdminPages
