import { useState } from 'react'
// import type { Page } from '@prisma/client'
import { Space, Button, Image, Input, Table, Popconfirm, Form } from 'antd'
// import Link from 'next/link'
// import moment from 'moment'
import type { Media } from '@prisma/client'
import { useQuery, UseQueryResult, useQueryClient } from 'react-query'
import get from 'lodash.get'
import trim from 'lodash.trim'

import UploadButton from '../../components/UploadButton'
import { getImages, deleteImage } from '../../network/images'
import moment from 'moment'
import useDebounce from '../../hooks/useDebounce'
import Head from 'next/head'

const AdminImages = () => {
    const queryClient = useQueryClient()
    const [q, setQ] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const queryKeys = [
        'medias',
        { type: 'image', q: trim(debouncedQ)?.toLocaleLowerCase() || undefined },
    ]
    const files: UseQueryResult<Media[], Error> = useQuery<Media[], Error>(queryKeys, () =>
        getImages()
    )

    const addFile = (file: Media) => {
        queryClient.setQueryData(queryKeys, (oldData: any) => {
            // type error
            return [file, ...oldData]
        })
    }

    const deleteFile = async (id: string) => {
        deleteImage(id)

        await queryClient.setQueryData(queryKeys, (oldData: any) => {
            // type error
            const index = oldData.findIndex((file: Media) => file.id === id)

            if (index === -1) return oldData

            return [...oldData.slice(0, index), ...oldData.slice(index + 1)]
        })
    }

    function bytesToSize(bytes: number) {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0 || !bytes) return '0 Byte'

        let i = Math.floor(Math.log(bytes) / Math.log(1024))
        return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
    }

    const columns = [
        {
            width: 75,
            render: (image: Media) => (
                <Image width={50} height={50} src={`/api/uploads/${image.uri}`} alt="" />
            ),
        },
        {
            title: 'Name',
            // dataIndex: 'name',
            render: (image: Media) => (
                <a target="_blank" rel="noreferrer" href={`/api/uploads/${image.uri}`}>
                    {image.name}
                </a>
            ),
        },
        {
            width: 256,
            title: 'Alt',
            // dataIndex: 'alt',
            render: (e: Media) => <AltInput id={e.id} value={e.alt || ''} />,
        },
        {
            width: 150,
            title: 'size',
            dataIndex: 'size',
            render: bytesToSize,
        },
        {
            width: 150,
            title: 'Upload Time',
            dataIndex: 'uploadTime',
            render: (e: Date) => moment(e).fromNow(),
        },
        {
            width: 95,
            render: (e: Media) => (
                <Space>
                    <Popconfirm
                        placement="topRight"
                        title={'Are you sur to delete this image?'}
                        onConfirm={() => deleteFile(e.id)}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <>
            <Head>
                <title>Admin - Images</title>
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
                    <Input
                        placeholder="Search by name"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        style={{ width: 180 }}
                    />
                    <UploadButton onFileRecieved={addFile} />
                </div>
                <Table
                    rowKey={(record) => record.id}
                    bordered={false}
                    loading={files.isLoading}
                    dataSource={get(files, 'data', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 160px)' }}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(files, 'data', []).length,
                    }}
                />
            </Space>
        </>
    )
}

const AltInput = ({ id, value }: { id: string; value: string }) => {
    return (
        <Form.Item style={{ margin: 0 }} hasFeedback validateStatus="success" /*"warning"*/>
            <Input placeholder="Alt" defaultValue={value} style={{ width: 240 }} />
        </Form.Item>
    )
}

AdminImages.requireAuth = true

export default AdminImages
