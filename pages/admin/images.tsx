import { useState, useEffect } from 'react'
// import type { Page } from '@prisma/client'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { Space, Button, Image, Row, Col, Input, Card } from 'antd'
// import Link from 'next/link'
// import moment from 'moment'
import type { Media } from '@prisma/client'

import UploadButton from '../../components/UploadButton'
import { getImages, deleteImage, editImage } from '../../network/images'

const AdminPages = () => {
    const [files, setFiles] = useState<Media[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        getImages()
            .then((res: Media[]) => {
                setFiles(res)
                setLoading(false)
            })
            .catch((e) => setLoading(false))
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    const addFile = (file: Media) => {
        setFiles([...files, file])
    }

    const deleteFile = (id: number) => {
        deleteImage(id)

        const index = files.findIndex((file: Media) => file.id === id)

        if (index === -1) return

        setFiles([...files.slice(0, index), ...files.slice(index + 1)])
    }

    return (
        <>
            <UploadButton onFileRecieved={addFile} />
            <Row gutter={[8, 16]} style={{ width: '100%', padding: 15 }}>
                {files?.map((img, idx) => (
                    <Col key={idx} className="gutter-row" span={6}>
                        <ImageCard
                            img={img}
                            onDelete={deleteFile}
                            onEdit={editImage}
                        />
                    </Col>
                ))}
            </Row>
        </>
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
            title={img.name}
            extra={
                <Button
                    onClick={() => onDelete(img.id)}
                    shape="circle"
                    type="dashed"
                    icon={<CloseOutlined />}
                />
            }
        >
            <Space direction="vertical">
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

AdminPages.requireAuth = true

export default AdminPages
