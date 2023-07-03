import { FormButtonType, FormFieldType } from '@prisma/client'
import { Button, Space, Typography, Collapse, InputNumber, Divider, Dropdown } from 'antd'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import FormCreation, { FormFieldCreation } from '~/types/formCreation'
import FieldInputs from './FieldsInputs'
import { tempId } from '~/utilities'
import PopOptions from '../PopOptions'

const { Text } = Typography
const { Panel } = Collapse

interface FormFieldsManagerProps {
    value: FormCreation['fields']
    onChange(name: string, value: any): void
    errors: any[] | undefined
}

const KEYS = {
    [FormFieldType.TITLE]: { label: 'Title', default: {} },
    [FormFieldType.TEXT]: { label: 'Text', default: { required: true } },
    [FormFieldType.NUMBER]: { label: 'Number', default: { required: true } },
    [FormFieldType.EMAIL]: { label: 'Email', default: { required: true } },
    [FormFieldType.PASSWORD]: { label: 'Password', default: { required: true } },
    [FormFieldType.PARAGRAPH]: { label: 'Paragraph', default: { required: true } },
    [FormFieldType.OPTION]: { label: 'Option', default: { required: true } },
    [FormFieldType.CHECKBOX]: { label: 'Checkbox', default: {} },
    [FormFieldType.MULTICHECKBOX]: { label: 'Multi checkbox', default: { required: true } },
    [FormFieldType.RADIO]: { label: 'Radio', default: { required: true } },
    [FormFieldType.BUTTON]: { label: 'Button', default: { buttonType: FormButtonType.SUBMIT } },
    [FormFieldType.CONTENT]: { label: 'Content', default: { required: true } },
}

const FormFieldsManager = ({ value, onChange, errors }: FormFieldsManagerProps) => {
    const onClick = (type: FormFieldType) =>
        onChange('', [
            ...value,
            { type, tempId: tempId(), position: value.length, line: value.length, ...KEYS[type].default },
        ])

    const items = Object.keys(KEYS).map((key: any) => ({
        key,
        label: KEYS[key as FormFieldType].label,
        onClick: () => onClick(key),
    }))

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {value.map((field, idx) => (
                <Collapse
                    key={idx}
                    size="small"
                    style={{ flex: 1 }}
                    defaultActiveKey={field.tempId ? ['1'] : undefined}
                >
                    <Panel
                        key="1"
                        header={
                            <Text strong>
                                {KEYS[field.type].label} field: {field.label}
                            </Text>
                        }
                        extra={
                            <Space>
                                <Text type="secondary">Line: </Text>
                                <span onClick={(e) => e.stopPropagation()}>
                                    <InputNumber
                                        min={1}
                                        size="small"
                                        bordered={false}
                                        placeholder="Line nb"
                                    />
                                </span>
                                <Divider type="vertical" style={{ margin: 0 }} />
                                <PopOptions
                                    onUp={() => {}}
                                    disableUp={idx === 0}
                                    onDown={() => {}}
                                    disableDown={idx === value.length - 1}
                                    onDelete={() => {}}
                                    alert={!!field.id}
                                >
                                    <Button type="ghost" size="small" icon={<EllipsisOutlined />} />
                                </PopOptions>
                            </Space>
                        }
                    >
                        <FormFields
                            field={field}
                            errors={errors?.[idx]}
                            onChange={(name, value) => onChange(`${idx}.${name}`, value)}
                        />
                    </Panel>
                </Collapse>
            ))}

            <Dropdown menu={{ items }} trigger={['click']}>
                <Button size="small" type="primary" icon={<PlusOutlined />}>
                    Add field
                </Button>
            </Dropdown>
        </Space>
    )
}

interface ContainerFieldProps {
    field: FormFieldCreation
    errors: any
    onChange(name: string, value: any): void
}

const FormFields = (props: ContainerFieldProps) => {
    const Component = FieldInputs[props.field.type]

    return <Component {...props} />
}

export default FormFieldsManager
