'use client'

import AdminTable from '~/components/AdminTable'
import BreadcrumdLink from '~/components/BreadcrumdLink'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
    Container,
    ContainerField,
    ContainerFieldType,
    Content,
    ContentField,
    Metadata,
    Slug,
} from '@prisma/client'
import Link from 'next/link'
import { ColumnsType } from 'antd/es/table'
import { Badge, Button, Divider, Popconfirm, Space, Tooltip, Table, Typography, Tag } from 'antd'
import { PicCenterOutlined, CopyOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getContents } from '~/network/contents'

dayjs.extend(relativeTime)

const { Text } = Typography

type DataType = Content & {
    slug: Slug | null
    fields: ContentField[]
    metadatas: Metadata[]
    container: (Container & { fields: ContainerField[] }) | null
}

const columns: ColumnsType<DataType> = [
    {
        sorter: true,
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        sorter: true,
        title: 'Container',
        key: 'container',
        render: (content) => content.container?.name,
    },
    {
        sorter: true,
        title: 'Url',
        key: 'slug',
        render: (content) => <BreadcrumdLink url={content?.slug?.full} />,
    },
    {
        sorter: true,
        title: 'Last updated',
        key: 'updatedAt',
        render: (content) => dayjs(content.updatedAt).fromNow(),
    },
    {
        sorter: true,
        title: 'Status',
        key: 'published',
        render: (content) => (
            <Badge
                status={content.published ? 'success' : 'error'}
                text={`${content.published ? 'P' : 'Unp'}ublished`}
            />
        ),
    },
    {
        width: 1,
        key: 'action',
        render: (content) => (
            <Space>
                <Link href={`/admin/contents/${content.id}/sections`} prefetch={false}>
                    <Tooltip title="Custom sections">
                        <Button icon={<PicCenterOutlined />} size="small" type="dashed" />
                    </Tooltip>
                </Link>
                <Divider type="vertical" style={{ margin: 0 }} />
                <Tooltip title="Duplicate">
                    <Button icon={<CopyOutlined />} size="small" />
                </Tooltip>
                <Link href={`/admin/contents/${content.id}`} prefetch={false}>
                    <Tooltip title="Edit">
                        <Button type="primary" icon={<EditOutlined />} size="small">
                            Edit
                        </Button>
                    </Tooltip>
                </Link>
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
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Tooltip>
                </Popconfirm>
            </Space>
        ),
    },
]

const Contents = () => {
    return (
        <AdminTable
            isContent
            expandedRowRender={(record) => (
                <Table
                    size="small"
                    bordered
                    pagination={{ position: ['none', 'none'] as any }}
                    columns={record.container?.fields.map((field) => ({
                        title: (
                            <Text>
                                {field.name}
                                {field.required && <Text type="danger"> *</Text>}
                            </Text>
                        ),
                        render: (content: DataType) => {
                            const matching = content.fields.find(
                                (cField) => cField.releatedFieldId === field.id
                            )

                            if (!matching) return null

                            switch (matching.type) {
                                case ContainerFieldType.RICHTEXT:
                                case ContainerFieldType.COLOR:
                                case ContainerFieldType.CONTENT:
                                case ContainerFieldType.VIDEO:
                                case ContainerFieldType.FILE:
                                case ContainerFieldType.IMAGE:
                                case ContainerFieldType.PARAGRAPH:
                                case ContainerFieldType.STRING:
                                case ContainerFieldType.OPTION: {
                                    if (field.multiple) {
                                        return matching.multipleTextValue.map((text, idx) => (
                                            <Tag key={idx} color="blue" bordered={false}>
                                                {text}
                                            </Tag>
                                        ))
                                    } else {
                                        return (
                                            <Tag color="blue" bordered={false}>
                                                {matching.textValue}
                                            </Tag>
                                        )
                                    }
                                }

                                case ContainerFieldType.NUMBER: {
                                    if (field.multiple) {
                                        return matching.multipleNumberValue.map((number, idx) => (
                                            <Tag key={idx} color="orange" bordered={false}>
                                                {number}
                                            </Tag>
                                        ))
                                    } else {
                                        return (
                                            <Tag color="orange" bordered={false}>
                                                {matching.numberValue}
                                            </Tag>
                                        )
                                    }
                                }

                                case ContainerFieldType.DATE: {
                                    if (field.multiple) {
                                        return matching.multipleDateValue.map((date, idx) => (
                                            <Tag key={idx} color="purple" bordered={false}>
                                                {dayjs(date).format('DD MMM YYYY')}
                                            </Tag>
                                        ))
                                    } else {
                                        return matching.dateValue ? (
                                            <Tag color="purple" bordered={false}>
                                                {dayjs(matching.dateValue).format('DD MMM YYYY')}
                                            </Tag>
                                        ) : null
                                    }
                                }

                                case ContainerFieldType.LOCATION:
                                case ContainerFieldType.LINK: {
                                    if (field.multiple) {
                                        return null
                                    } else {
                                        return null
                                    }
                                }
                            }
                        },
                    }))}
                    dataSource={[record]}
                />
            )}
            name="contents"
            columns={columns}
            request={getContents}
        />
    )
}

export default Contents
