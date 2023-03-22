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
import ContainerCreation, { ContainerFieldCreation } from '~/types/containerCreation'
import SlugEdit from '~/components/SlugEdit'
import { ContainerFieldType } from '@prisma/client'
import { Options } from '~/types'
import { tempId } from '~/utilities'
import PopOptions from '~/components/PopOptions'
import WithLabel from '~/components/WithLabel'

const { Panel } = Collapse
const { Text } = Typography

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

const ContainerFieldsManager = ({ value, onChange, errors }: ContainerFieldsProps) => {
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
                        <ContainerFields
                            field={field}
                            onChange={(name, value) => onChange(`${idx}.${name}`, value)}
                        />
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

interface ContainerFieldProps {
    field: ContainerFieldCreation
    onChange(name: string, value: any): void
}

const ContainerFields = ({ field, onChange }: ContainerFieldProps) => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <WithLabel
                        label={
                            <Space>
                                <Text type="secondary">Name :</Text>

                                <Switch
                                    size="small"
                                    checked={field.required}
                                    onChange={(e) => onChange('required', e)}
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
                            onChange={(e) => onChange('name', e.target.value)}
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
        </>
    )
}

export default ContainerFieldsManager
