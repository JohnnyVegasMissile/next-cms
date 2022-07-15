import { useState } from 'react'
// import type { Page } from '@prisma/client'
import { Space, Button, Image, Input, Table, Popconfirm, Badge, Typography } from 'antd'
// import Link from 'next/link'
// import moment from 'moment'
import type { Media, Message, Form } from '@prisma/client'
import { useQuery, UseQueryResult, useQueryClient } from 'react-query'
import get from 'lodash.get'
import trim from 'lodash.trim'

import UploadButton from '../../components/UploadButton'
import { getImages, deleteImage } from '../../network/images'
import moment from 'moment'
import useDebounce from '../../hooks/useDebounce'
import Head from 'next/head'
import Link from 'next/link'
import CustomSelect from '../../components/CustomSelect'
import { getMessages, readMessage } from '../../network/messages'
import { FullMessage } from '@types'

const { Text } = Typography

const AdminImages = () => {
    const queryClient = useQueryClient()
    const [formId, setFormId] = useState<string | undefined>()
    const queryKeys = ['messages', { formId }]
    const messages: UseQueryResult<FullMessage[], Error> = useQuery<FullMessage[], Error>(
        queryKeys,
        () => getMessages(),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <>
            <Head>
                <title>Admin - Images</title>
            </Head>

            <Space
                direction="vertical"
                size="large"
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: '#f0f2f5',
                    minHeight: 'calc(100vh - 29px)',
                }}
            >
                <CustomSelect.ListForms width={180} value={formId} onChange={setFormId} />
                <Table
                    rowKey={(record) => record.id}
                    bordered={false}
                    loading={messages.isLoading}
                    dataSource={get(messages, 'data', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 160px)' }}
                    expandable={{
                        expandedRowRender: (message: FullMessage) => {
                            const values = JSON.parse(message.value)

                            return (
                                <Space direction="vertical" style={{ padding: 12 }}>
                                    {message.form?.fields?.map((field) => {
                                        if (field.type !== 'submit') {
                                            return (
                                                <Space>
                                                    <Text strong>{`${field.label} :`}</Text>
                                                    <Text>
                                                        {get(values, field.name || '', '')}
                                                    </Text>
                                                </Space>
                                            )
                                        }

                                        return null
                                    })}
                                </Space>
                            )
                        },
                        onExpand: (expanded: boolean, message: FullMessage) => {
                            console.log(expanded, message.read)
                            if (message.read || !expanded) return

                            readMessage(message.id)
                            queryClient.setQueryData(queryKeys, (oldData: any) => {
                                const index = oldData.findIndex(
                                    (e: FullMessage) => e.id === message.id
                                )

                                if (index !== -1) oldData[index].read = true

                                return oldData
                            })
                        },
                    }}
                    pagination={{
                        hideOnSinglePage: true,
                        pageSize: get(messages, 'data', []).length,
                    }}
                />
            </Space>
        </>
    )
}

const columns = [
    {
        title: 'Form',
        key: 'formId',
        dataIndex: 'form',
        render: (form: Form) => form.title,
    },
    {
        title: 'Form',
        key: 'createdAt',
        dataIndex: 'createdAt',
        render: (createdAt: Date) => moment(createdAt).fromNow(),
    },
    {
        width: 150,
        title: 'Read',
        // dataIndex: 'read',
        key: 'read',
        render: (message: FullMessage) => (
            <Badge
                status={message.read ? 'success' : 'error'}
                text={message.read ? 'Read' : 'Unread'}
            />
        ),
    },
]

AdminImages.requireAuth = true

export default AdminImages
