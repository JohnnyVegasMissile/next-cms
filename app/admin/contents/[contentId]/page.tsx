'use client'

import dayjs, { Dayjs } from 'dayjs'
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Input,
    InputNumber,
    Radio,
    Row,
    Space,
    Spin,
    message,
    Form,
} from 'antd'
import { useFormik } from 'formik'
import { Typography } from 'antd'
import { PicCenterOutlined, CheckOutlined } from '@ant-design/icons'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MetadatasList from '~/components/MetadatasList'
import WithLabel from '~/components/WithLabel'
import validate from './validate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getContainer } from '~/network/containers'
import { useEffect, useMemo } from 'react'
import ContentCreation, { ContentFieldCreation } from '~/types/contentCreation'
import { ContentResponse, getContent, postContent, updateContent } from '~/network/contents'
import ListSelect from '~/components/ListSelect'
import { ObjectId } from '~/types'
import { ContainerField, ContainerFieldType } from '@prisma/client'
import { slugExist } from '~/network/slugs'
import MultiInput from '~/components/MultiInputs'
import { useRouter } from 'next/navigation'

dayjs.extend(customParseFormat)

const { Text } = Typography

const initialValues: ContentCreation<Dayjs> = {
    name: '',
    published: true,
    containerId: undefined,
    slug: '',
    metadatas: [],
    fields: [],
}

const cleanDetails = (content: ContentResponse): ContentCreation<Dayjs> => ({
    name: content.name,
    published: content.published,
    containerId: content.containerId,
    slug: content.slug?.basic || '',
    metadatas: content.metadatas,

    fields: content.fields.map((field) => {
        let cleanValue: {
            multipleTextValue?: string[]
            textValue?: string | undefined
            multipleNumberValue?: number[]
            numberValue?: number | undefined
            multipleDateValue?: Dayjs[]
            dateValue?: Dayjs | undefined
            multipleJsonValue?: any[]
            jsonValue?: any | undefined
        } = {}

        switch (field.type) {
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
                    cleanValue.multipleTextValue = field.multipleTextValue
                } else {
                    cleanValue.textValue = field.textValue!
                }
                break
            }

            case ContainerFieldType.NUMBER: {
                if (field.multiple) {
                    cleanValue.multipleNumberValue = field.multipleNumberValue
                } else {
                    cleanValue.numberValue = field.numberValue!
                }
                break
            }

            case ContainerFieldType.DATE: {
                if (field.multiple) {
                    cleanValue.multipleDateValue = field.multipleDateValue.map((date) => dayjs(date))
                } else {
                    cleanValue.dateValue = field.dateValue ? dayjs(field.dateValue) : undefined
                }
                break
            }

            case ContainerFieldType.LOCATION:
            case ContainerFieldType.LINK: {
                if (field.multiple) {
                    cleanValue.multipleJsonValue = field.multipleJsonValue
                } else {
                    cleanValue.jsonValue = field.jsonValue
                }
                break
            }
        }

        return {
            type: field.type,
            multiple: field.multiple,

            releatedFieldId: field.id,

            ...cleanValue,
        }
    }) as ContentCreation<Dayjs>['fields'],
})

const cleanBeforeSend = (values: ContentCreation<Dayjs>): ContentCreation<string> => ({
    ...values,
    fields: values.fields.map((field) => ({
        ...field,
        dateValue: field.dateValue?.toISOString(),
        multipleDateValue: field.multipleDateValue?.map((date) => date.toISOString()),
    })),
})

