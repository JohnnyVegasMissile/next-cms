'use client'

import set from 'lodash.set'
import { Button, Card, Checkbox, Col, Divider, Input, Popconfirm, Radio, Row, Space, Tooltip } from 'antd'
import { useFormik } from 'formik'
import { Typography } from 'antd'
import {
    PlusOutlined,
    DeleteOutlined,
    PicCenterOutlined,
    PicLeftOutlined,
    CheckOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons'
import MetadatasList from '~/components/MetadatasList'
import ContainerCreation from '~/types/containerCreation'
import SlugEdit from '~/components/SlugEdit'
import { ContainerFieldType } from '@prisma/client'
import { Options } from '~/types'
import WithLabel from '~/components/WithLabel'
import ContainerFieldsManager from '~/components/ContainerFieldsManager'

const { Text } = Typography

const initialValues: ContainerCreation = {
    name: '',
    published: true,
    slug: [''],
    metadatas: [],
    contentsMetadatas: [],
    fields: [],
}

const validate = (values: ContainerCreation) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    for (let i = 0; i < values.slug.length; i++) {
        if (!values.slug[i]) set(errors, `slug.${i}`, 'Required')
    }

    for (let i = 0; i < values.metadatas.length; i++) {
        if (!values.metadatas[i]?.content) set(errors, `metadatas.${i}`, 'Required')
    }

    for (let i = 0; i < values.contentsMetadatas.length; i++) {
        if (!values.contentsMetadatas[i]?.content) set(errors, `contentsMetadatas.${i}`, 'Required')
    }

    return errors
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
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2))
        },
    })

    // const options = [
    //   { label: "Apple", value: "Apple" },
    //   { label: "Pear", value: "Pear" },
    //   { label: "Orange", value: "Orange" },
    // ];

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
                            // loading={submit.isLoading}
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

interface OptionListProps {
    value: Options<string>
    onChange(value: Options<string>): void
    errors: Options<string>
}

const OptionList = ({ value, onChange }: OptionListProps) => {
    const onAdd = () => onChange([...value, { label: '', value: '' }])

    // const onRemove = () => {}

    return (
        <Checkbox.Group onChange={(e) => console.log(e)}>
            <Space style={{ width: '100%' }} direction="vertical">
                {!!value.length && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title="Default value">
                            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
                        </Tooltip>
                        <Text type="secondary" style={{ marginLeft: 12, width: 'calc(50% - 24px)' }}>
                            Label:
                        </Text>
                        <Text type="secondary">Value:</Text>
                    </div>
                )}

                {value.map((option, idx) => {
                    // const onLabelChange = () => {}

                    // const onValueChange = () => {}

                    return (
                        <Space key={idx}>
                            <Checkbox value={option.value || idx} />
                            {/* <Radio /> */}
                            <Space.Compact size="small" style={{ width: '100%' }}>
                                <Input
                                    size="small"
                                    style={{ width: 'calc(50% - 12px)' }}
                                    value={option.label}
                                    // onChange={onChange}
                                    // status={errors?.[idx] ? "error" : undefined}
                                />
                                <Input
                                    size="small"
                                    style={{ width: 'calc(50% - 12px)' }}
                                    value={option.value}
                                    // onChange={onChange}
                                    // status={errors?.[idx] ? "error" : undefined}
                                />
                                <Button
                                    size="small"
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    // onClick={() => handleRemove(idx)}
                                />
                            </Space.Compact>
                        </Space>
                    )
                })}

                <Button size="small" type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                    Add option
                </Button>
            </Space>
        </Checkbox.Group>
    )
}

interface DefaultFieldProps<T> {
    type: ContainerFieldType
    multiple: boolean
    value: T
    onChange(value: T): void
    options?: Options<T>
}

const DefaultField = <T,>({}: DefaultFieldProps<T>) => {
    return <Input disabled size="small" style={{ width: '100%' }} />
}
