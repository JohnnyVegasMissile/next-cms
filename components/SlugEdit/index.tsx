import { Button, Form, Input, Space } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Fragment } from 'react'
import { useQuery } from '@tanstack/react-query'
import { slugExist } from '~/network/slugs'
import styles from './SlugEdit.module.scss'

const MAX_SLUG_SIZE = 3

interface SlugEditProps {
    value: string[]
    onChange(value: string[]): void
    errors: string[] | undefined
    paramsId?:
        | {
              pageId: string
          }
        | {
              containerId: string
          }
        | {
              contentId: string
          }
}

const SlugEdit = ({ value, onChange, errors, paramsId }: SlugEditProps) => {
    const slugExists = useQuery(
        ['slug-exists', { slug: value.join('/'), ...paramsId }],
        () => slugExist(value.filter((e) => !!e).join('/'), paramsId),
        {
            enabled: !!value.filter((e) => !!e).length,
        }
    )

    const lastSlugIndex = value.length - 1

    const addSlug = () => {
        let newValue = [...value]
        newValue.splice(lastSlugIndex, 0, '')

        onChange(newValue)
    }

    const removeSlug = () => {
        let newValue = [...value]
        newValue.splice(lastSlugIndex - 1, 1)

        onChange(newValue)
    }

    const onSlugChange = (index: number, slug: string) => {
        let newValue = [...value]
        newValue[index] = slug

        onChange(newValue)
    }

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                gap: '0.25rem',
                flexWrap: 'wrap',
            }}
        >
            {value.map((slug, idx) => (
                <Fragment key={idx}>
                    {idx === lastSlugIndex ? (
                        <>
                            <Space.Compact size="small" style={{ width: 'fit-content' }}>
                                <Button
                                    size="small"
                                    onClick={removeSlug}
                                    icon={<MinusOutlined />}
                                    disabled={value.length < 2}
                                />
                                <Button
                                    size="small"
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={addSlug}
                                    disabled={value.length > MAX_SLUG_SIZE}
                                />
                            </Space.Compact>
                            <Form.Item
                                className={styles['form-item']}
                                hasFeedback
                                validateStatus={
                                    !value.filter((e) => !!e).length || slugExists.isError
                                        ? undefined
                                        : slugExists.isFetching
                                        ? 'validating'
                                        : slugExists.data?.exist
                                        ? 'error'
                                        : 'success'
                                }
                                style={{ flex: 1, maxWidth: 180, minWidth: 150, margin: 0 }}
                            >
                                <Input
                                    size="small"
                                    style={{ flex: 1, maxWidth: 180, minWidth: 150 }}
                                    status={errors?.[idx] ? 'error' : undefined}
                                    value={slug}
                                    onChange={(e) => onSlugChange(idx, e.target.value)}
                                />
                            </Form.Item>
                        </>
                    ) : (
                        <div>
                            <Input
                                size="small"
                                style={{ flex: 1, maxWidth: 180, minWidth: 100 }}
                                status={errors?.[idx] ? 'error' : undefined}
                                // style={{
                                //   minWidth: 200,
                                // }}
                                value={slug}
                                onChange={(e) => onSlugChange(idx, e.target.value)}
                            />
                        </div>
                    )}

                    {lastSlugIndex - 1 > idx && '/'}
                </Fragment>
            ))}
        </div>
    )
}

export default SlugEdit
