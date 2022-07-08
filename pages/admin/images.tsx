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

import UploadButton from '../../components/UploadButton'
import { getImages, deleteImage, editImage } from '../../network/images'
import Link from 'next/link'
import moment from 'moment'

const AdminImages = () => {
    const queryClient = useQueryClient()
    const files: UseQueryResult<Media[], Error> = useQuery<Media[], Error>(
        ['images'],
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
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes === 0 || !bytes) return '0 Byte'

        var i = Math.floor(Math.log(bytes) / Math.log(1024))
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
            title: 'size',
            dataIndex: 'size',
            render: bytesToSize,
        },
        {
            width: 256,
            title: 'Alt',
            dataIndex: 'alt',
            render: (alt: string) => (
                <Form.Item
                    style={{ margin: 0 }}
                    hasFeedback
                    validateStatus="success" /*"warning"*/
                >
                    <Input placeholder="Alt" defaultValue={alt} style={{ width: 240 }} />
                </Form.Item>
            ),
        },
        {
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
            {/* <Row gutter={[8, 16]} style={{ width: '100%', padding: 15 }}>
                <Col span={24}>
                    <UploadButton onFileRecieved={addFile} />
                </Col>
                {files.isLoading && <div>Loading...</div>}
                {get(files, 'data', []).map((img, idx) => (
                    <Col key={idx} className="gutter-row" span={6}>
                        <ImageCard img={img} onDelete={deleteFile} onEdit={editImage} />
                    </Col>
                ))}
            </Row> */}
            <Space direction="vertical" size="large" style={{ width: '100%', padding: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input placeholder="Search" />
                        <Input placeholder="Type" />
                    </Space>
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
        </>
    )
}
// interface ImageCardProps {
//     img: Media
//     onDelete(id: number | string): void
//     onEdit(id: number | string, alt: string): void
// }

// const ImageCard = ({ img, onDelete, onEdit }: ImageCardProps) => {
//     const [alt, setAlt] = useState<string>(img.alt || '')

//     return (
//         <Card
//             title={
//                 <Tooltip title={img.name}>
//                     <span>{img.name}</span>
//                 </Tooltip>
//             }
//             extra={
//                 <Button
//                     onClick={() => onDelete(img.id)}
//                     shape="circle"
//                     type="dashed"
//                     icon={<CloseOutlined />}
//                 />
//             }
//         >
//             <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }}>
//                 <Image
//                     width={200}
//                     height={200}
//                     src={`${process.env.UPLOADS_IMAGES_DIR}/${img.uri}`}
//                     alt=""
//                 />
//                 <Space>
//                     <Input.Search
//                         value={alt}
//                         onChange={(e) => setAlt(e.target.value)}
//                         addonBefore="Alt :"
//                         // placeholder="Alt"
//                         onSearch={(e) => onEdit(img.id, e)}
//                         enterButton={<CheckOutlined />}
//                     />
//                 </Space>
//             </Space>
//         </Card>
//     )
// }

AdminImages.requireAuth = true

export default AdminImages
