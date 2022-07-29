import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { Input, Space, Button, Typography, Card, message, Spin, InputNumber, Radio, DatePicker, Divider } from 'antd'
import get from 'lodash.get'
import { editContent, getContentDetails, postContent } from '../../../network/contents'
import { getContainerDetails } from '../../../network/containers'
import { Prisma, Content, ContainerField, ContentField } from '@prisma/client'
import { useMutation, useQuery, UseQueryResult, useQueryClient } from 'react-query'
import Head from 'next/head'
import { FullContainerEdit, FullSectionEdit } from '@types'
import CustomSelect from '@components/CustomSelect'
import LinkInput from '@components/LinkInput'
import MediaModal from '@components/MediaModal'
import SectionManager from '@components/SectionManager'
import set from 'lodash.set'
import AccessCheckboxes from '@components/AccessCheckboxes'

const { Text } = Typography

type MyType = any

const initialValues: MyType = {}

const validate = (values: MyType) => {
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

    const { values, /*errors,*/ handleSubmit, handleChange, setValues } = useFormik<MyType>({
        initialValues,
        validate,
        onSubmit: async (values) => {
            const fields = Object.keys(values.fieldsValue).map((key: string) => ({
                name: key,
                ...values.fieldsValue[key],
            }))
            delete values.fieldsValue

            const slug = encodeURI(get(values, 'slug', ''))

            mutation.mutate({ pid: pid as string, values: { ...values, fields, slug } })
        },
    })

    const content: UseQueryResult<MyType, Error> = useQuery<MyType, Error>(
        ['contents', { id: pid }],
        () => getContentDetails(pid as string),
        {
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: FullContainerEdit) => {
                const sections = get(data, 'sections', []).sort((a, b) => a.position - b.position)

                const slug = decodeURI(get(data, 'slug', '') || '')

                setValues({ ...data, sections, slug })
            },
            onError: (err) => router.push('/admin/contents'),
        }
    )

    const container: UseQueryResult<FullContainerEdit, Error> = useQuery<FullContainerEdit, Error>(
        ['containers', { id: values.containerId }],
        () => getContainerDetails(values.containerId as string),
        {
            enabled: !!values.containerId,
            onSuccess: (data: FullContainerEdit) => {
                let fieldsValue = {}

                for (const field of get(data, 'fields', [])) {
                    const value: ContentField | undefined = get(content, 'data.fields', []).find(
                        (e: ContentField) => e.name === field.name
                    )

                    if (!!value) {
                        const newValue = {
                            type: value.type,
                            mediaId: value.mediaId || undefined,
                            textValue: value.textValue || undefined,
                            numberValue: !!value.numberValue || value.numberValue === 0 ? value.numberValue : undefined,
                            boolValue: value.boolValue || undefined,
                            dateValue: value.dateValue || undefined,
                        }

                        set(fieldsValue, field.name, newValue)
                    }
                }

                onHandleChange('fieldsValue', fieldsValue)
            },
        }
    )

    const mutation = useMutation(
        (data: { pid: string; values: Prisma.ContentCreateInput }) =>
            data.pid === 'create' ? postContent(data.values) : editContent(data.pid, data.values),
        {
            onSuccess: (data: Content) => {
                message.success(`Content ${data.title} saved`)
                queryClient.invalidateQueries('contents')
                router.push('/admin/contents')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the content')
                queryClient.invalidateQueries('contents')
                router.push('/admin/contents')
            },
        }
    )

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (content.isLoading || !pid) {
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
                <title>Admin - Contents</title>
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
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card title="Description">
                            <Space direction="vertical">
                                <Space size="large">
                                    <Space direction="vertical">
                                        <Text>Title</Text>
                                        <Input
                                            style={{ width: 240 }}
                                            value={get(values, 'title', '')}
                                            onChange={(e) => onHandleChange('title', e.target.value)}
                                        />
                                    </Space>

                                    <Space direction="vertical">
                                        <Text>Slug</Text>
                                        <Input
                                            style={{ width: 240 }}
                                            value={get(values, 'slug', '')}
                                            onChange={(e) => onHandleChange('slug', e.target.value)}
                                        />
                                    </Space>

                                    <Space direction="vertical">
                                        <Text>Status</Text>
                                        <Radio.Group
                                            id="status"
                                            value={values.published}
                                            onChange={(e) => onHandleChange('published', e.target.value)}
                                        >
                                            <Radio value={true}>Published</Radio>
                                            <Radio value={false}>Unpublished</Radio>
                                        </Radio.Group>
                                    </Space>

                                    <Space direction="vertical">
                                        <Text>Access</Text>
                                        <AccessCheckboxes
                                            value={values.accesses || []}
                                            onChange={(e) => onHandleChange('accesses', e)}
                                        />
                                    </Space>
                                </Space>

                                <Space size="large">
                                    <Space direction="vertical">
                                        <Text>Container</Text>
                                        <CustomSelect.ListContainers
                                            disabled={!pid || pid !== 'create'}
                                            value={values.containerId}
                                            onChange={(e) => onHandleChange('containerId', e)}
                                        />
                                    </Space>
                                </Space>
                            </Space>
                        </Card>

                        {!!values.containerId && !container.isLoading && (
                            <>
                                {!!container?.data?.fields?.length && (
                                    <Card title="Fields" style={{ flex: 1 }}>
                                        <ContentFieldsManager
                                            values={get(values, 'fieldsValue', {})}
                                            fields={get(container, 'data.fields', [])}
                                            onChange={(e) => onHandleChange('fieldsValue', e)}
                                        />
                                    </Card>
                                )}

                                {!container?.data?.contentHasSections && (
                                    <>
                                        <Divider orientation="left">Layout</Divider>

                                        <SectionManager
                                            values={get(values, 'sections', []) as FullSectionEdit[]}
                                            onChange={(e) => onHandleChange('sections', e)}
                                        />
                                    </>
                                )}
                            </>
                        )}

                        <Button loading={mutation.isLoading} type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Space>
                </Space>
            </form>
        </>
    )
}

