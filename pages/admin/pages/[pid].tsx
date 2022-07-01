import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import {
    // Breadcrumb,
    Input,
    Space,
    Button,
    // Select,
    Divider,
    Radio,
    Typography,
    Select,
    Card,
    Popover,
} from 'antd'
import {
    PlusOutlined,
    MinusOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    CloseOutlined,
} from '@ant-design/icons'
import get from 'lodash.get'
import kebabcase from 'lodash.kebabcase'
// import { Prisma } from '@prisma/client'
// import type { Page } from '@prisma/client'
import { editPage, postPage } from '../../../network/pages'
import type { FullPageEdit } from '../../../types'
import Blocks from '../../../blocks'

const { Title } = Typography

const forbidenSlugs = ['new', 'edit', 'delete', 'api', 'admin', 'not-found']

const initialValues: FullPageEdit = {
    title: '',
    slug: '',
    // sections: [],
    metadatas: [],
    published: true,
}

const validate = (values: FullPageEdit) => {
    let errors: any = {}

    if (!values.title) {
        errors.title = 'Required'
    }

    const splittedSlug = values.slug!.split('/')
    for (const slug of splittedSlug) {
        if (!slug) {
            errors.slug = 'Forbiden slug'
            break
        }
    }

    if (!values.slug) {
        errors.slug = 'Required'
    }

    if (forbidenSlugs.includes(values.slug!.split('/')[0])) {
        errors.slug = 'Forbiden slug'
    }

    return errors
}

