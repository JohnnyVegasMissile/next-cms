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
import { useMutation, useQuery } from '@tanstack/react-query'
import { getContainer } from '~/network/containers'
import { useEffect, useMemo } from 'react'
import ContentCreation, { ContentFieldCreation } from '~/types/contentCreation'
import { ContentResponse, getContent, postContent, updateContent } from '~/network/contents'
import ListSelect from '~/components/ListSelect'
import { ObjectId } from '~/types'
import { ContainerField, ContainerFieldType } from '@prisma/client'
import { slugExist } from '~/network/slugs'

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
    ...content,
    fields: content.fields.map((field) => ({
        ...field,
        dateValue: field.dateValue ? dayjs(field.dateValue) : undefined,
        multipleDateValue: field.multipleDateValue
            ? field.multipleDateValue?.map((date) => dayjs(date))
            : undefined,
    })),
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
            console.log('onSuccess', isUpdate, data)
            if (isUpdate) {
            } else {
                const fields = data.fields.map((field) => {
                    let defaultValue: any = {}

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
                                defaultValue.multipleTextValue = field.defaultMultipleTextValue
                            } else {
                                defaultValue.textValue = field.defaultTextValue
                            }
                            break
                        }

                        case ContainerFieldType.NUMBER: {
                            if (field.multiple) {
                                defaultValue.multipleNumberValue = field.defaultMultipleNumberValue
                            } else {
                                defaultValue.numberValue = field.defaultNumberValue
                            }
                            break
                        }

                        case ContainerFieldType.DATE: {
                            if (field.multiple) {
                                defaultValue.multipleDateValue = field.defaultMultipleDateValue.map((date) =>
                                    data ? dayjs(date) : undefined
                                )
                            } else {
                                defaultValue.dateValue = field.defaultDateValue
                                    ? dayjs(field.defaultDateValue)
                                    : undefined
                            }
                            break
                        }

                        case ContainerFieldType.LOCATION:
                        case ContainerFieldType.LINK: {
                            if (field.multiple) {
                                defaultValue.multipleJsonValue = field.defaultMultipleJsonValue
                            } else {
                                defaultValue.jsonValue = field.defaultJsonValue
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
            }
        },
    })
    const submit = useMutation(
        (values: ContentCreation<Dayjs>) =>
            isUpdate
                ? updateContent(contentId, cleanBeforeSend(values))
                : postContent(cleanBeforeSend(values)),
        {
            onSuccess: () => message.success(`Content ${isUpdate ? 'modified' : 'created'} with success.`),
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    const slugExists = useQuery(
        ['slug', { slug: formik.values.slug, contentId: isUpdate ? undefined : contentId }],
        () => slugExist(formik.values.slug, isUpdate ? { contentId } : undefined),
        {
            enabled: !!formik.values.slug,
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
                            <Button icon={<PicCenterOutlined />} key="1" size="small" type="dashed">
                                Custom sections
                            </Button>
                        )}

                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={() => formik.handleSubmit()}
                            loading={submit.isLoading}
                        >
                            {isUpdate ? 'Update content' : 'Create new'}
                        </Button>
                    </Space>
                </div>
            </Card>

            <Card bordered={false} size="small" title="Information">
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
                                        !formik.values.slug
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
            {!!formik.values.containerId && container.isSuccess && (
                <Card bordered={false} bodyStyle={{ height: 'fit-content' }} size="small" title="Fields">
                    <Row gutter={[16, 16]}>
                        {formik.values.fields.map((field, idx) => (
                            <Col key={field.releatedFieldId} span={6}>
                                <FieldCard
                                    field={field}
                                    containerFields={container?.data.fields}
                                    onChange={(name, value) =>
                                        formik.setFieldValue(`fields.${idx}.${name}`, value)
                                    }
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
}

const FieldCard = ({ field, containerFields, onChange }: FieldCardProps) => {
    const matchingField = useMemo(() => {
        return containerFields.find((e) => e.id === field.releatedFieldId)!
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.releatedFieldId])

    const Component = FieldInputs[field.type]

    return (
        <Card
            size="small"
            title={
                <Text>
                    {matchingField.name}
                    {matchingField.required && <Text type="danger"> *</Text>}
                </Text>
            }
        >
            <Component field={field} matchingField={matchingField} onChange={onChange} />
        </Card>
    )
}

interface FieldInputsProps<T> {
    field: ContentFieldCreation<Dayjs>
    matchingField: ContainerField
    onChange(name: string, value: T): void
}

const FieldInputs = ({}: FieldInputsProps<any>) => null
const FieldInputsRichText = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsColor = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsContent = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsVideo = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsFile = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsImage = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsParagraph = ({}: FieldInputsProps<string | string[]>) => null
const FieldInputsString = ({ field, onChange }: FieldInputsProps<string | string[]>) =>
    field.multiple ? (
        <Space direction="vertical" style={{ width: '100%' }}>
            {field.multipleTextValue?.map((value, idx) => (
                <Input key={idx} size="small" value={value} />
            ))}
            <Input size="small" />
        </Space>
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
    matchingField,
    onChange,
}: FieldInputsProps<number | number[] | undefined>) =>
    field.multiple ? (
        <Space direction="vertical" style={{ width: '100%' }}>
            {field.multipleNumberValue?.map((value, idx) => (
                <InputNumber
                    key={idx}
                    min={matchingField.min || undefined}
                    max={matchingField.max || undefined}
                    size="small"
                    style={{ width: '100%' }}
                    value={value}
                />
            ))}
            <InputNumber
                min={matchingField.min || undefined}
                max={matchingField.max || undefined}
                size="small"
                style={{ width: '100%' }}
            />
        </Space>
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
const FieldInputsDate = ({ field, onChange }: FieldInputsProps<Dayjs | Dayjs[] | undefined>) =>
    field.multiple ? (
        <Space direction="vertical" style={{ width: '100%' }}>
            {field.multipleDateValue?.map((value, idx) => (
                <DatePicker key={idx} size="small" style={{ width: '100%' }} value={value || undefined} />
            ))}
        </Space>
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
