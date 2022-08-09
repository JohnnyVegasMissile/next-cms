import { useEffect, useMemo, useRef, useState } from 'react'
// import type { Page } from '@prisma/client'
import { Space, Button, Image, Input, Table, Popconfirm, Form, Radio } from 'antd'
// import Link from 'next/link'
// import moment from 'moment'
import type { Media } from '@prisma/client'
import { useQuery, UseQueryResult, useQueryClient, useMutation } from 'react-query'
import get from 'lodash.get'
import trim from 'lodash.trim'

import UploadButton from '../../components/UploadButton'
import { getMedias, deleteMedia, editImageAlt } from '../../network/medias'
import moment from 'moment'
import useDebounce from '../../hooks/useDebounce'
import Head from 'next/head'
import { FileOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons'

const AdminImages = () => {
    const queryClient = useQueryClient()
    const [q, setQ] = useState<string | undefined>()
    const [type, setType] = useState<string>('images')
    const debouncedQ = useDebounce<string | undefined>(q, 750)

    const queryKeys = [
        'medias',
        {
            type,
            q: trim(debouncedQ)?.toLocaleLowerCase() || undefined,
        },
    ]

    const files: UseQueryResult<Media[], Error> = useQuery<Media[], Error>(queryKeys, () =>
        getMedias(type, trim(debouncedQ)?.toLocaleLowerCase())
    )

    const addFile = (file: Media) => {
        queryClient.setQueryData(queryKeys, (oldData: any) => {
            // type error
            return [file, ...oldData]
        })
    }

    const deleteFile = async (id: string) => {
        deleteMedia(id)

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

    const columns = useMemo(() => {
        const action = {
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
        }
        const uploadTime = {
            width: 150,
            title: 'Upload Time',
            dataIndex: 'uploadTime',
            render: (e: Date) => moment(e).fromNow(),
        }
        const size = {
            width: 150,
            title: 'size',
            dataIndex: 'size',
            render: bytesToSize,
        }

        switch (type) {
            case 'images':
                return [
                    {
                        width: 75,
                        render: (image: Media) => (
                            <Image width={50} height={50} src={`/api/uploads/images/${image.uri}`} alt="" />
                        ),
                    },
                    {
                        title: 'Name',
                        // dataIndex: 'name',
                        render: (image: Media) => (
                            <a target="_blank" rel="noreferrer" href={`/api/uploads/images/${image.uri}`}>
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
                    size,
                    uploadTime,
                    action,
                ]
            case 'videos':
                return [
                    {
                        width: 35,
                        render: () => <VideoCameraOutlined />,
                    },
                    {
                        title: 'Name',
                        // dataIndex: 'name',
                        render: (image: Media) => (
                            <a target="_blank" rel="noreferrer" href={`/api/uploads/videos/${image.uri}`}>
                                {image.name}
                            </a>
                        ),
                    },
                    // {
                    //     width: 150,
                    //     title: 'Duration',
                    //     // dataIndex: 'size',
                    //     render: () => '1m 56s',
                    // },
                    size,
                    uploadTime,
                    action,
                ]
            case 'files':
                return [
                    {
                        width: 35,
                        render: () => <FileOutlined />,
                    },
                    {
                        title: 'Name',
                        // dataIndex: 'name',
                        render: (image: Media) => (
                            <a target="_blank" rel="noreferrer" href={`/api/uploads/files/${image.uri}`}>
                                {image.name}
                            </a>
                        ),
                    },
                    size,
                    uploadTime,
                    action,
                ]

            default:
                return []
        }
    }, [type])

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
                    <Space>
                        <Input
                            allowClear
                            placeholder="Search by name"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            style={{ width: 180 }}
                        />
                        <Radio.Group
                            options={[
                                {
                                    label: (
                                        <Space>
                                            <PictureOutlined />
                                            Images
                                        </Space>
                                    ),
                                    value: 'images',
                                },
                                {
                                    label: (
                                        <Space>
                                            <VideoCameraOutlined />
                                            Videos
                                        </Space>
                                    ),
                                    value: 'videos',
                                },
                                {
                                    label: (
                                        <Space>
                                            <FileOutlined />
                                            Files
                                        </Space>
                                    ),
                                    value: 'files',
                                },
                            ]}
                            onChange={(e) => setType(e.target.value)}
                            value={type}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </Space>
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
    const [alt, setAlt] = useState<string>(value)
    const debouncedAlt = useDebounce<string>(alt, 1500)

    const mutation = useMutation((val: string) => editImageAlt(id, val))

    useEffect(() => {
        mutation.mutate(debouncedAlt)
    }, [debouncedAlt])

    return (
        <Form.Item
            style={{ margin: 0 }}
            hasFeedback
            validateStatus={mutation.isLoading ? 'validating' : mutation.isError ? 'warning' : 'success'}
        >
            <Input placeholder="Alt" value={alt} onChange={(e) => setAlt(e.target.value)} style={{ width: '100%' }} />
        </Form.Item>
    )
}

AdminImages.requireAuth = true

export default AdminImages