const Admin = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { pid } = router.query

    const { values, errors, handleChange, handleSubmit, setValues } =
        useFormik<FullPageEdit>({
            initialValues,
            validate,
            onSubmit: async (values) => {
                console.log('1')
                setLoading(true)
                if (pid === 'create') {
                    await postPage(values)
                } else {
                    const id = pid as string

                    await editPage(id, values)
                }
                router.push('/admin/pages')
                setLoading(false)
            },
        })

    const isLockedPage = values.type === 'error' || values.type === 'home'

    useEffect(() => {
        const getPageInfos = async () => {
            if (pid === undefined) {
                return
            }
            if (pid !== 'create') {
                const data = await fetch(`/api/pages/${pid}`)

                if (!data.ok) router.push('/admin/pages')

                const page = await data.json()
                setValues(page)
            } else {
                setValues(initialValues)
            }
        }
        getPageInfos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid])

    const lastSlugIndex = get(values, 'slug', '')!.split('/').length - 1

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    const addSlug = () => {
        let newValue = [...get(values, 'slug', '')!.split('/')]
        newValue.splice(lastSlugIndex, 0, '')

        onHandleChange('slug', newValue.join('/'))
    }

    const removeSlug = () => {
        let newValue = [...get(values, 'slug', '')!.split('/')]
        newValue.splice(lastSlugIndex - 1, 1)

        onHandleChange('slug', newValue.join('/'))
    }

    const editSlug = (index: number, value: string) => {
        let newValue = [...get(values, 'slug', '')!.split('/')]
        newValue[index] = value

        onHandleChange('slug', newValue.join('/'))
    }

    const addSection = () => {
        handleChange({
            target: {
                name: 'sections',
                value: [
                    ...get(values, 'sections', []),
                    {
                        type: undefined,
                        position: get(values, 'sections', []).length,
                        content: '{}',
                    },
                ],
            },
        })
    }

    const removeSection = (index: number) => {
        let newValue = [...get(values, 'sections', [])]
        newValue.splice(index, 1)

        handleChange({ target: { name: 'sections', value: newValue } })
    }

    const SectionUp = (index: number) => {
        let newValue = [...get(values, 'sections', [])]
        const temp = newValue[index]
        newValue[index] = newValue[index - 1]
        newValue[index - 1] = temp

        handleChange({ target: { name: 'sections', value: newValue } })
    }

    const SectionDown = (index: number) => {
        let newValue = [...get(values, 'sections', [])]
        const temp = newValue[index]
        newValue[index] = newValue[index + 1]
        newValue[index + 1] = temp

        handleChange({ target: { name: 'sections', value: newValue } })
    }

    const addMetadata = () => {
        handleChange({
            target: {
                name: 'metadatas',
                value: [...get(values, 'metadatas', []), { name: '', content: '' }],
            },
        })
    }

    const removeMetadata = (index: number) => {
        let newValue = [...get(values, 'metadatas', [])]
        newValue.splice(index, 1)

        handleChange({ target: { name: 'metadatas', value: newValue } })
    }

    if (loading || pid === undefined) {
        return <div>Loading...</div>
    }

    return (
        <form onSubmit={handleSubmit}>
            <Space
                direction="vertical"
                size="large"
                style={{ width: '100%', padding: 15 }}
            >
                <Space direction="vertical" size={0} style={{ width: '100%' }}>
                    <Title level={5}>Title</Title>
                    <Input
                        value={get(values, 'title', '')}
                        onChange={(e) => {
                            onHandleChange('title', e.target.value)

                            if (pid === 'create') {
                                let newValue = [...get(values, 'slug', '')!.split('/')]
                                newValue[lastSlugIndex] = kebabcase(e.target.value)

                                onHandleChange('slug', newValue.join('/'))
                            }
                        }}
                    />

                    <Divider />

                    <Select
                        value={values.type}
                        style={{ width: 200 }}
                        disabled={pid !== 'create'}
                        onChange={(e) => onHandleChange('type', e)}
                    >
                        <Select.Option value="page">Page</Select.Option>
                        <Select.Option value="list">List</Select.Option>
                        {isLockedPage && (
                            <>
                                <Select.Option value="error" disabled>
                                    Not found
                                </Select.Option>
                                <Select.Option value="home" disabled>
                                    Homepage
                                </Select.Option>
                            </>
                        )}
                    </Select>

                    <Divider />

                    <Title level={5}>Status</Title>
                    <Radio.Group
                        value={values.published}
                        onChange={(e) => onHandleChange('published', e.target.value)}
                        disabled={pid !== 'create' && isLockedPage}
                    >
                        <Radio value={true}>Published</Radio>
                        <Radio value={false}>Unpublished</Radio>
                    </Radio.Group>

                    <Divider />

                    <Title level={5}>Meta Datas</Title>
                    <Space direction="vertical">
                        {get(values, 'metadatas', []).map(
                            (metadata: any, index: number) => (
                                <Space key={index}>
                                    <Select
                                        style={{ width: 200 }}
                                        value={metadata.name}
                                        onChange={(e) =>
                                            onHandleChange(`metadatas.${index}.name`, e)
                                        }
                                    >
                                        <Select.Option value="application-name">
                                            Application name
                                        </Select.Option>
                                        <Select.Option value="author">
                                            Author
                                        </Select.Option>
                                        <Select.Option value="description">
                                            Description
                                        </Select.Option>
                                        <Select.Option value="generator">
                                            Generator
                                        </Select.Option>
                                        <Select.Option value="keywords">
                                            Keywords
                                        </Select.Option>
                                        <Select.Option value="viewport">
                                            Viewport
                                        </Select.Option>
                                    </Select>
                                    <Input
                                        value={metadata.content}
                                        onChange={(e) =>
                                            onHandleChange(
                                                `metadatas.${index}.content`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Button
                                        onClick={() => removeMetadata(index)}
                                        type="primary"
                                        shape="circle"
                                        icon={<MinusOutlined />}
                                    />
                                </Space>
                            )
                        )}
                        <Button
                            onClick={addMetadata}
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                        />
                    </Space>

                    <Divider />

                    <Title level={5}>Header</Title>

                    <Divider />

                    {!isLockedPage && (
                        <>
                            <Title level={5}>Page URL</Title>
                            <Space style={{ width: '100%' }}>
                                {get(values, 'slug', '')!
                                    .split('/')
                                    .map((slug: string, idx: number) => (
                                        <Fragment key={idx}>
                                            {idx === lastSlugIndex && (
                                                <>
                                                    <Button
                                                        onClick={removeSlug}
                                                        type="primary"
                                                        shape="circle"
                                                        disabled={
                                                            get(
                                                                values,
                                                                'slug',
                                                                ''
                                                            )!.split('/').length < 2
                                                        }
                                                        icon={<MinusOutlined />}
                                                    />
                                                    <Button
                                                        onClick={addSlug}
                                                        type="primary"
                                                        shape="circle"
                                                        icon={<PlusOutlined />}
                                                    />
                                                </>
                                            )}
                                            <Input
                                                value={slug}
                                                onChange={(e) =>
                                                    editSlug(idx, e.target.value)
                                                }
                                                status={errors.slug ? 'error' : undefined}
                                            />
                                            {lastSlugIndex !== idx && '/'}
                                        </Fragment>
                                    ))}
                            </Space>
                        </>
                    )}
                    <Divider />

                    <Title level={5}>Page content</Title>

                    <Space direction="vertical" style={{ width: '100%' }}>
                        {get(values, 'sections', []).map((section, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: 8 }}>
                                <Space direction="vertical">
                                    <Button
                                        disabled={idx === 0}
                                        onClick={() => SectionUp(idx)}
                                        type="primary"
                                        shape="circle"
                                        icon={<CaretUpOutlined />}
                                    />
                                    <Button
                                        disabled={
                                            idx === get(values, 'sections', []).length - 1
                                        }
                                        onClick={() => SectionDown(idx)}
                                        type="primary"
                                        shape="circle"
                                        icon={<CaretDownOutlined />}
                                    />
                                </Space>
                                <Card
                                    bodyStyle={{ padding: 0 }}
                                    title={
                                        <Select
                                            value={section.type}
                                            onChange={(e) =>
                                                onHandleChange(`sections.${idx}.type`, e)
                                            }
                                            style={{ width: 250 }}
                                        >
                                            {Object.keys(Blocks).map((key) => (
                                                <Select.Option
                                                    key={key}
                                                    value={key}
                                                    disabled={
                                                        !get(
                                                            Blocks,
                                                            `${key}.pages`,
                                                            []
                                                        ).includes(values.type)
                                                    }
                                                >
                                                    {/* <Popover
                                                        content={
                                                            <img
                                                                src={
                                                                    'https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png'
                                                                }
                                                            />
                                                        }
                                                    > */}
                                                    {get(Blocks, `${key}.name`, '')}
                                                    {/* </Popover> */}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    }
                                    extra={
                                        <Button
                                            // type="primary"
                                            onClick={() => removeSection(idx)}
                                            danger
                                            shape="circle"
                                            icon={<CloseOutlined />}
                                        />
                                    }
                                    style={{ flex: 1 }}
                                >
                                    <GetEditComponent
                                        type={section.type}
                                        defaultValues={section.content}
                                        onChange={(e) =>
                                            onHandleChange(`sections.${idx}.content`, e)
                                        }
                                    />
                                </Card>
                            </div>
                        ))}
                        <Button
                            onClick={addSection}
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                        />
                    </Space>
                    <Divider />

                    <Title level={5}>Footer</Title>

                    <Divider />
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Space>
            </Space>
        </form>
    )
}

interface GetEditComponentProps {
    type: string
    defaultValues: any
    onChange: (value: any) => void
}

const GetEditComponent = ({ type, defaultValues, onChange }: GetEditComponentProps) => {
    if (!type) return null

    const Component = get(Blocks, type, () => null)

    return <Component.Edit defaultValues={defaultValues} onChange={onChange} />
}

Admin.requireAuth = true

export default Admin
