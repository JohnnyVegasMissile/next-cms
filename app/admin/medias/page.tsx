'use client'

import { Button, Form, Image, Input, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd'
import {
    DeleteOutlined,
    PictureOutlined,
    VideoCameraOutlined,
    FilePdfOutlined,
    CloseOutlined,
    CheckOutlined,
    WarningOutlined,
    StopOutlined,
} from '@ant-design/icons'
import { Media, MediaType } from '@prisma/client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AdminTable from '~/components/AdminTable'
import { editImageAlt, getMedias } from '~/network/medias'
import { useState } from 'react'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ObjectId } from '~/types'
import UploadButton from '~/components/UploadButton'
import { formatBytes } from '~/utilities'

const { Text } = Typography

dayjs.extend(relativeTime)

const columns = [
    {
        sorter: true,
        title: 'Name',
        key: 'name',
        render: (
            media: Media & {
                _count: {
                    usedInSections: number
                }
            }
        ) => (
            <Space align="center" size="large">
                {media.type === MediaType.IMAGE && (
                    <Image
                        width={35}
                        style={{ height: 35, width: 35, objectFit: 'contain', objectPosition: 'center' }}
                        src={`/storage/${media.type.toLocaleLowerCase()}s/${media.uri}`}
                        alt={media.alt || ''}
                    />
                )}
                {media.type === MediaType.VIDEO && (
                    <VideoCameraOutlined style={{ fontSize: 21, color: 'rgba(0,0,0,.45)' }} rev={undefined} />
                )}
                {media.type === MediaType.FILE && (
                    <FilePdfOutlined style={{ fontSize: 21, color: 'rgba(0,0,0,.45)' }} rev={undefined} />
                )}
                <Text>
                    <Link href={`/storage/${media.type.toLocaleLowerCase()}s/${media.uri}`} target="_blank">
                        {media?.name}
                    </Link>
                </Text>
                {!media._count.usedInSections && (
                    <Tooltip title="This media is not used anywhere">
                        <Tag color="red" icon={<StopOutlined rev={undefined} />}>
                            Unused
                        </Tag>
                    </Tooltip>
                )}
            </Space>
        ),
    },
    {
        sorter: true,
        title: 'Alt',
        key: 'alt',
        render: (media: Media) => <EditAlt id={media.id} alt={media.alt} />,
        condition: ({ type }: { type?: MediaType }) => type === MediaType.IMAGE,
    },
    {
        sorter: true,
        title: 'Size',
        key: 'size',
        render: (media: Media) => {
            const tooBig = media.type === MediaType.IMAGE && media.size > 1 * 1000 * 1000

            return (
                <Text type={tooBig ? 'danger' : undefined}>
                    {tooBig && (
                        <>
                            <WarningOutlined rev={undefined} />
                            &nbsp;
                        </>
                    )}
                    {formatBytes(media.size)}
                </Text>
            )
        },
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (media: Media) => dayjs(media.updatedAt).fromNow(),
    },
    {
        width: 1,
        key: 'action',
        render: (_: Media) => (
            <Popconfirm
                placement="left"
                title="Delete the task"
                description="Are you sure to delete this task?"
                // onConfirm={(e) => e?.stopPropagation()}
                // onCancel={(e) => e?.stopPropagation()}
                okText="Delete"
                cancelText="Cancel"
            >
                <Tooltip title="Delete">
                    <Button type="primary" danger icon={<DeleteOutlined rev={undefined} />} size="small">
                        Delete
                    </Button>
                </Tooltip>
            </Popconfirm>
        ),
    },
]

const EditAlt = ({ id, alt }: { id: ObjectId; alt: string | null }) => {
    const queryClient = useQueryClient()
    const [newAlt, setNewAlt] = useState(alt || '')

    const isDiff = (alt || '') === newAlt

    const mutation = useMutation((value: string) => editImageAlt(id, value), {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medias'] }),
    })

    const handleChange = (value: string) => {
        setNewAlt(value)
        mutation.reset()
    }

    let validateStatus: 'validating' | 'success' | 'error' | undefined = undefined

    switch (mutation.status) {
        case 'loading':
            validateStatus = 'validating'
            break

        case 'success':
            validateStatus = 'success'
            break

        case 'error':
            validateStatus = 'error'
            break

        default:
            break
    }

    return (
        <Form.Item hasFeedback validateStatus={validateStatus} style={{ margin: 0, width: 350 }}>
            <Space.Compact size="small" style={{ width: '100%' }}>
                <Input
                    size="small"
                    style={{ width: 'calc(100% - 48px)' }}
                    value={newAlt}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <Button
                    disabled={isDiff || mutation.isLoading}
                    type="primary"
                    icon={<CloseOutlined rev={undefined} />}
                    danger
                    size="small"
                    onClick={() => setNewAlt(alt || '')}
                />
                <Button
                    disabled={isDiff || mutation.isLoading}
                    type="primary"
                    icon={<CheckOutlined rev={undefined} />}
                    size="small"
                    onClick={() => mutation.mutate(newAlt)}
                />
            </Space.Compact>
        </Form.Item>
    )
}

const Settings = () => {
    return (
        <AdminTable
            name="medias"
            columns={columns}
            request={getMedias}
            filters={[
                {
                    type: 'radio',
                    key: 'type',
                    default: MediaType.IMAGE,
                    options: [
                        {
                            label: 'Images',
                            value: MediaType.IMAGE,
                            icon: <PictureOutlined rev={undefined} />,
                        },
                        {
                            label: 'Videos',
                            value: MediaType.VIDEO,
                            icon: <VideoCameraOutlined rev={undefined} />,
                        },
                        { label: 'Files', value: MediaType.FILE, icon: <FilePdfOutlined rev={undefined} /> },
                    ],
                },
            ]}
            extra={<UploadButton />}
        />
    )
}

export default Settings
