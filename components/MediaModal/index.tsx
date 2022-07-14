import { useEffect, useState } from 'react'
import { Button, Modal, Image, Space, Typography, Table } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { getImages } from '../../network/images'
import type { Media } from '@prisma/client'
import get from 'lodash.get'
import { CloseOutlined } from '@ant-design/icons'
import moment from 'moment'

const { Text } = Typography

interface Props {
    value?: Media
    onMediaSelected: (media: Media | undefined) => void
}

const MediaModal = ({ value, onMediaSelected }: Props) => {
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState<Media | null>(value || null)
    const files: UseQueryResult<Media[], Error> = useQuery<Media[], Error>(
        ['medias', { type: 'images' }],
        () => getImages(),
        {
            refetchOnWindowFocus: false,
        }
    )

    useEffect(() => {
        setSelected(value || null)
    }, [value])

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
                            type="primary"
                            danger
                            onClick={() => onMediaSelected(undefined)}
                            // shape="circle"
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
                width={'calc(100vw - 150px)'}
                bodyStyle={
                    {
                        // maxHeight: 'calc(100vh - 200px)',
                        // overflowY: 'scroll',
                        // overflowX: 'hidden',
                    }
                }
            >
                <Table
                    // bordered={false}
                    loading={files.isLoading}
                    dataSource={get(files, 'data', [])}
                    columns={columns}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(files, 'data', []).length,
                    }}
                    size="small"
                    scroll={{ y: 'calc(100vh - 155px)' }}
                    rowKey="id"
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: !!selected?.id ? [selected?.id] : [],
                        onChange: (selectedRowKeys: React.Key[], selectedRows: Media[]) =>
                            setSelected(get(selectedRows, '0', undefined)),
                    }}
                />
            </Modal>
        </>
    )
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
        width: 150,
        title: 'Upload Time',
        dataIndex: 'uploadTime',
        render: (e: Date) => moment(e).fromNow(),
    },
]

export default MediaModal
