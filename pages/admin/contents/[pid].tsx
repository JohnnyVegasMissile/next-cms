import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import {
    Input,
    Space,
    Button,
    Typography,
    Card,
    message,
    Spin,
    InputNumber,
    Radio,
    DatePicker,
    Divider,
    Tag,
    Tooltip,
} from 'antd'
import get from 'lodash.get'
import { editContent, getContentDetails, postContent } from '../../../network/contents'
import { getContainerDetails } from '../../../network/containers'
import { Prisma, Content, ContainerField /*, ContentField*/, Media } from '@prisma/client'
import { useMutation, useQuery, UseQueryResult, useQueryClient } from 'react-query'
import Head from 'next/head'
import { FullContainerEdit, FullContentField, FullSectionEdit } from '@types'
import CustomSelect from '@components/CustomSelect'
import LinkInput from '@components/LinkInput'
import MediaModal from '@components/MediaModal'
import SectionManager from '@components/SectionManager'
import set from 'lodash.set'
import AccessCheckboxes from '@components/AccessCheckboxes'
import moment from 'moment'
import { useState } from 'react'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { SizeType } from 'antd/lib/config-provider/SizeContext'

const { Text } = Typography

type MyType = any

const initialValues: MyType = {
    published: true,
}

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
        initialValues: { ...initialValues, containerId: router.query.container },
        validate,
        onSubmit: async (values) => {
            const fields = Object.keys(values.fieldsValue).map((key: string) => ({
                name: key,
                ...values.fieldsValue[key],
                mediaId: get(values, `fieldsValue.${key}.media.id`, null),
                media: undefined,
            }))
            // delete values.fieldsValue

            console.log('fff', fields, values)
            return

            const slug = encodeURI(get(values, 'slug', ''))

            mutation.mutate({
                pid: pid as string,
                values: { ...values, fields, slug, fieldsValue: undefined },
            })
        },
    })

    const content: UseQueryResult<MyType, Error> = useQuery<MyType, Error>(
        ['contents', { id: pid }],
        () => getContentDetails(pid as string),
        {
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: FullContainerEdit) => {
                const sections = get(data, 'sections', []).sort((a, b) => a.position - b.position)

                const slug = decodeURI(get(data, 'slug.0.slug', '') || '')

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
                    const value: FullContentField | undefined = get(content, 'data.fields', []).find(
                        (e: FullContentField) => e.name === field.name
                    )

                    if (!!value) {
                        const newValue = {
                            type: value.type,
                            mediaId: value.mediaId || undefined,
                            media: value.media || undefined,
                            textValue: value.textValue || undefined,
                            numberValue:
                                !!value.numberValue || value.numberValue === 0
                                    ? value.numberValue
                                    : undefined,
                            boolValue: value.boolValue || undefined,
                            dateValue: moment(value.dateValue) || undefined,
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
                                        <Space>
                                            <Text>Access</Text>
                                            <Tooltip title="Select none to grand access to everybody. If all selected, not logged in users can't access it.">
                                                <QuestionCircleOutlined />
                                            </Tooltip>
                                        </Space>
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
                                            disabled={!pid || pid !== 'create' || values.containerId}
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
    const onHandleChange = (name: string, type: string, value: any, multi?: boolean) => {
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
                field = 'media'
                break
        }

        set(newValue, name, { type, [field]: value, multi: !!multi })

        onChange(newValue)
    }

    return (
        <Space direction="vertical">
            {fields.map((field, idx) => {
                switch (field.type) {
                    case 'string':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>{field.label}</Text>
                                {field.multiple ? (
                                    <MultipleInput
                                        value={get(values, `${field.name}.textValue`, '')}
                                        onChange={(e) => onHandleChange(field.name, field.type, e, true)}
                                    />
                                ) : (
                                    <Input
                                        style={{ width: 480 }}
                                        value={get(values, `${field.name}.textValue`, '')}
                                        onChange={(e) =>
                                            onHandleChange(field.name, field.type, e.target.value)
                                        }
                                    />
                                )}
                            </Space>
                        )
                    case 'text':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>{field.label}</Text>
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
                                <Text>{field.label}</Text>
                                {field.multiple ? (
                                    <MultipleInput
                                        type="number"
                                        value={get(values, `${field.name}.numberValue`, '')}
                                        onChange={(e) => onHandleChange(field.name, field.type, e, true)}
                                    />
                                ) : (
                                    <InputNumber
                                        style={{ width: 480 }}
                                        value={get(values, `${field.name}.numberValue`, undefined)}
                                        onChange={(e) => onHandleChange(field.name, field.type, e)}
                                    />
                                )}
                            </Space>
                        )
                    case 'boolean':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>{field.label}</Text>
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
                                <Text>{field.label}</Text>
                                {field.multiple ? (
                                    <MultipleInput
                                        type="date"
                                        value={get(values, `${field.name}.dateValue`, '')}
                                        onChange={(e) => onHandleChange(field.name, field.type, e, true)}
                                    />
                                ) : (
                                    <DatePicker
                                        style={{ width: 480 }}
                                        value={get(values, `${field.name}.dateValue`, undefined)}
                                        onChange={(e) => onHandleChange(field.name, field.type, e)}
                                    />
                                )}
                            </Space>
                        )
                    case 'image':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>{field.label}</Text>
                                {field.multiple ? (
                                    <MultipleImages
                                        value={get(values, `${field.name}.media`, [])}
                                        onChange={(e) => onHandleChange(field.name, field.type, e, true)}
                                    />
                                ) : (
                                    <MediaModal
                                        size="small"
                                        value={get(values, `${field.name}.media`, '')}
                                        onMediaSelected={(e) => onHandleChange(field.name, field.type, e)}
                                    />
                                )}
                            </Space>
                        )
                    case 'link':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>{field.label}</Text>
                                {field.multiple ? (
                                    <MultipleInput
                                        type="link"
                                        value={get(values, `${field.name}.textValue`, [])}
                                        onChange={(e) => onHandleChange(field.name, field.type, e, true)}
                                    />
                                ) : (
                                    <LinkInput
                                        width={480}
                                        value={get(values, `${field.name}.textValue`, '')}
                                        onChange={(e) => onHandleChange(field.name, field.type, e)}
                                    />
                                )}
                            </Space>
                        )

                    case 'content':
                        return (
                            <Space key={idx} direction="vertical">
                                <Text>{field.label}</Text>
                                {field.multiple ? (
                                    <CustomSelect.ListContents
                                        multi
                                        width={480}
                                        filterId={field.linkedContainerId || undefined}
                                        value={get(values, `${field.name}.textValue`, [])}
                                        onChange={(e) => onHandleChange(field.name, field.type, e, true)}
                                    />
                                ) : (
                                    <CustomSelect.ListContents
                                        width={480}
                                        filterId={field.linkedContainerId || undefined}
                                        value={get(values, `${field.name}.textValue`, '')}
                                        onChange={(e) => onHandleChange(field.name, field.type, e)}
                                    />
                                )}
                            </Space>
                        )

                    default:
                        return null
                }
            })}
        </Space>
    )
}

