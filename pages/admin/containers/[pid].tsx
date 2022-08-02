import { Fragment } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { Input, Space, Button, Typography, Card, Select, message, Spin, Tabs, Radio, Divider, Switch } from 'antd'
import Head from 'next/head'
import get from 'lodash.get'
import set from 'lodash.set'
import kebabcase from 'lodash.kebabcase'
import { ContainerField } from '@prisma/client'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useMutation, useQuery, UseQueryResult, useQueryClient } from 'react-query'

import SectionManager from '../../../components/SectionManager'
import AccessCheckboxes from '../../../components/AccessCheckboxes'
import { FullContainerEdit, FullSection, FullSectionEdit } from '../../../types'
import { editContainer, getContainerDetails, postContainer } from '../../../network/containers'
import camelcase from 'lodash.camelcase'

const { Text, Title } = Typography
const { TabPane } = Tabs

const initialValues: FullContainerEdit = { title: '', contentHasSections: false, slugEdit: [''] }

const validate = (values: FullContainerEdit) => {
    let errors: any = {}

    // if (!values.title) {
    //     errors.title = 'Required'
    // }

    // const splittedSlug = values.slug.split('/')
    // for (const slug of splittedSlug) {
    //     if (!slug) {
    //         errors.slug = 'Forbiden slug'
    //         break
    //     }
    // }

    // if (!values.slug) {
    //     errors.slug = 'Required'
    // }

    return errors
}