const CreateContainer = ({ params }: any) => {
    const { contentId } = params
    const router = useRouter()
    const queryClient = useQueryClient()
    const isUpdate = contentId !== 'create'
    const formik = useFormik({
        initialValues,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const details = useMutation(() => getContent(contentId), {
        onSuccess: (data) => formik.setValues(cleanDetails(data)),
    })
    const container = useMutation((id: ObjectId) => getContainer(id), {
        onSuccess: (data) => {
            const fields = data.fields.map((field) => {
                const matching = details.data?.fields.find((f) => f.releatedFieldId === field.id)
                let defaultValue: any = !!matching ? { id: matching.id } : {}

                switch (field.type) {
                    case ContainerFieldType.RICHTEXT:
                    case ContainerFieldType.COLOR:
                    case ContainerFieldType.CONTENT:
                    case ContainerFieldType.VIDEO:
                    case ContainerFieldType.FILE:
                    case ContainerFieldType.IMAGE:
                    case ContainerFieldType.PARAGRAPH:
                    case ContainerFieldType.STRING:
                    case ContainerFieldType.OPTION: {
                        if (!!matching) {
                            if (field.multiple) {
                                defaultValue.multipleTextValue = matching.multipleTextValue
                            } else {
                                defaultValue.textValue = matching.textValue
                            }
                        } else {
                            if (field.multiple) {
                                defaultValue.multipleTextValue = field.defaultMultipleTextValue
                            } else {
                                defaultValue.textValue = field.defaultTextValue
                            }
                        }

                        break
                    }

                    case ContainerFieldType.NUMBER: {
                        if (!!matching) {
                            if (field.multiple) {
                                defaultValue.multipleNumberValue = matching.multipleNumberValue
                            } else {
                                defaultValue.numberValue = matching.numberValue
                            }
                        } else {
                            if (field.multiple) {
                                defaultValue.multipleNumberValue = field.defaultMultipleNumberValue
                            } else {
                                defaultValue.numberValue = field.defaultNumberValue
                            }
                        }
                        break
                    }

                    case ContainerFieldType.DATE: {
                        if (!!matching) {
                            if (field.multiple) {
                                defaultValue.multipleDateValue = matching.multipleDateValue.map((date) =>
                                    date ? dayjs(date) : undefined
                                )
                            } else {
                                defaultValue.dateValue = !!matching.dateValue
                                    ? dayjs(matching.dateValue)
                                    : undefined
                            }
                        } else {
                            if (field.multiple) {
                                defaultValue.multipleDateValue = field.defaultMultipleDateValue.map((date) =>
                                    date ? dayjs(date) : undefined
                                )
                            } else {
                                defaultValue.dateValue = !!field.defaultDateValue
                                    ? dayjs(field.defaultDateValue)
                                    : undefined
                            }
                        }
                        break
                    }

                    case ContainerFieldType.LOCATION:
                    case ContainerFieldType.LINK: {
                        if (!!matching) {
                            if (field.multiple) {
                                defaultValue.multipleJsonValue = matching.multipleJsonValue
                            } else {
                                defaultValue.jsonValue = matching.jsonValue
                            }
                        } else {
                            if (field.multiple) {
                                defaultValue.multipleJsonValue = field.defaultMultipleJsonValue
                            } else {
                                defaultValue.jsonValue = field.defaultJsonValue
                            }
                        }

                        break
                    }
                }

                return {
                    type: field.type,
                    multiple: field.multiple,

                    releatedFieldId: field.id,

                    ...defaultValue,
                }
            })

            formik.setFieldValue('fields', fields)
        },
    })
    const submit = useMutation(
        (values: ContentCreation<Dayjs>) =>
            isUpdate
                ? updateContent(contentId, cleanBeforeSend(values))
                : postContent(cleanBeforeSend(values)),
        {
            onSuccess: () => {
                message.success(`Content ${isUpdate ? 'modified' : 'created'} with success.`)
                queryClient.invalidateQueries({ queryKey: ['contents'] })
                router.push('/admin/contents')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    const slugExists = useQuery(
        [
            'slug-exists',
            {
                slug: `${container.data?.slug?.basic}/${formik.values.slug}`,
                contentId: isUpdate ? undefined : contentId,
            },
        ],
        () =>
            slugExist(
                `${container.data?.slug?.basic}/${formik.values.slug}`,
                isUpdate ? { contentId } : undefined
            ),
        {
            enabled: !!formik.values.slug && container.isSuccess,
        }
    )

    useEffect(() => {
        if (isUpdate) details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!!formik.values.containerId) container.mutate(formik.values.containerId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.values.containerId])

    if (details.isLoading) {
        return <Spin />
    }

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Create new content</Text>

                    <Space>
                        {isUpdate && (
                            <Button
                                icon={<PicCenterOutlined rev={undefined} />}
                                key="1"
                                size="small"
                                type="dashed"
                            >
                                Custom sections
                            </Button>
                        )}

                        <Button
                            type="primary"
                            icon={<CheckOutlined rev={undefined} />}
                            size="small"
                            onClick={() => formik.handleSubmit()}
                            loading={submit.isLoading}
                        >
                            {isUpdate ? 'Update content' : 'Create new'}
                        </Button>
                    </Space>
                </div>
            </Card>

            <Card size="small" title="Information">
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <WithLabel label="Name :" error={formik.errors.name}>
                                    <Input
                                        size="small"
                                        status={!!formik.errors.name ? 'error' : undefined}
                                        style={{ width: '100%' }}
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                    />
                                </WithLabel>
                            </Col>
                            <Col span={12}>
                                <WithLabel label="Published :">
                                    <Radio.Group
                                        name="published"
                                        value={formik.values.published}
                                        onChange={formik.handleChange}
                                        options={[
                                            { label: 'Published', value: true },
                                            { label: 'Unpublished', value: false },
                                        ]}
                                    />
                                </WithLabel>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '1rem', width: '97%', minWidth: '97%' }} />

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <WithLabel label="Container :" error={formik.errors.slug}>
                                    <ListSelect.Container
                                        disabled={!!formik.values.containerId}
                                        error={!!formik.errors.containerId}
                                        value={formik.values.containerId}
                                        onChange={(e) => formik.setFieldValue('containerId', e)}
                                    />
                                </WithLabel>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    hasFeedback
                                    validateStatus={
                                        !formik.values.slug || slugExists.isError
                                            ? undefined
                                            : slugExists.isFetching
                                            ? 'validating'
                                            : slugExists.data?.exist
                                            ? 'error'
                                            : 'success'
                                    }
                                    style={{ margin: 0 }}
                                >
                                    <WithLabel label="URL :" error={formik.errors.slug}>
                                        <Input
                                            size="small"
                                            status={!!formik.errors.slug ? 'error' : undefined}
                                            style={{ width: '100%' }}
                                            name="slug"
                                            value={formik.values.slug}
                                            onChange={formik.handleChange}
                                        />
                                    </WithLabel>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Card size="small" title="Content metadatas" style={{ minHeight: '100%' }}>
                            <MetadatasList
                                name="metadatas"
                                value={formik.values.metadatas}
                                onChange={formik.handleChange}
                                errors={formik.errors.metadatas as string[]}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
            {container.isLoading && <Spin />}
            {!!formik.values.containerId && container.isSuccess && (
                <Card bodyStyle={{ height: 'fit-content' }} size="small" title="Fields">
                    <Row gutter={[16, 16]}>
                        {formik.values.fields.map((field, idx) => (
                            <Col key={field.releatedFieldId} span={6}>
                                <FieldCard
                                    field={field}
                                    containerFields={container?.data.fields}
                                    onChange={(name, value) =>
                                        formik.setFieldValue(`fields.${idx}.${name}`, value)
                                    }
                                    errors={formik.errors.fields?.[idx] as any}
                                />
                            </Col>
                        ))}
                    </Row>
                </Card>
            )}
        </>
    )
}

interface FieldCardProps {
    field: ContentFieldCreation<Dayjs>
    containerFields: ContainerField[]
    onChange(name: string, value: any): void
    errors: (string | undefined)[] | string | undefined
}

const FieldCard = ({ field, containerFields, onChange, errors }: FieldCardProps) => {
    const matchingField = useMemo(() => {
        return containerFields.find((e) => e.id === field.releatedFieldId)!
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.releatedFieldId])

    const Component = FieldInputs[field.type]

    return (
        <Card
            size="small"
            title={
                <Space>
                    <Text>{matchingField.name}</Text>
                    {matchingField.required && <Text type="danger"> *</Text>}
                    {(matchingField.min || matchingField.max) && (
                        <Text type="secondary">
                            {`(${matchingField.min ? 'matchingField.min' : ''}${
                                matchingField.min && matchingField.max ? ' ' : ''
                            }${matchingField.max ? 'matchingField.min' : ''})`}
                        </Text>
                    )}
                </Space>
            }
        >
            <Component field={field} matchingField={matchingField} onChange={onChange} errors={errors} />
        </Card>
    )
}

interface FieldInputsProps<T> {
    field: ContentFieldCreation<Dayjs>
    matchingField: ContainerField
    onChange(name: string, value: T): void
    errors: (string | undefined)[] | string | undefined
}

const FieldInputs = ({}: FieldInputsProps<any>) => null
const FieldInputsRichText = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsColor = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsContent = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsVideo = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsFile = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsImage = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsParagraph = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsString = ({ field, errors, onChange }: FieldInputsProps<string | string[]>) =>
    field.multiple ? (
        <MultiInput
            values={field.multipleTextValue}
            onChange={(e) => onChange('multipleTextValue', e)}
            errors={errors as (string | undefined)[] | undefined}
        />
    ) : (
        <Input
            size="small"
            placeholder="+ Add new"
            value={field.textValue}
            onChange={(e) => onChange('textValue', e.target.value)}
        />
    )

const FieldInputsNumber = ({
    field,
    errors,
    matchingField,
    onChange,
}: FieldInputsProps<number | (number | undefined)[] | undefined>) => {
    return field.multiple ? (
        <MultiInput.Number
            min={matchingField.min || undefined}
            max={matchingField.max || undefined}
            values={field.multipleNumberValue}
            onChange={(e) => onChange('multipleNumberValue', e)}
            errors={errors as (string | undefined)[] | undefined}
        />
    ) : (
        <InputNumber
            min={matchingField.min || undefined}
            max={matchingField.max || undefined}
            size="small"
            style={{ width: '100%' }}
            placeholder="+ Add new"
            value={field.numberValue}
            onChange={(e) => onChange('numberValue', e || undefined)}
        />
    )
}

const FieldInputsDate = ({
    field,
    errors,
    matchingField,
    onChange,
}: FieldInputsProps<Dayjs | (Dayjs | undefined)[] | undefined>) =>
    field.multiple ? (
        <MultiInput.Date
            startDate={matchingField.startDate ? dayjs(matchingField.startDate) : undefined}
            endDate={matchingField.endDate ? dayjs(matchingField.endDate) : undefined}
            values={field.multipleDateValue}
            onChange={(e) => onChange('multipleDateValue', e)}
            errors={errors as (string | undefined)[] | undefined}
        />
    ) : (
        <DatePicker
            size="small"
            style={{ width: '100%' }}
            placeholder="+ Add new"
            value={field.dateValue}
            onChange={(e) => onChange('dateValue', e || undefined)}
        />
    )

const FieldInputsLocation = ({}: FieldInputsProps<any | any[]>) => null
const FieldInputsOption = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsLink = ({}: FieldInputsProps<any | any[]>) => null

FieldInputs.RICHTEXT = FieldInputsRichText
FieldInputs.COLOR = FieldInputsColor
FieldInputs.CONTENT = FieldInputsContent
FieldInputs.VIDEO = FieldInputsVideo
FieldInputs.FILE = FieldInputsFile
FieldInputs.IMAGE = FieldInputsImage
FieldInputs.PARAGRAPH = FieldInputsParagraph
FieldInputs.STRING = FieldInputsString
FieldInputs.NUMBER = FieldInputsNumber
FieldInputs.DATE = FieldInputsDate
FieldInputs.LOCATION = FieldInputsLocation
FieldInputs.OPTION = FieldInputsOption
FieldInputs.LINK = FieldInputsLink

export default CreateContainer
