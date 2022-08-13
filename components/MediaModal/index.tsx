import { useEffect, useState } from 'react'
import { Button, Modal, Image, Space, Typography, Table, Input } from 'antd'
import { useQuery, useQueryClient, UseQueryResult } from 'react-query'
import { getMedias } from '../../network/medias'
import type { Media } from '@prisma/client'
import get from 'lodash.get'
import { CloseOutlined } from '@ant-design/icons'
import moment from 'moment'
import UploadButton from '../../components/UploadButton'
import useDebounce from '@hooks/useDebounce'
import trim from 'lodash.trim'

const { Text } = Typography

interface Props {
    value?: Media
    onMediaSelected: (media: Media | undefined) => void
    type?: 'images' | 'videos' | 'files'
}

const MediaModal = ({ value, onMediaSelected, type = 'images' }: Props) => {
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState<Media | null>(value || null)

    const queryClient = useQueryClient()
    const [q, setQ] = useState<string | undefined>()
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
                bodyStyle={{
                    minHeight: 'calc(100vh - 155px)',
                    // maxHeight: 'calc(100vh - 200px)',
                    // overflowY: 'scroll',
                    // overflowX: 'hidden',
                }}
            >
                <Space
                    direction="vertical"
                    size="middle"
                    style={{
                        width: '100%',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Input
                            allowClear
                            placeholder="Search by name"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            style={{ width: 180 }}
                        />
                        <UploadButton onFileRecieved={addFile} />
                    </div>

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
                </Space>
            </Modal>
        </>
    )
}

const columns = [
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
        width: 150,
        title: 'Upload Time',
        dataIndex: 'uploadTime',
        render: (e: Date) => moment(e).fromNow(),
    },
]

export default MediaModal
