'use client'

import dayjs, { Dayjs } from 'dayjs'
import { Button, Card, Col, Divider, Input, Popconfirm, Radio, Row, Space, Spin, message } from 'antd'
import { useFormik } from 'formik'
import { Typography } from 'antd'
import { PicCenterOutlined, PicLeftOutlined, CheckOutlined } from '@ant-design/icons'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MetadatasList from '~/components/MetadatasList'
import ContainerCreation, { ContainerFieldCreation } from '~/types/containerCreation'
import SlugEdit from '~/components/SlugEdit'
import WithLabel from '~/components/WithLabel'
import ContainerFieldsManager from '~/components/ContainerFieldsManager'
import validate from './validate'
import { useMutation } from '@tanstack/react-query'
import { ContainerResponse, getContainer, postContainer, updateContainer } from '~/network/containers'
import { useEffect } from 'react'
import { ContainerFieldType } from '@prisma/client'

dayjs.extend(customParseFormat)

const { Text } = Typography

const initialValues: ContainerCreation<Dayjs> = {
    name: '',
    published: true,
    slug: [''],
    metadatas: [],
    contentsMetadatas: [],
    fields: [],
}

const cleanDetails = (container: ContainerResponse): ContainerCreation<Dayjs> => ({
    ...container,
    fields:
        container?.fields?.map((field) => ({
            ...field,

            min: field.min || undefined,
            max: field.min || undefined,

            startDate: field.startDate ? dayjs(field.startDate) : undefined,
            endDate: field.endDate ? dayjs(field.endDate) : undefined,
            valueMin: field.valueMin || undefined,
            valueMax: field.valueMax || undefined,

            defaultTextValue: field.defaultTextValue || undefined,
            defaultMultipleTextValue: field.defaultMultipleTextValue || undefined,
            defaultNumberValue: field.defaultNumberValue || undefined,
            defaultMultipleNumberValue: field.defaultMultipleNumberValue || undefined,
            defaultDateValue: field.defaultDateValue ? dayjs(field.defaultDateValue) : undefined,
            defaultMultipleDateValue: field.defaultMultipleDateValue.map((date) => dayjs(date)) || [],
            defaultJsonValue: field.defaultJsonValue || undefined,
            defaultMultipleJsonValue: field.defaultMultipleJsonValue || undefined,
        })) || [],
    slug: container?.slug?.basic.split('/') || [''],
})

const cleanBeforeSend = (values: ContainerCreation<Dayjs>) => {
    let cleanValues = { ...values }
    const fields: ContainerFieldCreation<string>[] = []

    for (const field of cleanValues.fields) {
        let defaultValue: any = {}

        switch (field.type) {
            case ContainerFieldType.RICHTEXT:
            case ContainerFieldType.COLOR:
            case ContainerFieldType.CONTENT:
            case ContainerFieldType.VIDEO:
            case ContainerFieldType.FILE:
            case ContainerFieldType.IMAGE:
            case ContainerFieldType.PARAGRAPH:
            case ContainerFieldType.STRING: {
                if (field.multiple) {
                    defaultValue.defaultMultipleTextValue = field.defaultMultipleTextValue
                } else {
                    defaultValue.defaultTextValue = field.defaultTextValue
                }
                break
            }

            case ContainerFieldType.NUMBER: {
                if (field.multiple) {
                    defaultValue.defaultMultipleNumberValue = field.defaultMultipleNumberValue
                } else {
                    defaultValue.defaultNumberValue = field.defaultNumberValue
                }
                break
            }

            case ContainerFieldType.DATE: {
                if (field.multiple) {
                    defaultValue.defaultMultipleDateValue = field.defaultMultipleDateValue?.map((date) =>
                        date?.toString()
                    )
                } else {
                    defaultValue.defaultDateValue = field.defaultDateValue?.toString()
                }
                break
            }

            case ContainerFieldType.LOCATION:
            case ContainerFieldType.OPTION:
            case ContainerFieldType.LINK: {
                if (field.multiple) {
                    defaultValue.defaultMultipleJson = field.defaultMultipleJsonValue
                } else {
                    defaultValue.defaultJsonValue = field.defaultJsonValue
                }
                break
            }
        }

        fields.push({
            id: field.id,
            name: field.name,
            required: !!field.required,
            type: field.type,
            multiple: !!field.multiple,
            position: field.position,
            metadatas: field.metadatas,
            ...defaultValue,
        })
    }

    return { ...cleanValues, fields }
}

