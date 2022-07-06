import { useEffect, useState } from 'react'
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
} from 'antd'
import get from 'lodash.get'
import kebabcase from 'lodash.kebabcase'
import { editArticle, getArticleDetails, postArticle } from '../../../network/articles'
import CustomSelect from '../../../components/CustomSelect'
import type { FullArticleEdit } from '../../../types'

const { Title } = Typography

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

// interface PageType {
//     title: string
//     slug: string
//     type?: 'home' | 'page' | 'error' | 'list'
//     // sections?: SectionType[];
//     // metadatas?: MetadataType[];
//     published: boolean
//     homepage?: boolean
// }

const initialValues: FullArticleEdit = {
    //     title: '',
    //     slug: '',
    //     // sections: [],
    //     // metadatas: [],
    //     published: true,
    title: '',
    slug: '',
    // Page: undefined,
    published: true,
    pageId: undefined,
}

const validate = (values: FullArticleEdit) => {
    let errors: any = {}

    // if (!values.title) {
    //     errors.title = 'Required'
    // }

    // const splittedSlug = values.slug.split('/')
    // for (const slug of splittedSlug) {
    //     if (!slug) {
    //         errors.slug = 'Forbiden slug'
    //         break
    //     }
    // }

    // if (!values.slug) {
    //     errors.slug = 'Required'
    // }

    return errors
}

const Admin = () => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { pid } = router.query

    const { values, /*errors,*/ handleSubmit, handleChange, setValues } =
        useFormik<FullArticleEdit>({
            initialValues,
            validate,
            onSubmit: async (values) => {
                setLoading(true)
                if (pid === 'create') {
                    await postArticle(values)
                } else {
                    const id = pid as string

                    await editArticle(id, values)
                }
                router.push('/admin/articles')
                setLoading(false)
            },
        })

    // const isLockedPage = values.type === 'error' || values.type === 'home'

    useEffect(() => {
        const getPageInfos = async () => {
            if (pid === undefined) {
                return
            }
            if (pid !== 'create') {
                const data = await getArticleDetails(pid as string)

                if (!data) router.push('/admin/articles')

                setValues(data)
            } else {
                setValues(initialValues)
            }
        }
        getPageInfos()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pid])

    // const lastSlugIndex = get(values, 'slug', '').split('/').length - 1

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    // const addSlug = () => {
    //     let newValue = [...get(values, 'slug', '').split('/')]
    //     newValue.splice(lastSlugIndex, 0, '')

    //     onHandleChange('slug', newValue.join('/'))
    // }

    // const removeSlug = () => {
    //     let newValue = [...get(values, 'slug', '').split('/')]
    //     newValue.splice(lastSlugIndex - 1, 1)

    //     onHandleChange('slug', newValue.join('/'))
    // }

    // const editSlug = (index: number, value: string) => {
    //     let newValue = [...get(values, 'slug', '').split('/')]
    //     newValue[index] = value

    //     onHandleChange('slug', newValue.join('/'))
    // }

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

    // const removeMetadata = (index: number) => {
    //     let newValue = [...get(values, 'metadatas', [])]
    //     newValue.splice(index, 1)

    //     handleChange({ target: { name: 'metadatas', value: newValue } })
    // }

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
                <Space direction="vertical" size={0}>
                    <Title level={5}>Title</Title>
                    <Input
                        value={get(values, 'title', '')}
                        onChange={(e) => {
                            onHandleChange('title', e.target.value)

                            if (pid === 'create') {
                                onHandleChange('slug', kebabcase(e.target.value))
                            }
                        }}
                    />

                    <Divider />

                    <Input
                        value={get(values, 'slug', '')}
                        onChange={(e) => onHandleChange('slug', e.target.value)}
                    />

                    <CustomSelect.ListPages
                        value={values.pageId}
                        onChange={(e: number | undefined) => onHandleChange('pageId', e)}
                    />

                    <Divider />

                    <Title level={5}>Status</Title>
                    <Radio.Group
                        value={values.published}
                        onChange={(e) => onHandleChange('published', e.target.value)}
                    >
                        <Radio value={true}>Published</Radio>
                        <Radio value={false}>Unpublished</Radio>
                    </Radio.Group>

                    <Divider />

                    <Title level={5}>Header</Title>

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
