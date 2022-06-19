import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import {
    Breadcrumb,
    Input,
    Space,
    Button,
    Select,
    Divider,
    Radio,
    Typography,
} from 'antd'
import { PlusOutlined, MinusOutlined, CheckOutlined } from '@ant-design/icons'
import get from 'lodash.get'
import kebabcase from 'lodash.kebabcase'
import { Prisma } from '@prisma/client'
import type { Page } from '@prisma/client'

const { Title } = Typography

const forbidenSlugs = ['new', 'edit', 'delete', 'api', 'admin']

// interface ElementType {
//         type: string;
//         section?: Prisma.SectionCreateNestedOneWithoutElementInput | undefined;
//         fields?: Prisma.FieldCreateNestedManyWithoutElementInput | undefined;
//         content?: string | ... 1 more ... | undefined;
//         updatedAt?: string | ... 1 more ... | undefined;
// }

// interface SectionType {
//     block: string;
//     page: Prisma.PageCreateNestedOneWithoutSectionsInput;
//     element?: Prisma.ElementCreateNestedManyWithoutSectionInput | undefined;
//     position: number
//     content?: string
// }

// interface MetadataType {
//     name: string;
//     content: string;
// }

interface PageType {
    title: string
    slug: string
    // sections?: SectionType[];
    // metadatas?: MetadataType[];
    published: boolean
    homepage?: boolean
}

const initialValues: PageType = {
    title: '',
    slug: '',
    // sections: [],
    // metadatas: [],
    published: true,
}

const validate = (values: PageType) => {
    let errors: any = {}

    if (!values.title) {
        errors.title = 'Required'
    }

    if (!values.slug) {
        errors.slug = 'Required'
    }

    if (forbidenSlugs.includes(values.slug.split('/')[0])) {
        errors.slug = 'Forbiden slug'
    }

    return errors
}

const Admin = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { pid } = router.query

    const { values, errors, handleChange, handleSubmit, setValues } = useFormik(
        {
            initialValues,
            validate,
            onSubmit: async (values) => {
                setLoading(true)
                if (pid === 'create') {
                    await fetch('/api/pages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(values),
                    })
                } else {
                    await fetch(`/api/pages/${pid}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(values),
                    })
                }
                router.push('/admin/pages')
                setLoading(false)
            },
        }
    )

    useEffect(() => {
        const getPageInfos = async () => {
            if (pid !== 'create' && pid !== undefined) {
                const data = await fetch(`/api/pages/${pid}`)

                if (!data.ok) router.push('/admin/pages')

                const page: Page = await data.json()
                setValues(page)
            }
        }
        getPageInfos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid])

    const lastSlugIndex = get(values, 'slug', '').split('/').length - 1

    const addSlug = () => {
        let newValue = [...get(values, 'slug', '').split('/')]
        newValue.splice(lastSlugIndex, 0, '')

        handleChange({
            target: {
                name: 'slug',
                value: newValue.join('/'),
            },
        })
    }

    const removeSlug = () => {
        let newValue = [...get(values, 'slug', '').split('/')]
        newValue.splice(lastSlugIndex - 1, 1)

        handleChange({ target: { name: 'slug', value: newValue.join('/') } })
    }

    const editSlug = (index: number, value: string) => {
        let newValue = [...get(values, 'slug', '').split('/')]
        newValue[index] = value

        handleChange({ target: { name: 'slug', value: newValue.join('/') } })
    }

    // const addSection = () => {
    //     handleChange({
    //         target: {
    //             name: 'sections',
    //             value: get(values, 'sections', []).concat([
    //                 { type: 'banner', content: '' },
    //             ]),
    //         },
    //     })
    // }

    // const removeSection = (index: number) => {
    //     let newValue = [...get(values, 'sections', [])]
    //     newValue.splice(index, 1)

    //     handleChange({ target: { name: 'sections', value: newValue } })
    // }

    // const addMetadata = () => {
    //     handleChange({
    //         target: {
    //             name: 'metadatas',
    //             value: get(values, 'metadatas', []).concat([
    //                 { name: '', content: '' },
    //             ]),
    //         },
    //     })
    // }

    // const removeMetadata = (index) => {
    //     let newValue = [...get(values, 'metadatas', [])]
    //     newValue.splice(index, 1)

    //     handleChange({ target: { name: 'metadatas', value: newValue } })
    // }

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (loading || pid === undefined) {
        return <div>Loading...</div>
    }

    return (
        <form onSubmit={handleSubmit}>
            {}
            <Space
                direction="vertical"
                size="large"
                style={{ width: '100%', padding: 15 }}
            >
                <Space direction="vertical" size={0}>
                    <Title level={5}>Title</Title>
                    <Input
                        value={get(values, 'title', '')}
                        onChange={(e) => {
                            onHandleChange('title', e.target.value)

                            if (pid === 'create') {
                                // onHandleChange(
                                //     `slug.${lastSlugIndex}`,
                                //     kebabcase(e.target.value)
                                // )
                            }
                        }}
                    />

                    <Divider />

                    <Title level={5}>Status</Title>
                    <Radio.Group
                        value={values.published}
                        onChange={(e) =>
                            onHandleChange('published', e.target.value)
                        }
                        disabled={pid !== 'create' && values.homepage}
                    >
                        <Radio value={true}>Published</Radio>
                        <Radio value={false}>Unpublished</Radio>
                    </Radio.Group>

                    <Divider />

                    <Title level={5}>Meta Datas</Title>
                    {/* <Space direction="vertical">
                        {get(values, 'metadatas', []).map((metadata, index) => (
                            <Space key={index}>
                                <Input
                                    value={metadata.name}
                                    onChange={(e) =>
                                        onHandleChange(
                                            `metadatas.${index}.name`,
                                            e.target.value
                                        )
                                    }
                                />
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
                        ))}
                        <Button
                            onClick={addMetadata}
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                        />
                    </Space> */}

                    <Divider />

                    <Title level={5}>Header</Title>

                    <Divider />

                    <Title level={5}>Page URL</Title>
                    <Space>
                        {get(values, 'slug', '')
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
                                                    ).split('/').length < 2
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
                                    />
                                    {lastSlugIndex !== idx && '/'}
                                </Fragment>
                            ))}
                    </Space>
                    <Divider />

                    <Title level={5}>Page content</Title>
                    {/* <Space direction="vertical">
                        {get(values, 'sections', []).map((section, idx) => (
                            <Space key={idx} direction="vertical">
                                <Space>
                                    <Select
                                        key={idx}
                                        value={section?.type}
                                        onChange={(e) =>
                                            onHandleChange(
                                                `sections.${idx}.type`,
                                                e
                                            )
                                        }
                                    >
                                        <Select.Option value="card">
                                            Banner
                                        </Select.Option>
                                        <Select.Option value="hover-card">
                                            Type 2
                                        </Select.Option>
                                    </Select>
                                    <Button
                                        onClick={() => removeSection(idx)}
                                        type="primary"
                                        shape="circle"
                                        icon={<MinusOutlined />}
                                    />
                                </Space>
                                <Input.TextArea
                                    value={section?.content}
                                    onChange={(e) =>
                                        onHandleChange(
                                            `sections.${idx}.content`,
                                            e.target.value
                                        )
                                    }
                                />
                            </Space>
                        ))}
                        <Button
                            onClick={addSection}
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                        />
                    </Space> */}
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

Admin.requireAuth = true

export default Admin