const CreateContainer = ({ params }: any) => {
    const { containerId } = params
    const isUpdate = containerId !== 'create'
    const formik = useFormik({
        initialValues,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const details = useMutation(() => getContainer(containerId), {
        onSuccess: (data) => formik.setValues(cleanDetails(data)),
    })
    const submit = useMutation(
        (values: ContainerCreation<Dayjs>) =>
            isUpdate
                ? updateContainer(containerId, cleanBeforeSend(values))
                : postContainer(cleanBeforeSend(values)),
        {
            onSuccess: () => message.success(`Container ${isUpdate ? 'modified' : 'created'} with success.`),
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    useEffect(() => {
        if (isUpdate) details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (details.isLoading) {
        return <Spin />
    }

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Create new container</Text>

                    <Space>
                        {isUpdate && (
                            <>
                                <Button icon={<PicCenterOutlined />} key="1" size="small" type="dashed">
                                    Custom sections
                                </Button>

                                <Popconfirm
                                    placement="bottom"
                                    title="Save before?"
                                    description="If you don't your changes won't be saved"
                                    // onConfirm={confirm}
                                    // onCancel={cancel}
                                    okText="Save before"
                                    cancelText="Without saving"
                                >
                                    <Button icon={<PicLeftOutlined />} key="2" size="small" type="dashed">
                                        Custom template sections
                                    </Button>
                                </Popconfirm>
                            </>
                        )}

                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={() => formik.handleSubmit()}
                            loading={submit.isLoading}
                        >
                            {isUpdate ? 'Update page' : 'Create new'}
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

                        <WithLabel label="URL :" error={(formik.errors.slug as string[])?.find((e) => !!e)}>
                            <SlugEdit
                                value={formik.values.slug}
                                onChange={(e) => formik.setFieldValue('slug', e)}
                                errors={formik.errors.slug as string[]}
                                paramsId={isUpdate ? { containerId } : undefined}
                            />
                        </WithLabel>
                    </Col>
                    <Col span={8}>
                        <Card size="small" title="Container metadatas" style={{ minHeight: '100%' }}>
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
            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Card bordered={false} bodyStyle={{ height: 'fit-content' }} size="small" title="Field">
                        <ContainerFieldsManager
                            value={formik.values.fields}
                            onChange={(name, value) =>
                                formik.setFieldValue(`fields${name ? `.${name}` : ''}`, value)
                            }
                            errors={formik.errors.fields as any[]}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        bordered={false}
                        style={{ height: 'fit-content' }}
                        size="small"
                        title="Contents metadatas"
                    >
                        <MetadatasList
                            name="contentsMetadatas"
                            value={formik.values.contentsMetadatas}
                            onChange={formik.handleChange}
                            errors={formik.errors.contentsMetadatas as string[]}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default CreateContainer

// interface OptionListProps {
//     value: Options<string>
//     onChange(value: Options<string>): void
//     errors: Options<string>
// }

// const OptionList = ({ value, onChange }: OptionListProps) => {
//     const onAdd = () => onChange([...value, { label: '', value: '' }])

//     // const onRemove = () => {}

//     return (
//         <Checkbox.Group onChange={(e) => console.log(e)}>
//             <Space style={{ width: '100%' }} direction="vertical">
//                 {!!value.length && (
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                         <Tooltip title="Default value">
//                             <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
//                         </Tooltip>
//                         <Text type="secondary" style={{ marginLeft: 12, width: 'calc(50% - 24px)' }}>
//                             Label:
//                         </Text>
//                         <Text type="secondary">Value:</Text>
//                     </div>
//                 )}

//                 {value.map((option, idx) => {
//                     // const onLabelChange = () => {}

//                     // const onValueChange = () => {}

//                     return (
//                         <Space key={idx}>
//                             <Checkbox value={option.value || idx} />
//                             {/* <Radio /> */}
//                             <Space.Compact size="small" style={{ width: '100%' }}>
//                                 <Input
//                                     size="small"
//                                     style={{ width: 'calc(50% - 12px)' }}
//                                     value={option.label}
//                                     // onChange={onChange}
//                                     // status={errors?.[idx] ? "error" : undefined}
//                                 />
//                                 <Input
//                                     size="small"
//                                     style={{ width: 'calc(50% - 12px)' }}
//                                     value={option.value}
//                                     // onChange={onChange}
//                                     // status={errors?.[idx] ? "error" : undefined}
//                                 />
//                                 <Button
//                                     size="small"
//                                     type="primary"
//                                     danger
//                                     icon={<DeleteOutlined />}
//                                     // onClick={() => handleRemove(idx)}
//                                 />
//                             </Space.Compact>
//                         </Space>
//                     )
//                 })}

//                 <Button size="small" type="primary" icon={<PlusOutlined />} onClick={onAdd}>
//                     Add option
//                 </Button>
//             </Space>
//         </Checkbox.Group>
//     )
// }
