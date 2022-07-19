import { useState } from 'react'
// import type { Page } from '@prisma/client'
import { Space, Table, Badge, TableColumnsType, Select } from 'antd'
// import Link from 'next/link'
// import moment from 'moment'
import type { Form } from '@prisma/client'
import { useQuery, UseQueryResult, useQueryClient } from 'react-query'
import get from 'lodash.get'

import moment from 'moment'
import Head from 'next/head'
import CustomSelect from '../../components/CustomSelect'
import { getMessages, readMessage } from '../../network/messages'
import { FullMessage } from '@types'
import { MESSAGE_PAGE_SIZE } from '../../utils/contants'

const AdminImages = () => {
    const queryClient = useQueryClient()
    const [page, setPage] = useState<number>(0)
    const [formId, setFormId] = useState<string | undefined>()
    const [read, setRead] = useState<boolean | undefined>()
    const queryKeys = ['messages', { page, formId, read }]
    const messages: UseQueryResult<FullMessage[], Error> = useQuery<FullMessage[], Error>(
        queryKeys,
        () => getMessages(page, formId, read),
        {
            keepPreviousData: true,
        }
    )

    return (
        <>
            <Head>
                <title>Admin - Images</title>
            </Head>

            <Space
                direction="vertical"
                size="middle"
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: '#f0f2f5',
                    minHeight: 'calc(100vh - 29px)',
                }}
            >
                <Space>
                    <CustomSelect.ListForms width={180} value={formId} onChange={setFormId} />
                    <Select
                        placeholder="Read/Unread"
                        allowClear
                        value={read}
                        onChange={setRead}
                        style={{ width: 180 }}
                    >
                        <Select.Option value={true}>Read</Select.Option>
                        <Select.Option value={false}>Unread</Select.Option>
                    </Select>
                </Space>

                <Table
                    rowKey={(record) => record.id}
                    bordered={false}
                    loading={messages.isLoading}
                    dataSource={get(messages, 'data.messages', [])}
                    columns={columns}
                    size="small"
                    scroll={{ y: 'calc(100vh - 205px)' }}
                    expandable={{
                        expandedRowRender: (message: FullMessage) => {
                            const values = JSON.parse(message.value)

                            // return (
                            //     <Descriptions
                            //         bordered
                            //         size="small"
                            //         layout="vertical"
                            //         title={get(message, 'form.title', '')}
                            //         contentStyle={{ backgroundColor: 'white' }}
                            //         // size={size}
                            //     >
                            //         {message.form?.fields?.map((field, idx) => {
                            //             if (field.type !== 'submit') {
                            //                 return (
                            //                     // <Space>
                            //                     //     <Text strong>{`${field.label} :`}</Text>
                            //                     //     <Text>
                            //                     //         {get(values, field.name || '', '')}
                            //                     //     </Text>
                            //                     // </Space>
                            //                     <Descriptions.Item
                            //                         key={idx}
                            //                         label={field.label}
                            //                     >
                            //                         {get(values, field.name || '', '')}
                            //                     </Descriptions.Item>
                            //                 )
                            //             }

                            //             return null
                            //         })}
                            //     </Descriptions>
                            // )

                            const cols: TableColumnsType<any> | undefined = []

                            message.form?.fields?.forEach((field, idx) =>
                                field.type === 'submit'
                                    ? null
                                    : cols.push({
                                          title: field.label,
                                          dataIndex: field.name || '',
                                      })
                            )

                            console.log([values])

                            return (
                                <>
                                    <Table
                                        columns={cols}
                                        bordered
                                        dataSource={[values]}
                                        pagination={false}
                                    />
                                </>
                            )
                        },
                        onExpand: (expanded: boolean, message: FullMessage) => {
                            console.log(expanded, message.read)
                            if (message.read || !expanded) return

                            readMessage(message.id)
                            queryClient.setQueryData(queryKeys, (oldData: any) => {
                                const index = oldData.messages.findIndex(
                                    (e: FullMessage) => e.id === message.id
                                )

                                if (index !== -1) oldData.messages[index].read = true

                                return oldData
                            })
                        },
                    }}
                    pagination={{
                        //     hideOnSinglePage: true,
                        current: page + 1,
                        onChange: (page: number) => setPage(page - 1),
                        pageSize: MESSAGE_PAGE_SIZE,
                        total: get(messages, 'data.count', 0),
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
        title: 'Submitted',
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