interface ContentFieldsManagerProps {
    values: {}
    onChange: (e: {}) => void
    fields: ContainerField[]
}

const ContentFieldsManager = ({ values, fields, onChange }: ContentFieldsManagerProps) => {
    console.log('val', values)
    const onHandleChange = (name: string, type: string, value: any) => {
        const newValue = { ...values }
        let field = 'textValue'

        switch (type) {
            case 'string':
            case 'text':
            case 'link':
                field = 'textValue'
                break
            case 'int':
                field = 'numberValue'
                break
            case 'boolean':
                field = 'boolValue'
                break
            case 'date':
                field = 'dateValue'
                break
            case 'image':
            case 'file':
                field = 'mediaId'
                break
        }

        set(newValue, name, { type, [field]: value })

        onChange(newValue)
    }

    return (
        <Space direction="vertical">
            {fields.map((field, idx) => {
                switch (field.type) {
                    case 'string':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>
                                    {field.label} ({field.type})
                                </Text>
                                <Input
                                    style={{ width: 480 }}
                                    value={get(values, `${field.name}.textValue`, '')}
                                    onChange={(e) => onHandleChange(field.name, field.type, e.target.value)}
                                />
                            </Space>
                        )
                    case 'text':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>
                                    {field.label} ({field.type})
                                </Text>
                                <Input.TextArea
                                    style={{ width: 480 }}
                                    value={get(values, `${field.name}.textValue`, '')}
                                    onChange={(e) => onHandleChange(field.name, field.type, e.target.value)}
                                />
                            </Space>
                        )
                    case 'int':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>
                                    {field.label} ({field.type})
                                </Text>
                                <InputNumber
                                    style={{ width: 480 }}
                                    value={get(values, `${field.name}.intValue`, undefined)}
                                    onChange={(e) => onHandleChange(field.name, field.type, e)}
                                />
                            </Space>
                        )
                    case 'boolean':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>
                                    {field.label} ({field.type})
                                </Text>
                                <Radio.Group
                                    value={get(values, `${field.name}.boolValue`, undefined)}
                                    onChange={(e) => onHandleChange(field.name, field.type, e.target.value)}
                                >
                                    <Radio value={true}>True</Radio>
                                    <Radio value={false}>False</Radio>
                                </Radio.Group>
                            </Space>
                        )
                    case 'date':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>
                                    {field.label} ({field.type})
                                </Text>
                                <DatePicker
                                    style={{ width: 480 }}
                                    value={get(values, `${field.name}.dateValue`, undefined)}
                                    onChange={(e) => onHandleChange(field.name, field.type, e)}
                                />
                            </Space>
                        )
                    case 'image':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>
                                    {field.label} ({field.type})
                                </Text>
                                <MediaModal
                                    value={get(values, `${field.name}.mediaId`, '')}
                                    onMediaSelected={(e) => onHandleChange(field.name, field.type, e?.id)}
                                />
                            </Space>
                        )
                    case 'link':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>
                                    {field.label} ({field.type})
                                </Text>
                                <LinkInput
                                    width={480}
                                    value={get(values, `${field.name}.textValue`, '')}
                                    onChange={(e) => onHandleChange(field.name, field.type, e)}
                                />
                            </Space>
                        )

                    default:
                        return null
                }
            })}
        </Space>
    )
}

Admin.requireAuth = true

export default Admin
