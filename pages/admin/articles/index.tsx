import type { Article, Page } from '@prisma/client'
import { Space, Button, Table, Breadcrumb, Badge, Popconfirm, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import moment from 'moment'
import { useQuery, UseQueryResult } from 'react-query'

import { getArticles } from '../../../network/articles'
import get from 'lodash.get'
import trim from 'lodash.trim'
import { FullArticle } from 'types'
import { useState } from 'react'
import useDebounce from '../../../hooks/useDebounce'
import CustomSelect from '../../../components/CustomSelect'
import Head from 'next/head'

const AdminArticles = () => {
    const [q, setQ] = useState<string | undefined>()
    const [pageId, setPageId] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const articles: UseQueryResult<Article[], Error> = useQuery<Article[], Error>(
        ['articles', { q: trim(debouncedQ)?.toLocaleLowerCase() || undefined, pageId }],
        () => getArticles(pageId, trim(debouncedQ)?.toLocaleLowerCase()),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <>
            <Head>
                <title>Admin - Articles</title>
            </Head>

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
                        <CustomSelect.ListPages
                            width={180}
                            value={pageId}
                            onChange={setPageId}
                        />
                    </Space>
                    <Link href="/admin/articles/create">
                        <a>
                            <Button type="primary" icon={<PlusOutlined />}>
                                Create
                            </Button>
                        </a>
                    </Link>
                </div>
                <Table
                    bordered={false}
                    loading={articles.isLoading}
                    dataSource={get(articles, 'data', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 300px)' }}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(articles, 'data', []).length,
                    }}
                />
            </Space>
        </>
    )
}

// const showDeleteConfirm = () => {
//     confirm({
//         title: 'Are you sure delete this task?',
//         icon: <ExclamationCircleOutlined />,
//         content: 'Some descriptions',
//         okText: 'Yes',
//         okType: 'danger',
//         cancelText: 'No',
//         onOk() {
//             console.log('OK')
//         },
//         onCancel() {
//             console.log('Cancel')
//         },
//     })
// }

const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
    },
    {
        title: 'URL',
        render: (e: FullArticle) => {
            return (
                <Link href={`/${e.page.slug}/${e.slug}`}>
                    <a>
                        <Breadcrumb>
                            {e.page.slug!.split('/').map((s: string, idx: number) => (
                                <Breadcrumb.Item key={idx}>{s}</Breadcrumb.Item>
                            ))}
                            <Breadcrumb.Item>{e.slug}</Breadcrumb.Item>
                        </Breadcrumb>
                    </a>
                </Link>
            )
        },
    },
    {
        title: 'List',
        dataIndex: 'page',
        render: (e: Page) => e.title,
    },
    {
        title: 'Published',
        render: (e: FullArticle) => {
            const isPublished = e.published && e.page.published

            return (
                <Badge
                    status={isPublished ? 'success' : 'error'}
                    text={isPublished ? 'Published' : 'Unpublished'}
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
        width: 155,
        render: (e: Article) => (
            <Space>
                <Button type="primary">
                    <Link href={`/admin/articles/${e.id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>

                <Popconfirm
                    placement="topRight"
                    title={'ho la la'}
                    onConfirm={() => {
                        fetch(`/api/articles/${e.id}`, {
                            method: 'DELETE',
                        })
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger>Delete</Button>
                </Popconfirm>
            </Space>
        ),
    },
]

AdminArticles.requireAuth = true

export default AdminArticles
