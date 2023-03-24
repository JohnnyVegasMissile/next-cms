import { Button, Input, Select, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import PageCreation from '~/types/pageCreation'

const { Text } = Typography

interface MetadatasListProps {
    name: string
    value: PageCreation['metadatas']
    onChange(e: any): void
    errors: string[]
}

const initialMetadata = {
    name: 'description',
    content: '',
}

const MetadatasList = ({ name, value, onChange, errors }: MetadatasListProps) => {
    const handleChange = (index: number, value: any, nameField?: string) => {
        onChange({
            target: {
                name: `${name}.${index}${nameField ? `.${nameField}` : ''}`,
                value,
            },
        })
    }

    const handleNameChange = (idx: number, newValue: string) => {
        if (!value?.[idx]?.content) {
            handleChange(idx, newValue === 'keywords' ? [] : '', 'content')
        } else {
            if (newValue === 'keywords' && !!value?.[idx]?.content) {
                handleChange(idx, (value?.[idx]?.content as string).split(', '), 'content')
            } else if (value?.[idx]?.name === 'keywords' && !!value?.[idx]?.content) {
                handleChange(idx, (value?.[idx]?.content as string[]).join(', '), 'content')
            }
        }

        handleChange(idx, newValue, 'name')
    }

    const handleRemove = (idx: number) => {
        const newMeta = [...value]

        newMeta.splice(idx, 1)

        onChange({
            target: {
                name,
                value: newMeta,
            },
        })
    }

    return (
        <Space style={{ width: '100%' }} direction="vertical">
            {!!value.length && (
                <div style={{ display: 'flex' }}>
                    <Text type="secondary" style={{ width: '30%' }}>
                        Type:
                    </Text>
                    <Text type="secondary">Value:</Text>
                </div>
            )}
            {value.map((meta, idx) => (
                <Space.Compact key={`${name}-${idx}`} size="small" style={{ width: '100%' }}>
                    <Select
                        size="small"
                        style={{ width: '30%' }}
                        value={meta.name}
                        onChange={(e) => handleNameChange(idx, e)}
                        options={[
                            { value: 'description', label: 'Description' },
                            { value: 'keywords', label: 'Keywords' },
                            { value: 'author', label: 'Author' },
                            { value: 'viewport', label: 'Viewport' },
                        ]}
                    />

                    <Tooltip title={errors?.[idx]} color="red">
                        {meta.name === 'keywords' ? (
                            <Select
                                size="small"
                                mode="tags"
                                maxTagCount="responsive"
                                style={{ width: 'calc(100% - 24px - 30%)' }}
                                value={meta.content as string[]}
                                onChange={(e) => handleChange(idx, e, 'content')}
                                tokenSeparators={[',']}
                                status={errors?.[idx] ? 'error' : undefined}
                            />
                        ) : (
                            <Input
                                size="small"
                                style={{ width: 'calc(100% - 24px - 30%)' }}
                                value={meta.content as string}
                                name={`${name}.${idx}.content`}
                                onChange={onChange}
                                status={errors?.[idx] ? 'error' : undefined}
                            />
                        )}
                    </Tooltip>

                    <Button
                        size="small"
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(idx)}
                    />
                </Space.Compact>
            ))}

            <Button
                size="small"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleChange(value.length, initialMetadata)}
            >
                Add metadata
            </Button>
        </Space>
    )
}

export default MetadatasList
