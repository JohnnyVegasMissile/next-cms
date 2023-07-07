import { Button, Divider, Input, Select, Space, Typography } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Fragment, useMemo } from 'react'
import LinkSelect, { LinkValue } from '~/components/LinkSelect'
import PageCreation from '~/types/pageCreation'
import {
    general,
    formatDetection,
    openGraph,
    icons,
    twitter,
    iTunes,
    appleWebApp,
    appLinks,
} from './metadataLists'
import { tempId } from '~/utilities'
import set from 'lodash.set'
import MediaModal from '../MediaModal'
import { Media, MediaType } from '@prisma/client'

const { Text } = Typography

interface MetadatasListProps {
    name: string
    value: PageCreation['metadatas']
    onChange(e: any): void
    errors: string[]
}

const initialMetadata = {
    tempId: tempId(),
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

    const handleRemove = (idx: number) => {
        const newMeta = [...value]
        newMeta.splice(idx, 1)
        onChange({ target: { name, value: newMeta } })
    }

    return (
        <Space style={{ width: '100%' }} direction="vertical">
            {value?.map((meta, idx) => (
                <MetaInput
                    key={`${name}-${idx}`}
                    types={meta.types}
                    onTypeChange={(e) => handleChange(idx, e, 'types')}
                    values={meta.values}
                    onValuesChange={(e) => handleChange(idx, e, 'values')}
                    errors={errors?.[idx] as any}
                    onDelete={() => handleRemove(idx)}
                />
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

interface MetaInputProps {
    types: string[] | undefined
    onTypeChange(value: string[]): void
    values: (string | number | boolean | LinkValue | Media)[]
    onValuesChange(value: (string | number | boolean | LinkValue | Media)[]): void
    errors: string[]
    onDelete(): void
}

const MetaInput = ({ types, onTypeChange, values, onValuesChange, errors, onDelete }: MetaInputProps) => {
    const element = useMemo(() => {
        const options = [
            ...general,
            ...formatDetection,
            ...openGraph,
            ...icons,
            ...twitter,
            ...iTunes,
            ...appleWebApp,
            ...appLinks,
        ]

        const option = options.find((e) => e.value === types?.[0])

        const onValueChange = (index: number, value: string | LinkValue | Media | number | boolean) => {
            const newContent = [...(values || [])]
            set(newContent, index, value)
            onValuesChange(newContent)
        }

        return (
            <Space.Compact size="small" style={{ width: '100%' }}>
                {option?.type?.map((t: string, idx: number) => (
                    <Fragment key={idx}>
                        {/* <Tooltip
                            key={idx}
                            title={errors?.[idx]}
                            color="red"
                        > */}
                        {t === 'string' && (
                            <Input
                                size="small"
                                style={{ width: `calc(${100 / option?.type.length}%)` }}
                                value={values?.[idx] as string}
                                onChange={(e) => onValueChange(idx, e.target.value)}
                                status={errors?.[idx] ? 'error' : undefined}
                            />
                        )}
                        {t === 'image' && (
                            <MediaModal
                                mediaType={MediaType.IMAGE}
                                value={values?.[idx] as Media}
                                onChange={(e) => onValueChange(idx, e)}
                            />
                        )}
                        {t === 'boolean' && (
                            <Select
                                size="small"
                                maxTagCount="responsive"
                                style={{ width: `calc(${100 / option?.type.length}%)` }}
                                value={values?.[idx] as string}
                                onChange={(e) => onValueChange(idx, e)}
                                status={errors?.[idx] ? 'error' : undefined}
                                options={[
                                    { value: true, label: 'Yes' },
                                    { values: false, label: 'No' },
                                ]}
                            />
                        )}
                        {t === 'link' && (
                            <LinkSelect
                                value={values?.[idx] as LinkValue}
                                onChange={(e) => onValueChange(idx, e)}
                            />
                        )}
                        {t === 'option' && (
                            <Select
                                size="small"
                                maxTagCount="responsive"
                                style={{ width: `calc(${100 / option?.type.length}%)` }}
                                value={values?.[idx] as string}
                                onChange={(e) => onValueChange(idx, e)}
                                status={errors?.[idx] ? 'error' : undefined}
                            />
                        )}
                        {/* </Tooltip> */}
                    </Fragment>
                ))}
            </Space.Compact>
        )

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [types])

    const options = useMemo(() => {
        const options = [
            ...general,
            ...formatDetection,
            ...openGraph,
            ...icons,
            ...twitter,
            ...iTunes,
            ...appleWebApp,
            ...appLinks,
        ]

        const option = options.find((e) => e.value === types?.[0])

        const checkIfDisable = (e: any) => {
            const hasValue = !!types && !!types.length
            const isChoosenOption = hasValue && types?.includes(e?.value)
            const isOptionSelected = hasValue && option?.type?.includes('option')
            const isMatchingType = !!option && e?.type.join(',') !== option?.type.join(',')

            return { ...e, disabled: isChoosenOption ? false : isOptionSelected ? true : isMatchingType }
        }

        return [
            { label: 'General', options: general.map(checkIfDisable) },
            { label: 'Format detection', options: formatDetection.map(checkIfDisable) },
            { label: 'Open graph', options: openGraph.map(checkIfDisable) },
            { label: 'Icons', options: icons.map(checkIfDisable) },
            { label: 'Twitter', options: twitter.map(checkIfDisable) },
            { label: 'ITunes', options: iTunes.map(checkIfDisable) },
            { label: 'Apple web app', options: appleWebApp.map(checkIfDisable) },
            { label: 'App links', options: appLinks.map(checkIfDisable) },
        ]
    }, [types])

    return (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                <div style={{ width: 45 }}>
                    <Text type="secondary">Type :</Text>
                </div>
                <Space.Compact size="small" style={{ width: '100%', flex: 1 }}>
                    <Select
                        allowClear
                        size="small"
                        style={{ width: 'calc(100% - 24px)' }}
                        mode="multiple"
                        maxTagCount="responsive"
                        value={types}
                        onChange={onTypeChange}
                        options={options}
                    />
                    <Button size="small" type="primary" danger icon={<DeleteOutlined />} onClick={onDelete} />
                </Space.Compact>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
                <div style={{ width: 45 }}>
                    <Text type="secondary">Value :</Text>
                </div>
                <div style={{ flex: 1 }}>{element}</div>
            </div>

            <Divider style={{ margin: 0 }} />
        </Space>
    )
}
