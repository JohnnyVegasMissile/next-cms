'use client'

import {
    Button,
    Card,
    Col,
    Row,
    Input,
    Space,
    Typography,
    Switch,
    Collapse,
    InputNumber,
    Popover,
    Divider,
    Popconfirm,
    Checkbox,
    Select,
    Radio,
} from 'antd'
import {
    CaretUpOutlined,
    CaretDownOutlined,
    PlusOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    CheckOutlined,
} from '@ant-design/icons'
import { useFormik } from 'formik'

const { Text } = Typography
const { Panel } = Collapse

type Form = {
    title: string
    redirectMail: boolean
    mailToRedirect?: string
    hasExtraData: boolean
    extraData?: any
    fields: {
        line: number
        position: number
        label: string
        type: string
        required: boolean
    }[]
}

const initialField = {
    line: 1,
}

const initialValues: Form = {
    title: '',
    redirectMail: false,
    hasExtraData: false,
    fields: [],
}

const validate = (values: Form) => {
    let errors: any = {}

    if (!values.title) {
        errors.title = 'Title is required'
    }

    return errors
}

const Settings = () => {
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

    return (
        <>
            <Card
                title="Details"
                size="small"
                extra={
                    <Button size="small" type="primary" icon={<CheckOutlined />}>
                        Save form
                    </Button>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
                            <Space direction="vertical" size={3} style={{ flex: 1 }}>
                                <Text type="secondary">Title :</Text>
                                <Input
                                    size="small"
                                    // status={!!formik.errors.title ? "error" : undefined}
                                    style={{ width: '100%' }}
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                />
                                <Text type="danger"></Text>
                            </Space>
                            <Space direction="vertical" size={3} style={{ flex: 1 }}>
                                <Space>
                                    <Text type="secondary">Send to :</Text>
                                    <Switch size="small" />
                                </Space>

                                <Input
                                    size="small"
                                    // status={!!formik.errors.title ? "error" : undefined}
                                    style={{ width: '100%' }}
                                    name="title"
                                    // value={formik.values.title}
                                    // onChange={formik.handleChange}
                                />
                                <Text type="danger"></Text>
                            </Space>
                        </div>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Space direction="vertical" size={3} style={{ width: '100%' }}>
                            <Text type="secondary">Success message :</Text>
                            <Input.TextArea rows={4} />
                            <Text type="danger"></Text>
                        </Space>
                    </Col>
                    <Col span={12}>
                        <Space direction="vertical" size={3} style={{ width: '100%' }}>
                            <Text type="secondary">Error message :</Text>
                            <Input.TextArea rows={4} />
                            <Text type="danger"></Text>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[16, 16]}>
                <Col span={18}>
                    <Card title="Fields" size="small">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {formik.values.fields.map((_, idx) => (
                                <Collapse key={`field=${idx}`} size="small" style={{ flex: 1 }}>
                                    <Panel
                                        header={
                                            <Space>
                                                <Text strong>Text field: </Text>
                                                <Text>Name</Text>
                                            </Space>
                                        }
                                        key="1"
                                        extra={
                                            <Space>
                                                <Text type="secondary">Line: </Text>
                                                <span onClick={(e) => e.stopPropagation()}>
                                                    <InputNumber
                                                        min={0}
                                                        size="small"
                                                        bordered={false}
                                                        placeholder="Line nb"
                                                    />
                                                </span>

                                                <Divider type="vertical" style={{ margin: 0 }} />
                                                <Popover
                                                    placement="bottom"
                                                    arrow={false}
                                                    content={
                                                        <Space direction="vertical">
                                                            <Button
                                                                size="small"
                                                                onClick={(e) => e.stopPropagation()}
                                                                icon={<CaretUpOutlined />}
                                                                type="primary"
                                                            />
                                                            <Button
                                                                size="small"
                                                                onClick={(e) => e.stopPropagation()}
                                                                icon={<CaretDownOutlined />}
                                                                type="primary"
                                                            />
                                                            <Divider style={{ margin: 0 }} />

                                                            <Popconfirm
                                                                placement="left"
                                                                title="Delete the task"
                                                                description="Are you sure to delete this task?"
                                                                onConfirm={(e) => e?.stopPropagation()}
                                                                onCancel={(e) => e?.stopPropagation()}
                                                                okText="Delete"
                                                                cancelText="Cancel"
                                                            >
                                                                <Button
                                                                    size="small"
                                                                    icon={<DeleteOutlined />}
                                                                    danger
                                                                    type="primary"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </Popconfirm>
                                                        </Space>
                                                    }
                                                    trigger="click"
                                                >
                                                    <Button
                                                        type="ghost"
                                                        onClick={(e) => e.stopPropagation()}
                                                        size="small"
                                                        icon={<EllipsisOutlined />}
                                                    />
                                                </Popover>
                                            </Space>
                                        }
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col span={8}>
                                                <Space
                                                    direction="vertical"
                                                    size={3}
                                                    style={{ width: '100%' }}
                                                >
                                                    <Text type="secondary">Title :</Text>
                                                    <Input
                                                        size="small"
                                                        // status={!!formik.errors.title ? "error" : undefined}
                                                        style={{ width: '100%' }}
                                                        name="title"
                                                        value={formik.values.title}
                                                        onChange={formik.handleChange}
                                                    />
                                                    <Text type="danger"></Text>
                                                </Space>
                                            </Col>
                                            <Col span={8}>
                                                <Space
                                                    direction="vertical"
                                                    size={3}
                                                    style={{ width: '100%' }}
                                                >
                                                    <Text type="secondary">Placeholder :</Text>
                                                    <Input
                                                        size="small"
                                                        // status={!!formik.errors.title ? "error" : undefined}
                                                        style={{ width: '100%' }}
                                                        name="title"
                                                        value={formik.values.title}
                                                        onChange={formik.handleChange}
                                                    />
                                                    <Text type="danger"></Text>
                                                </Space>
                                            </Col>
                                            <Col span={8}>
                                                <Space
                                                    direction="vertical"
                                                    size={3}
                                                    style={{ width: '100%' }}
                                                >
                                                    <Text type="secondary">Required :</Text>
                                                    <Radio.Group
                                                        onChange={(e) =>
                                                            formik.setFieldValue(`fields.${idx}.required`, e)
                                                        }
                                                        value={formik.values.fields[idx]?.required}
                                                    >
                                                        <Radio value={true}>Required</Radio>
                                                        <Radio value={false}>Not Required</Radio>
                                                    </Radio.Group>
                                                    <Text type="danger"></Text>
                                                </Space>
                                            </Col>
                                        </Row>

                                        <Divider />

                                        <Row gutter={[16, 16]}>
                                            <Col span={8}>
                                                <Space
                                                    direction="vertical"
                                                    size={3}
                                                    style={{ width: '100%' }}
                                                >
                                                    <Text type="secondary">Type :</Text>
                                                    <Select
                                                        size="small"
                                                        value={formik.values.title}
                                                        onChange={(e) => formik.setFieldValue('type', e)}
                                                        options={[{ value: 'text', label: 'Text' }]}
                                                        style={{ width: '100%' }}
                                                    />
                                                    <Text type="danger"></Text>
                                                </Space>
                                            </Col>
                                            <Col span={8}>
                                                <Card title="Options" size="small">
                                                    <Space style={{ width: '100%' }} direction="vertical">
                                                        <Space style={{ width: '100%' }}>
                                                            <Space.Compact
                                                                size="small"
                                                                style={{ width: '100%' }}
                                                            >
                                                                <Input
                                                                    size="small"
                                                                    style={{ width: 'calc(50% - 24px /2)' }}
                                                                    placeholder="Label"
                                                                />
                                                                <Input
                                                                    size="small"
                                                                    style={{ width: 'calc(50% - 24px /2)' }}
                                                                    placeholder="Value"
                                                                />
                                                                <Button
                                                                    size="small"
                                                                    icon={<PlusOutlined />}
                                                                    type="primary"
                                                                    danger
                                                                />
                                                            </Space.Compact>
                                                        </Space>
                                                        <Button
                                                            size="small"
                                                            type="primary"
                                                            icon={<PlusOutlined />}
                                                        >
                                                            Add option
                                                        </Button>
                                                    </Space>
                                                </Card>
                                            </Col>
                                            <Col span={8}>
                                                <Space
                                                    direction="vertical"
                                                    size={3}
                                                    style={{ width: '100%' }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        <Text style={{ flex: 1 }} type="secondary">
                                                            Min :
                                                        </Text>
                                                        <Text style={{ flex: 1 }} type="secondary">
                                                            Max :
                                                        </Text>
                                                    </div>
                                                    <Space.Compact size="small" style={{ width: '100%' }}>
                                                        <InputNumber
                                                            size="small"
                                                            style={{ width: '50%' }}
                                                            placeholder="Min"
                                                            min={0}
                                                        />
                                                        <InputNumber
                                                            size="small"
                                                            style={{ width: '50%' }}
                                                            placeholder="Max"
                                                        />
                                                    </Space.Compact>
                                                </Space>
                                            </Col>
                                            <Col span={8}>
                                                <Space
                                                    direction="vertical"
                                                    size={3}
                                                    style={{ width: '100%' }}
                                                >
                                                    <Text type="secondary">Default :</Text>
                                                    <Input
                                                        size="small"
                                                        // status={!!formik.errors.title ? "error" : undefined}
                                                        style={{ width: '100%' }}
                                                        name="title"
                                                        value={formik.values.title}
                                                        onChange={formik.handleChange}
                                                    />
                                                    <Text type="danger"></Text>
                                                </Space>
                                            </Col>
                                        </Row>
                                    </Panel>
                                </Collapse>
                            ))}

                            <Button
                                size="small"
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    formik.setFieldValue('fields', [...formik.values.fields, initialField])
                                }}
                            >
                                Add field
                            </Button>
                        </Space>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card
                        size="small"
                        title={
                            <Space>
                                <Checkbox
                                    checked={formik.values.hasExtraData}
                                    onChange={() =>
                                        formik.setFieldValue('hasExtraData', !formik.values.hasExtraData)
                                    }
                                />
                                <Text>Extra data :</Text>
                            </Space>
                        }
                        bodyStyle={{ padding: !formik.values.hasExtraData ? 0 : undefined }}
                    ></Card>
                </Col>
            </Row>
        </>
    )
}

export default Settings
