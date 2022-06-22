import { useState, useEffect } from 'react'
import type { Page } from '@prisma/client'
import { CloseOutlined } from '@ant-design/icons'
import { Space, Button, Image, Row, Col, Typography } from 'antd'
import Link from 'next/link'
import moment from 'moment'

import { getFiles, deleteFiles } from '../../network/admin'

const AdminPages = () => {
    const [files, setFiles] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        getFiles()
            .then((res: string[]) => {
                setFiles(res)
                setLoading(false)
            })
            .catch((e) => setLoading(false))
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Row gutter={[8, 16]} style={{ width: '100%', padding: 15 }}>
            {files?.map((url, idx) => (
                <Col key={idx} className="gutter-row" span={6}>
                    <Space direction="vertical">
                        <Image
                            width={200}
                            src={`/uploads/images/${url}`}
                            alt=""
                        />
                        <Space>
                            <Typography.Text underline>{url}</Typography.Text>
                            <Button
                                onClick={() => deleteFiles(url)}
                                shape="circle"
                                icon={<CloseOutlined />}
                            />
                        </Space>
                    </Space>
                </Col>
            ))}
        </Row>
    )
}

AdminPages.requireAuth = true

export default AdminPages
