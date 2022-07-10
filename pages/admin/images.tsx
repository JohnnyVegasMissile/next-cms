import { useState } from 'react'
// import type { Page } from '@prisma/client'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import {
    Space,
    Button,
    Image,
    Row,
    Col,
    Input,
    Card,
    Tooltip,
    Table,
    Popconfirm,
    Form,
} from 'antd'
// import Link from 'next/link'
// import moment from 'moment'
import type { Media } from '@prisma/client'
import { useQuery, UseQueryResult, useQueryClient } from 'react-query'
import get from 'lodash.get'
import trim from 'lodash.trim'

import UploadButton from '../../components/UploadButton'
import { getImages, deleteImage, editImage } from '../../network/images'
import Link from 'next/link'
import moment from 'moment'
import useDebounce from '../../hooks/useDebounce'

const AdminImages = () => {
    const [q, setQ] = useState<string | undefined>()
    const debouncedQ = useDebounce<string | undefined>(q, 750)
    const queryClient = useQueryClient()
    const files: UseQueryResult<Media[], Error> = useQuery<Media[], Error>(
        ['medias', { type: 'image', q: trim(debouncedQ)?.toLocaleLowerCase() || undefined }],
        () => getImages(),
        {
            refetchOnWindowFocus: false,
        }
    )

    const addFile = (file: Media) => {
        queryClient.setQueryData('images', (oldData: any) => {
            // type error
            return [file, ...oldData]
        })
    }

    const deleteFile = async (id: string) => {
        deleteImage(id)

        await queryClient.setQueryData('images', (oldData: any) => {
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
                <Image
                    width={50}
                    height={50}
                    src={`${process.env.UPLOADS_IMAGES_DIR}/${image.uri}`}
                    alt=""
                />
            ),
        },
        {
            title: 'Name',
            // dataIndex: 'name',
            render: (image: Media) => (
                <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${process.env.UPLOADS_IMAGES_DIR}/${image.uri}`}
                >
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
                    placeholder="Search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    style={{ width: 180 }}
                />
                <UploadButton onFileRecieved={addFile} />
            </div>
            <Table
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
