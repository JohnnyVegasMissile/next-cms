'use client'

import { Badge, Button, Descriptions, Modal, Popconfirm, Space, Spin, Tooltip, Typography } from 'antd'
import { DeleteOutlined, ReadOutlined, PushpinFilled, PushpinOutlined, StopOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { Form, FormField, FormFieldType, Message, User } from '@prisma/client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import AdminTable from '~/components/AdminTable'
import { getMessage, getMessages, markMessage } from '~/network/messages'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getFormsSimple } from '~/network/forms'

dayjs.extend(relativeTime)

const { Text } = Typography

type DataType = Message & { form: Form; readBy: User }

const columns: ColumnsType<DataType> = [
    {
        sorter: true,
        title: 'Form',
        key: 'form',
        render: (message: DataType) =>
            !message.read ? <Badge status="warning" text={message.form.name} /> : message.form.name,
    },
    {
        sorter: true,
        title: 'Sent at',
        key: 'createdAt',
        render: (message: DataType) => dayjs(message.createdAt).fromNow(),
    },
    {
        sorter: true,
        title: 'Read by',
        key: 'readById',
        render: (message: DataType) => message.readBy?.name,
    },
    {
        width: 1,
        key: 'action',
        render: (message: DataType) => (
            <Space>
                <MarkButton message={message} />
                <ReadModal message={message} />
                <Popconfirm
                    placement="left"
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    // onConfirm={(e) => e?.stopPropagation()}
                    // onCancel={(e) => e?.stopPropagation()}
                    okText="Delete"
                    cancelText="Cancel"
                    disabled={false}
                >
                    <Tooltip title="Delete">
                        <Button disabled={false} type="primary" danger icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Tooltip>
                </Popconfirm>
            </Space>
        ),
    },
]

const Pages = () => {
    return (
        <AdminTable
            noQ
            name="messages"
            columns={columns}
            request={getMessages}
            filters={[
                {
                    type: 'select',
                    key: 'formId',
                    placeholder: 'Form',
                    name: 'forms-simple',
                    request: () => getFormsSimple(undefined, false),
                },
                {
                    type: 'select',
                    key: 'read',
                    placeholder: 'Read / Unread',
                    default: 'false',
                    options: [
                        { label: 'Read', value: 'true' },
                        { label: 'Not read', value: 'false' },
                    ],
                },
                {
                    type: 'select',
                    key: 'marked',
                    placeholder: 'Marked / Not Marked',
                    options: [
                        { label: 'Marked', value: 'true' },
                        { label: 'Not Marked', value: 'false' },
                    ],
                },
            ]}
        />
    )
}

export const dynamic = 'force-dynamic'
export default Pages

const ReadModal = ({ message }: { message: DataType }) => {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    const { data, isFetching } = useQuery(['message', { id: message.id }], () => getMessage(message.id), {
        enabled: open,
        onSuccess: () => {
            if (!message.read) {
                queryClient.invalidateQueries(['messages-unread'])
                queryClient.invalidateQueries(['messages'])
            }
        },
    })

    return (
        <>
            <Modal
                centered
                open={open}
                // title={message.form.name}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={1000}
                footer={null}
            >
                <div style={{ minHeight: 250, paddingTop: 24 }}>
                    {isFetching ? (
                        <div
                            style={{
                                width: '100%',
                                height: 250,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Spin />
                        </div>
                    ) : (
                        <Descriptions
                            layout="vertical"
                            title={message.form.name}
                            bordered
                            size="small"
                            extra={
                                data?.readBy?.name && (
                                    <Space>
                                        <Text>{'Read by: '}</Text>
                                        <Text type="secondary">{data?.readBy?.name}</Text>
                                    </Space>
                                )
                            }
                        >
                            {data?.form.fields
                                .filter(
                                    (e) => e.type !== FormFieldType.TITLE && e.type !== FormFieldType.BUTTON
                                )
                                .map((field: FormField) => {
                                    const matching = data?.fields.find((f) => f.formFieldId === field.id)
                                    let value = ''

                                    switch (field.type) {
                                        case FormFieldType.NUMBER:
                                            value = `${matching?.valueNumber || ''}`
                                            break
                                        case FormFieldType.MULTICHECKBOX:
                                            value = (matching?.valueMultiple as any[])?.join(', ')
                                            break
                                        case FormFieldType.CHECKBOX:
                                            value = matching?.valueBoolean === true ? 'Yes' : 'No'
                                            break

                                        default:
                                            value = `${matching?.valueText || ''}`
                                            break
                                    }

                                    return (
                                        <Descriptions.Item key={field.id} label={field.label}>
                                            {!!value ? (
                                                value
                                            ) : (
                                                <Text type="secondary">
                                                    <StopOutlined />
                                                </Text>
                                            )}
                                        </Descriptions.Item>
                                    )
                                })}
                        </Descriptions>
                    )}
                </div>
            </Modal>

            <Tooltip title="Duplicate">
                <Button
                    type="primary"
                    icon={<ReadOutlined />}
                    size="small"
                    onClick={() => setOpen((e) => !e)}
                >
                    Read
                </Button>
            </Tooltip>
        </>
    )
}

const MarkButton = ({ message }: { message: DataType }) => {
    const queryClient = useQueryClient()
    const mutation = useMutation(() => markMessage(message.id, !message.marked), {
        onSuccess: () => queryClient.invalidateQueries(['messages']),
    })

    return (
        <Button
            danger
            loading={mutation.isLoading}
            disabled={false}
            onClick={() => mutation.mutate()}
            style={message.marked ? { backgroundColor: '#faad14' } : { color: '#faad14' }}
            type={message.marked ? 'primary' : 'link'}
            icon={message.marked ? <PushpinFilled /> : <PushpinOutlined />}
            size="small"
        />
    )
}
