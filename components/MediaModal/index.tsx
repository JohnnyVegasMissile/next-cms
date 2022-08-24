import { ReactNode, useEffect, useState } from 'react'
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
import { SizeType } from 'antd/lib/config-provider/SizeContext'

const { Text } = Typography

interface Props {
    value?: Media
    onMediaSelected: (media: Media | undefined) => void
    type?: 'images' | 'videos' | 'files'
    size?: SizeType
    label?: string
    icon?: ReactNode
    primary?: boolean
    children?: JSX.Element
}

const MediaModal = ({
    value,
    onMediaSelected,
    type = 'images',
    size = 'middle',
    label = 'Choose a picture',
    primary = true,
    icon,
    children,
}: Props) => {
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

    const isLongTag = !!value?.name && value?.name?.length > 37

    return (
        <>
            <Space>
                <div onClick={() => setVisible(true)}>
                    {children ? (
                        children
                    ) : (
                        <Button icon={icon} size={size} type={primary ? 'primary' : undefined}>
                            {label}
                        </Button>
                    )}
                </div>
                {value && (
                    <>
                        <Text>{isLongTag ? `${value?.name.slice(0, 37)}...` : value?.name}</Text>
                        <Button
                            danger
                            size={size}
                            type="primary"
                            // shape="circle"
                            icon={<CloseOutlined />}
                            onClick={() => onMediaSelected(undefined)}
                        />
                    </>
                )}
            </Space>
            <Modal
                centered
                onOk={handleOk}
                visible={visible}
                onCancel={handleCancel}
                title="Choose a picture"
                width={'calc(100vw - 150px)'}
                okButtonProps={{ disabled: !selected }}
                bodyStyle={{ minHeight: 'calc(100vh - 155px)' }}
            >
                <Space size="middle" direction="vertical" style={{ width: '100%' }}>
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
