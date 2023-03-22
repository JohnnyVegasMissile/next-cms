'use client'

import set from 'lodash.set'
import {
    Button,
    Card,
    Checkbox,
    Col,
    Collapse,
    Divider,
    Dropdown,
    Input,
    Popconfirm,
    Radio,
    Row,
    Space,
    Switch,
    Tooltip,
} from 'antd'
import { useFormik } from 'formik'
import { Typography } from 'antd'
import {
    PlusOutlined,
    EllipsisOutlined,
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
import { tempId } from '~/utilities'
import PopOptions from '~/components/PopOptions'
import WithLabel from '~/components/WithLabel'

const { Panel } = Collapse
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
                        <ContainerFields
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

const fieldOptions = [
    { label: 'Text', value: ContainerFieldType.STRING },
    { label: 'Date', value: ContainerFieldType.DATE },
    { label: 'Boolean', value: ContainerFieldType.BOOLEAN },
    { label: 'Number', value: ContainerFieldType.NUMBER },
    { label: 'Link', value: ContainerFieldType.LINK },
    { label: 'Paragraph', value: ContainerFieldType.PARAGRAPH },
    { label: 'Image', value: ContainerFieldType.IMAGE },
    { label: 'File', value: ContainerFieldType.FILE },
    { label: 'Video', value: ContainerFieldType.VIDEO },
    { label: 'Content', value: ContainerFieldType.CONTENT },
    { label: 'Option', value: ContainerFieldType.OPTION },
    { label: 'Rich text', value: ContainerFieldType.RICHTEXT },
    { label: 'Color', value: ContainerFieldType.COLOR },
    { label: 'Location', value: ContainerFieldType.LOCATION },
]

interface ContainerFieldsProps {
    value: ContainerCreation['fields']
    onChange(name: string, value: any): void
    errors: any[]
}

const ContainerFields = ({ value, onChange, errors }: ContainerFieldsProps) => {
    const addField = (type: ContainerFieldType) =>
        onChange('', [
            ...value,
            {
                tempId: tempId(),
                name: '',
                required: false,
                type,
                multiple: false,
                options: [],
                position: value.length,
            },
        ])

    const deleteField = (idx: number) => {
        const fieldsCopy = [...value]
        fieldsCopy.splice(idx, 1)
        onChange('', fieldsCopy)
    }

    const moveField = (idx: number, direction: 'up' | 'down') => {
        let fieldsCopy = [...value]
        const temp = fieldsCopy[idx]!
        if (direction === 'up') {
            fieldsCopy[idx] = fieldsCopy[idx + 1]!
            fieldsCopy[idx + 1] = temp

            fieldsCopy[idx]!.position = fieldsCopy[idx]!.position - 1
            fieldsCopy[idx + 1]!.position = fieldsCopy[idx + 1]!.position + 1
        } else {
            fieldsCopy[idx] = fieldsCopy[idx - 1]!
            fieldsCopy[idx - 1] = temp

            fieldsCopy[idx]!.position = fieldsCopy[idx]!.position + 1
            fieldsCopy[idx - 1]!.position = fieldsCopy[idx - 1]!.position - 1
        }

        onChange('', fieldsCopy)
    }

    const items = fieldOptions.map((e) => ({
        label: e.label,
        key: e.value,
        onClick: () => addField(e.value),
    }))

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {value.map((field, idx) => (
                <Collapse
                    size="small"
                    key={field.id || field.tempId || `field-${idx}`}
                    defaultActiveKey={field.tempId}
                >
                    <Panel
                        key={field.id || field.tempId || `field-${idx}`}
                        header={
                            <Space>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                        size="small"
                                        disabled={!!field.id}
                                        checked={field.multiple}
                                        onChange={(e) => onChange(`${idx}.multiple`, e)}
                                        checkedChildren="Multiple"
                                        unCheckedChildren="Single"
                                    />
                                </div>
                                <Text strong>
                                    {fieldOptions.find((e) => e.value === field.type)?.label} field:{' '}
                                    {field.position}
                                </Text>
                                <Text>{field.name}</Text>
                            </Space>
                        }
                        extra={
                            <PopOptions
                                onUp={() => moveField(idx, 'up')}
                                disableUp={idx === 0}
                                onDown={() => moveField(idx, 'down')}
                                disableDown={idx === value.length - 1}
                                onDelete={() => deleteField(idx)}
                                alert={!!field.id}
                            >
                                <Button type="ghost" size="small" icon={<EllipsisOutlined />} />
                            </PopOptions>
                        }
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <WithLabel
                                    label={
                                        <Space>
                                            <Text type="secondary">Name :</Text>

                                            <Switch
                                                size="small"
                                                checked={field.required}
                                                onChange={(e) => onChange(`${idx}.required`, e)}
                                                checkedChildren="Required"
                                                unCheckedChildren="Optional"
                                            />
                                        </Space>
                                    }
                                    error="Name is required"
                                >
                                    <Input
                                        size="small"
                                        status="error"
                                        style={{ width: '100%' }}
                                        value={field.name}
                                        onChange={(e) => onChange(`${idx}.name`, e.target.value)}
                                    />
                                </WithLabel>
                            </Col>
                        </Row>
                        {/* <Row gutter={[16, 16]}>
                            <Col span={16}>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Space direction="vertical" size={3} style={{ width: '100%' }}>
                                            <Space>
                                                <Text type="secondary">Name :</Text>

                                                <Switch
                                                    size="small"
                                                    checked={field.required}
                                                    onChange={(e) => onChange(`${idx}.required`, e)}
                                                    checkedChildren="Required"
                                                    unCheckedChildren="Optional"
                                                />
                                            </Space>

                                            <Input
                                                size="small"
                                                status="error"
                                                style={{ width: '100%' }}
                                                value={field.name}
                                                onChange={(e) => onChange(`${idx}.name`, e.target.value)}
                                            />
                                            <Text type="danger">Name is required</Text>
                                        </Space>
                                    </Col>
                                    <Col span={12}>
                                        <Space direction="vertical" size={3} style={{ width: '100%' }}>
                                            <Text type="secondary">Default :</Text>
                                            <DefaultField
                                                type={field.type}
                                                multiple={field.multiple}
                                                options={field.options}
                                                value={field.default}
                                                onChange={(e) => onChange(`${idx}.default`, e)}
                                            />
                                        </Space>
                                    </Col>
                                </Row>
                                <Divider style={{ margin: 0 }} />
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Space direction="vertical" size={3} style={{ width: '100%' }}>
                                            {field.type === ContainerFieldType.CONTENT && (
                                                <>
                                                    <Text type="secondary">Content :</Text>
                                                    <Select
                                                        size="small"
                                                        status="error"
                                                        style={{ width: '100%' }}
                                                        value={field.type}
                                                        disabled={!!field.id}
                                                        options={[]}
                                                        onChange={(e) => onChange(`${idx}.type`, e)}
                                                    />
                                                    <Text type="danger">Title is required</Text>
                                                </>
                                            )}

                                            {field.type === ContainerFieldType.DATE && (
                                                <>
                                                    <div style={{ display: 'flex' }}>
                                                        <Text type="secondary" style={{ width: '50%' }}>
                                                            Between :
                                                        </Text>
                                                        <Text type="secondary">And :</Text>
                                                    </div>
                                                    <Input.Group compact>
                                                        <DatePicker
                                                            size="small"
                                                            style={{ width: '50%' }}
                                                            disabledDate={(current: Dayjs) => {
                                                                if (!field.endDate) {
                                                                    return false
                                                                }

                                                                return field.endDate < current
                                                            }}
                                                            value={field.startDate}
                                                            onChange={(e) => onChange(`${idx}.startDate`, e)}
                                                        />
                                                        <DatePicker
                                                            size="small"
                                                            style={{ width: '50%' }}
                                                            disabledDate={(current: Dayjs) => {
                                                                if (!field.startDate) {
                                                                    return false
                                                                }

                                                                return field.startDate > current
                                                            }}
                                                            value={field.endDate}
                                                            onChange={(e) => onChange(`${idx}.endDate`, e)}
                                                        />
                                                    </Input.Group>
                                                </>
                                            )}
                                        </Space>
                                    </Col>
                                </Row>

                                <Space style={{ width: '100%' }}>
                                    <Text type="secondary">Multiple :</Text>
                                </Space>
                                <Row gutter={[16, 16]}>
                                    {field.multiple && (
                                        <Col span={12}>
                                            <Space direction="vertical" size={3} style={{ width: '100%' }}>
                                                <div style={{ display: 'flex' }}>
                                                    <Text type="secondary" style={{ width: '50%' }}>
                                                        Min:
                                                    </Text>
                                                    <Text type="secondary">Max:</Text>
                                                </div>
                                                <Input.Group compact>
                                                    <InputNumber
                                                        min={0}
                                                        max={field.max}
                                                        size="small"
                                                        style={{ width: '50%' }}
                                                        value={field.min}
                                                        onChange={(e) => onChange(`${idx}.min`, e)}
                                                    />
                                                    <InputNumber
                                                        min={field.min}
                                                        max={50}
                                                        size="small"
                                                        style={{ width: '50%' }}
                                                        value={field.max}
                                                        onChange={(e) => onChange(`${idx}.max`, e)}
                                                    />
                                                </Input.Group>
                                            </Space>
                                        </Col>
                                    )}
                                </Row>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Space direction="vertical" size={3} style={{ width: '100%' }}>
                                            <Text type="secondary">Metadata :</Text>
                                            <Select
                                                allowClear
                                                size="small"
                                                style={{ width: '100%' }}
                                                value={field.metadata}
                                                options={[
                                                    {
                                                        label: 'Application name',
                                                        value: 'application-name',
                                                    },
                                                    { label: 'Author', value: 'author' },
                                                    { label: 'Description', value: 'description' },
                                                    { label: 'Keywords', value: 'keywords' },
                                                ]}
                                                onChange={(e) => onChange(`${idx}.metadata`, e)}
                                            />
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                            {field.type === ContainerFieldType.OPTION && (
                                <Col span={8}>
                                    <Card title="options" size="small">
                                        <OptionList
                                            value={field.options}
                                            onChange={(e) => onChange(`${idx}.options`, e)}
                                            errors={errors?.[idx].options}
                                        />
                                    </Card>
                                </Col>
                            )}
                        </Row> */}

                        {/* <Space direction="vertical">
                            <Space></Space>

                            <Space>
                                <Space direction="vertical" size={3} style={{ flex: 1 }}>
                  <Text type="secondary">Title :</Text>
                  <Input size="small" status="error" style={{ width: 172 }} />
                  <Text type="danger">Title is required</Text>
                </Space>
                            </Space>
                        </Space> */}
                    </Panel>
                </Collapse>
            ))}

            <Dropdown menu={{ items }}>
                <Button size="small" type="primary" icon={<PlusOutlined />}>
                    Add field
                </Button>
            </Dropdown>
        </Space>
    )
}

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
                            <Input.Group compact style={{ width: '100%' }}>
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
                            </Input.Group>
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
