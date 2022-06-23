import { useState, useEffect } from 'react'
// import type { Page } from '@prisma/client'
import { CloseOutlined } from '@ant-design/icons'
import { Space, Button, Image, Row, Col, Typography } from 'antd'
// import Link from 'next/link'
// import moment from 'moment'
import type { File } from '@prisma/client'

import UploadButton from '../../components/UploadButton'
import { getFiles, deleteFiles } from '../../network/admin'

const AdminPages = () => {
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        getFiles()
            .then((res: File[]) => {
                setFiles(res)
                setLoading(false)
            })
            .catch((e) => setLoading(false))
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    const addFile = (file: File) => {
        setFiles([...files, file])
    }

    const deleteFile = (id: number) => {
        deleteFiles(id)

        const index = files.findIndex((file) => file.id === id)

        if (index === -1) return

        setFiles([...files.slice(0, index), ...files.slice(index + 1)])
    }

    return (
        <>
            <UploadButton onFileRecieved={addFile} />
            <Row gutter={[8, 16]} style={{ width: '100%', padding: 15 }}>
                {files?.map((img, idx) => (
                    <Col key={idx} className="gutter-row" span={6}>
                        <Space direction="vertical">
                            <Image
                                width={200}
                                height={200}
                                src={`${process.env.UPLOADS_IMAGES_DIR}/${img.uri}`}
                                alt=""
                            />
                            <Space>
                                <Typography.Text underline>
                                    {img.name}
                                </Typography.Text>
                                <Button
                                    onClick={() => deleteFile(img.id)}
                                    shape="circle"
                                    icon={<CloseOutlined />}
                                />
                            </Space>
                        </Space>
                    </Col>
                ))}
            </Row>
        </>
    )
}

AdminPages.requireAuth = true

export default AdminPages
