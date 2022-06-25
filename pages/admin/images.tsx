import { useState } from 'react'
// import type { Page } from '@prisma/client'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Space, Button, Image, Row, Col, Input, Card, Tooltip } from 'antd'
// import Link from 'next/link'
// import moment from 'moment'
import type { Media } from '@prisma/client'
import { useQuery, UseQueryResult, useQueryClient } from 'react-query'
import get from 'lodash.get'

import UploadButton from '../../components/UploadButton'
import { getImages, deleteImage, editImage } from '../../network/images'

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

    const deleteFile = async (id: number) => {
        deleteImage(id)

        await queryClient.setQueryData('images', (oldData: any) => {
            // type error
            const index = oldData.findIndex((file: Media) => file.id === id)

            if (index === -1) return oldData

            return [...oldData.slice(0, index), ...oldData.slice(index + 1)]
        })
    }

    return (
        <Row gutter={[8, 16]} style={{ width: '100%', padding: 15 }}>
            <Col span={24}>
                <UploadButton onFileRecieved={addFile} />
            </Col>
            {files.isLoading && <div>Loading...</div>}
            {get(files, 'data', []).map((img, idx) => (
                <Col key={idx} className="gutter-row" span={6}>
                    <ImageCard
                        img={img}
                        onDelete={deleteFile}
                        onEdit={editImage}
                    />
                </Col>
            ))}
        </Row>
    )
}

interface ImageCardProps {
    img: Media
    onDelete(id: number): void
    onEdit(id: number, alt: string): void
}

const ImageCard = ({ img, onDelete, onEdit }: ImageCardProps) => {
    const [alt, setAlt] = useState<string>(img.alt || '')

    return (
        <Card
            title={
                <Tooltip title={img.name}>
                    <span>{img.name}</span>
                </Tooltip>
            }
            extra={
                <Button
                    onClick={() => onDelete(img.id)}
                    shape="circle"
                    type="dashed"
                    icon={<CloseOutlined />}
                />
            }
        >
            <Space
                direction="vertical"
                style={{ width: '100%', alignItems: 'center' }}
            >
                <Image
                    width={200}
                    height={200}
                    src={`${process.env.UPLOADS_IMAGES_DIR}/${img.uri}`}
                    alt=""
                />
                <Space>
                    <Input.Search
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        addonBefore="Alt :"
                        // placeholder="Alt"
                        onSearch={(e) => onEdit(img.id, e)}
                        enterButton={<CheckOutlined />}
                    />
                </Space>
            </Space>
        </Card>
    )
}

AdminImages.requireAuth = true

export default AdminImages
