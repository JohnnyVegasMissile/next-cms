import { useState } from 'react'
import { Button, Card, Col, Modal, Radio, Row, Image, Space, Typography } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { getImages } from '../../network/images'
import type { Media } from '@prisma/client'
import get from 'lodash.get'
import { CloseOutlined } from '@ant-design/icons'

const { Text } = Typography

interface Props {
    value?: Media
    onMediaSelected: (media: Media | undefined) => void
}

const MediaModal = ({ value, onMediaSelected }: Props) => {
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState<Media | null>(value || null)
    const files: UseQueryResult<Media[], Error> = useQuery<Media[], Error>(
        ['images'],
        () => getImages(),
        {
            refetchOnWindowFocus: false,
        }
    )

    const handleOk = () => {
        onMediaSelected(selected!)
        setVisible(false)
        setSelected(null)
    }

    const handleCancel = () => {
        setVisible(false)
        setSelected(null)
    }

    return (
        <>
            <Space>
                <Button type="primary" onClick={() => setVisible(true)}>
                    Choose a picture
                </Button>
                {value && (
                    <>
                        <Text>{value?.name}</Text>
                        <Button
                            danger
                            onClick={() => onMediaSelected(undefined)}
                            shape="circle"
                            icon={<CloseOutlined />}
                        />
                    </>
                )}
            </Space>
            <Modal
                title="Choose a picture"
                centered
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ disabled: !selected }}
                width={'90%'}
            >
                <Row gutter={[8, 16]} style={{ width: '100%', padding: 15 }}>
                    {files.isLoading && <div>Loading...</div>}
                    {get(files, 'data', []).map((img, idx) => (
                        <Col key={idx} className="gutter-row" span={6}>
                            <Card
                                title={img.name}
                                extra={
                                    <Radio
                                        checked={selected?.id === img.id}
                                        onClick={() => setSelected(img)}
                                    />
                                }
                            >
                                <Image
                                    width={200}
                                    height={200}
                                    src={`${process.env.UPLOADS_IMAGES_DIR}/${img.uri}`}
                                    alt=""
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Modal>
        </>
    )
}

export default MediaModal
