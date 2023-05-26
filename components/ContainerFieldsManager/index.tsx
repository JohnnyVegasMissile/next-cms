import { Button, Collapse, Dropdown, Space, Switch } from 'antd'
import { Typography } from 'antd'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import ContainerCreation, { ContainerFieldCreation } from '~/types/containerCreation'
import { ContainerFieldType } from '@prisma/client'
import { tempId } from '~/utilities'
import PopOptions from '~/components/PopOptions'
import FieldInputs from './FieldsInputs'
import { Dayjs } from 'dayjs'

const { Panel } = Collapse
const { Text } = Typography

const fieldOptions = [
    { label: 'Text', value: ContainerFieldType.STRING },
    { label: 'Date', value: ContainerFieldType.DATE },
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
    value: ContainerCreation<Dayjs>['fields']
    onChange(name: string, value: any): void
    errors: any[] | undefined
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
                position: value.length,
                metadatas: [],
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
                                <Text>
                                    <strong>
                                        {`${
                                            fieldOptions.find((e) => e.value === field.type)?.label
                                        } field : `}
                                    </strong>
                                    {field.name}
                                </Text>
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
                                <Button
                                    type="ghost"
                                    size="small"
                                    icon={<EllipsisOutlined rev={undefined} />}
                                />
                            </PopOptions>
                        }
                    >
                        <ContainerFields
                            field={field}
                            errors={errors?.[idx]}
                            onChange={(name, value) => onChange(`${idx}.${name}`, value)}
                        />
                    </Panel>
                </Collapse>
            ))}

            <Dropdown menu={{ items }} trigger={['click']}>
                <Button size="small" type="primary" icon={<PlusOutlined rev={undefined} />}>
                    Add field
                </Button>
            </Dropdown>
        </Space>
    )
}

interface ContainerFieldProps {
    field: ContainerFieldCreation<Dayjs>
    errors: any
    onChange(name: string, value: any): void
}

const ContainerFields = (props: ContainerFieldProps) => {
    const Component = FieldInputs[props.field.type]

    return <Component {...props} />
}

export default ContainerFieldsManager