const MultipleImages = ({
    value,
    onChange,
}: {
    value: (Media | undefined)[]
    onChange(list: (Media | undefined)[]): void
}) => {
    return (
        <Space className="multiple-input" size="small" direction="vertical">
            {get(value, '', []).map((e: Media, idx: number) => (
                <MediaModal
                    key={idx}
                    size="small"
                    value={e}
                    onMediaSelected={(e) => {
                        if (!e) {
                            const newValues = [...value]
                            newValues.splice(idx, 1)
                            onChange(newValues)
                            return
                        }

                        const newValues = [...value]
                        newValues[idx] = e
                        onChange(newValues)
                    }}
                />
            ))}
            <div>
                <MediaModal
                    primary={false}
                    size="small"
                    label="Add new"
                    icon={<PlusOutlined />}
                    onMediaSelected={(e) => {
                        const newValues = [...value, e]
                        onChange(newValues)
                    }}
                />
            </div>
        </Space>
    )
}

const MultipleInput = ({
    value,
    onChange,
    type = 'string',
}: {
    value: any[]
    onChange(list: any[]): void
    type?: string
}) => {
    const [tempValue, setTempValue] = useState<any>()
    const [inputVisible, setInputVisible] = useState(false)

    const onEndEdit = () => {
        if (!!tempValue) {
            onChange([...value, tempValue])
            setTempValue(undefined)
            setInputVisible(false)
            return
        }

        setInputVisible(false)
    }

    const props = {
        autoFocus: true,
        allowClear: true,
        type: 'text',
        size: 'small' as SizeType,
        placeholder: '',
        value: tempValue,
        onBlur: onEndEdit,
        onPressEnter: onEndEdit,
    }

    return (
        <Space className="multiple-input" size="small">
            {get(value, '', []).map((value: any, idx: number) => (
                <UniqueInput
                    type={type}
                    key={idx}
                    value={value}
                    onChange={(e) => {
                        const newValues = [...value]
                        newValues[idx] = e
                        onChange(newValues)
                    }}
                    onClose={() => {
                        const newValues = [...value]
                        newValues.splice(idx, 1)
                        onChange(newValues)
                    }}
                />
            ))}
            {inputVisible ? (
                type === 'number' ? (
                    <InputNumber {...props} onChange={(e) => setTempValue(e)} />
                ) : type === 'date' ? (
                    <DatePicker {...props} format="DD/MM/YYYY" onChange={(e) => setTempValue(e)} />
                ) : type === 'link' ? (
                    <LinkInput {...props} onChange={(e) => setTempValue(e)} />
                ) : (
                    <Input {...props} onChange={(e) => setTempValue(e.target.value)} />
                )
            ) : (
                <Tag onClick={() => setInputVisible(true)}>
                    <PlusOutlined /> Add new
                </Tag>
            )}
        </Space>
    )
}

const UniqueInput = ({
    value,
    onChange,
    onClose,
    type = 'string',
}: {
    value: any
    onChange(value: any): void
    onClose(): void
    type: string
}) => {
    const [inputVisible, setInputVisible] = useState(false)

    const onEndEdit = () => {
        if (!value) {
            onClose()
            return
        }

        setInputVisible(false)
    }

    const props = {
        autoFocus: true,
        allowClear: true,
        type: 'text',
        size: 'small' as SizeType,
        placeholder: '',
        value: value,
        onBlur: onEndEdit,
        onPressEnter: onEndEdit,
    }

    if (inputVisible) {
        return type === 'number' ? (
            <InputNumber {...props} onChange={(e) => onChange(e)} />
        ) : type === 'date' ? (
            <DatePicker {...props} format="DD/MM/YYYY" onChange={(e) => onChange(e)} />
        ) : type === 'link' ? (
            <LinkInput {...props} onChange={(e) => onChange(e)} />
        ) : (
            <Input {...props} onChange={(e) => onChange(e.target.value)} />
        )
    }

    const isLongTag = typeof value === 'number' ? false : value.length > 20

    return (
        <Tag
            closable={true}
            onClose={(e) => {
                onClose()
                e.preventDefault()
            }}
        >
            <span onClick={(e) => setInputVisible(true)}>
                {isLongTag && type === 'string'
                    ? `${value.slice(0, 20)}...`
                    : type === 'date'
                    ? moment(value).format('DD/MM/YYYY')
                    : value}
            </span>
        </Tag>
    )
}

Admin.requireAuth = true

export default Admin