const Admin = () => {
    const router = useRouter()
    const { pid } = router.query
    const queryClient = useQueryClient()

    const { values, errors, handleSubmit, handleChange, setValues } = useFormik<FullContainerEdit>({
        initialValues,
        validate,
        onSubmit: async (values) => {
            let i = 0
            const sections: FullSection[] = []

            if (!!values.sections) {
                for (const section of values.sections) {
                    if (!!section.block || !!section.elementId) {
                        sections.push({
                            ...section,
                            position: i,
                        })

                        i = i + 1
                    }
                }
            }

            i = 0
            const contentSections: FullSection[] = []

            if (!!values.contentSections) {
                for (const section of values.contentSections) {
                    if (!!section.block || !!section.elementId) {
                        contentSections.push({
                            ...section,
                            position: i,
                        })

                        i = i + 1
                    }
                }
            }

            mutation.mutate({
                pid: pid as string,
                values: { ...values, sections, contentSections },
            })
        },
    })

    const container: UseQueryResult<FullContainerEdit, Error> = useQuery<FullContainerEdit, Error>(
        ['containers', { id: pid }],
        () => getContainerDetails(pid as string),
        {
            enabled: !!pid && pid !== 'create',
            // onSuccess: (data: FullContainerEdit) => setValues(data),

            onSuccess: (data: FullContainerEdit) => {
                const sections = get(data, 'sections', []).sort((a, b) => a.position - b.position)

                const contentSections = get(data, 'contentSections', []).sort((a, b) => a.position - b.position)

                const accesses = get(data, 'accesses', []).map((access) => get(access, 'roleId', ''))

                const slug = decodeURI(get(data, 'slug.0.slug', '') || '')
                const slugEdit = slug.split('/')

                setValues({ ...data, sections, contentSections, accesses, slugEdit })
            },
            onError: (err) => router.push('/admin/containers'),
        }
    )

    const mutation = useMutation(
        (data: { pid: string; values: FullContainerEdit }) =>
            data.pid === 'create' ? postContainer(data.values) : editContainer(data.pid, data.values),
        {
            onSuccess: (data: any) => {
                message.success(`Element ${data.title} saved`)
                queryClient.invalidateQueries('containers')
                // router.push('/admin/containers')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the container')
                queryClient.invalidateQueries('containers')
                // router.push('/admin/containers')
            },
        }
    )

    const isDefaultPage = values.id === 'page'

    const lastSlugIndex = get(values, 'slugEdit', []).length - 1

    const addSlug = () => {
        let newValue = [...get(values, 'slugEdit', [])]
        newValue.splice(lastSlugIndex, 0, '')

        onHandleChange('slugEdit', newValue)
    }

    const removeSlug = () => {
        let newValue = [...get(values, 'slugEdit', [])]
        newValue.splice(lastSlugIndex - 1, 1)

        onHandleChange('slugEdit', newValue)
    }

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (container.isLoading || !pid) {
        return (
            <div
                style={{
                    height: 'calc(100vh - 29px)',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f2f5',
                }}
            >
                <Spin size="large" tip="Loading..." />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Admin - Elements</title>
            </Head>

            <form onSubmit={handleSubmit}>
                <Space
                    direction="vertical"
                    size="large"
                    style={{
                        width: '100%',
                        minHeight: 'calc(100vh - 29px)',
                        padding: 15,
                        backgroundColor: '#f0f2f5',
                    }}
                >
                    <div className="admin-card-container">
                        <Tabs type="card">
                            <TabPane tab="Container" key="1">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Card title="Description">
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Space size="large">
                                                <Space direction="vertical">
                                                    <Text>Title :</Text>
                                                    <Input
                                                        id="title"
                                                        disabled={isDefaultPage}
                                                        style={{ width: 240 }}
                                                        value={values.title}
                                                        onChange={(e) => {
                                                            onHandleChange('title', e.target.value)

                                                            if (pid === 'create') {
                                                                onHandleChange(
                                                                    `slugEdit.${lastSlugIndex}`,
                                                                    kebabcase(e.target.value)
                                                                )
                                                            }
                                                        }}
                                                    />
                                                </Space>

                                                <Space direction="vertical">
                                                    <Text>Status</Text>
                                                    <Radio.Group
                                                        id="status"
                                                        disabled={isDefaultPage}
                                                        value={values.published}
                                                        onChange={(e) => onHandleChange('published', e.target.value)}
                                                    >
                                                        <Radio value={true}>Published</Radio>
                                                        <Radio value={false}>Unpublished</Radio>
                                                    </Radio.Group>
                                                </Space>

                                                {!isDefaultPage && (
                                                    <Space direction="vertical">
                                                        <Text>Access</Text>
                                                        <AccessCheckboxes
                                                            value={values.accesses || []}
                                                            onChange={(e) => onHandleChange('accesses', e)}
                                                        />
                                                    </Space>
                                                )}
                                            </Space>

                                            {!isDefaultPage && (
                                                <>
                                                    <Divider />
                                                    <Title level={5}>Page URL</Title>
                                                    <Space style={{ width: '100%' }}>
                                                        {get(values, 'slugEdit', []).map((slug, idx) => (
                                                            <Fragment key={idx}>
                                                                {idx === lastSlugIndex && (
                                                                    <>
                                                                        <Button
                                                                            id="slug-minus"
                                                                            onClick={removeSlug}
                                                                            type="primary"
                                                                            // shape="circle"
                                                                            danger
                                                                            disabled={
                                                                                get(values, 'slugEdit', []).length < 2
                                                                            }
                                                                            icon={<MinusOutlined />}
                                                                        />
                                                                        <Button
                                                                            id="slug-plus"
                                                                            onClick={addSlug}
                                                                            disabled={
                                                                                get(values, 'slugEdit', []).length > 5
                                                                            }
                                                                            type="primary"
                                                                            // shape="circle"
                                                                            icon={<PlusOutlined />}
                                                                        />
                                                                    </>
                                                                )}
                                                                <Input
                                                                    id={`slug-${idx}`}
                                                                    style={{
                                                                        minWidth: 200,
                                                                    }}
                                                                    value={slug}
                                                                    onChange={(e) =>
                                                                        onHandleChange(
                                                                            `slugEdit.${idx}`,
                                                                            kebabcase(e.target.value)
                                                                        )
                                                                    }
                                                                    status={errors.slug ? 'error' : undefined}
                                                                />
                                                                {lastSlugIndex !== idx && '/'}
                                                            </Fragment>
                                                        ))}
                                                    </Space>
                                                </>
                                            )}
                                        </Space>
                                    </Card>

                                    <MetadatasManager
                                        values={get(values, 'metadatas', [])}
                                        onChange={(e) => onHandleChange('metadatas', e)}
                                    />

                                    <Divider orientation="left">Container Layout</Divider>

                                    <SectionManager
                                        values={get(values, 'sections', []) as FullSectionEdit[]}
                                        onChange={(e) => onHandleChange('sections', e)}
                                    />
                                </Space>
                            </TabPane>
                            <TabPane tab="Contents" key="2" disabled={isDefaultPage}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <FieldsManager
                                        values={get(values, 'fields', [])}
                                        onChange={(e) => onHandleChange('fields', e)}
                                    />

                                    <Divider orientation="left">
                                        <Space size="middle">
                                            Contents Layout
                                            <Switch
                                                checked={values.contentHasSections}
                                                onChange={(checked: boolean) =>
                                                    onHandleChange('contentHasSections', checked)
                                                }
                                            />
                                        </Space>
                                    </Divider>
                                    {!!values.contentHasSections && (
                                        <SectionManager
                                            values={get(values, 'contentSections', []) as FullSectionEdit[]}
                                            onChange={(e) => onHandleChange('contentSections', e)}
                                        />
                                    )}
                                </Space>
                            </TabPane>
                        </Tabs>
                    </div>

                    <Button loading={mutation.isLoading} type="primary" htmlType="submit">
                        Save
                    </Button>
                </Space>
            </form>
        </>
    )
}

interface MetadatasManagerProps {
    values: { name: string; content?: string; field?: string }[]
    onChange(e: { name: string; content?: string; field?: string }[]): void
}

const MetadatasManager = ({ values, onChange }: MetadatasManagerProps) => {
    const addMetadata = () => {
        onChange([...values, { name: '' }])
    }

    const removeMetadata = (index: number) => {
        let newValue = [...values]
        newValue.splice(index, 1)

        onChange(newValue)
    }

    const modifyMetadata = (index: number, key: string, value: any) => {
        let newValue = [...values]
        set(newValue, `${index}.${key}`, value)

        onChange(newValue)
    }

    return (
        <Card title="Metadatas">
            <Space direction="vertical">
                {values.map((metadata: any, idx: number) => (
                    <Space key={idx} align="end">
                        <Space direction="vertical">
                            <Text>Name</Text>
                            <Select
                                id={`meta-name-${idx}`}
                                style={{ width: 240 }}
                                value={metadata.name}
                                onChange={(e) => modifyMetadata(idx, 'name', e)}
                            >
                                <Select.Option value="application-name">Application name</Select.Option>
                                <Select.Option value="author">Author</Select.Option>
                                <Select.Option value="description">Description</Select.Option>
                                <Select.Option value="generator">Generator</Select.Option>
                                <Select.Option value="keywords">Keywords</Select.Option>
                                <Select.Option value="viewport">Viewport</Select.Option>
                            </Select>
                        </Space>

                        <Space direction="vertical">
                            <Text>Content</Text>
                            <Input
                                id={`meta-content-${idx}`}
                                style={{ width: 240 }}
                                value={metadata.content}
                                onChange={(e) => modifyMetadata(idx, 'content', e.target.value)}
                            />
                        </Space>

                        <Button
                            id={`meta-minus-${idx}`}
                            onClick={() => removeMetadata(idx)}
                            type="primary"
                            // shape="circle"
                            danger
                            icon={<MinusOutlined />}
                        />
                    </Space>
                ))}
                <Button
                    id={'meta-plus'}
                    onClick={addMetadata}
                    type="primary"
                    // shape="circle"
                    icon={<PlusOutlined />}
                />
            </Space>
        </Card>
    )
}

interface FieldsManagerProps {
    values: any[]
    onChange(e: any[]): void
}

const FieldsManager = ({ values, onChange }: FieldsManagerProps) => {
    const addField = () => {
        onChange([...values, { name: '' }])
    }

    const removeField = (index: number) => {
        let newValue = [...values]
        newValue.splice(index, 1)

        onChange(newValue)
    }

    const modifyField = (index: number, key: string, value: any) => {
        let newValue = [...values]
        set(newValue, `${index}.${key}`, value)

        onChange(newValue)
    }

    return (
        <Card title="Fields">
            <Space direction="vertical">
                {values.map((field: any, idx: number) => (
                    <Space key={idx} align="end">
                        <Space direction="vertical">
                            <Text>Label</Text>
                            <Input
                                id={`field-label-${idx}`}
                                style={{ width: 240 }}
                                value={field.label}
                                onChange={(e) => modifyField(idx, 'label', e.target.value)}
                            />
                        </Space>

                        <Space direction="vertical">
                            <Text>Name</Text>
                            <Input
                                id={`field-name-${idx}`}
                                style={{ width: 240 }}
                                value={field.name}
                                onChange={(e) => modifyField(idx, 'name', camelcase(e.target.value))}
                            />
                        </Space>

                        <Space direction="vertical">
                            <Text>Type</Text>
                            <Select
                                id={`field-type-${idx}`}
                                style={{ width: 240 }}
                                value={field.type}
                                onChange={(e) => modifyField(idx, 'type', e)}
                            >
                                <Select.Option value="string">Text</Select.Option>
                                <Select.Option value="text">Paragraph</Select.Option>
                                <Select.Option value="int">Number</Select.Option>
                                <Select.Option value="boolean">Boolean</Select.Option>
                                <Select.Option value="date">Date</Select.Option>
                                <Select.Option value="image">Image</Select.Option>
                                <Select.Option value="file" disabled>
                                    File
                                </Select.Option>
                                <Select.Option value="link">Link</Select.Option>
                                <Select.Option value="wysiwyg" disabled>
                                    Wysiwyg
                                </Select.Option>
                                <Select.Option value="list" disabled>
                                    List
                                </Select.Option>
                            </Select>
                        </Space>

                        <Space direction="vertical">
                            <Text>Required</Text>
                            <Radio.Group
                                style={{
                                    height: 32,
                                    alignItems: 'center',
                                    display: 'flex',
                                }}
                                id={`required-${idx}`}
                                value={field.required}
                                onChange={(e) => modifyField(idx, 'required', e.target.value)}
                            >
                                <Radio value={true}>Required</Radio>
                                <Radio value={false}>Not Required</Radio>
                            </Radio.Group>
                        </Space>

                        <Space direction="vertical">
                            <Text>Metadata</Text>
                            <Select
                                allowClear
                                id={`meta-name-${idx}`}
                                style={{ width: 240 }}
                                value={field.metadata}
                                onChange={(e) => modifyField(idx, 'metadata', e)}
                            >
                                <Select.Option value="application-name">Application name</Select.Option>
                                <Select.Option value="author">Author</Select.Option>
                                <Select.Option value="description">Description</Select.Option>
                                <Select.Option value="generator">Generator</Select.Option>
                                <Select.Option value="keywords">Keywords</Select.Option>
                                <Select.Option value="viewport">Viewport</Select.Option>
                            </Select>
                        </Space>

                        <Button
                            id={`field-minus-${idx}`}
                            onClick={() => removeField(idx)}
                            type="primary"
                            danger
                            icon={<MinusOutlined />}
                        />
                    </Space>
                ))}
                <Button id={'field-plus'} onClick={addField} type="primary" icon={<PlusOutlined />} />
            </Space>
        </Card>
    )
}

Admin.requireAuth = true

export default Admin
