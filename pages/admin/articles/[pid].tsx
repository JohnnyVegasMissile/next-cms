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
    Card,
    Spin,
    message,
    Image,
} from 'antd'
import get from 'lodash.get'
import { editArticle, getArticleDetails, postArticle } from '../../../network/articles'
import GetEditComponent from '../../../components/GetEditComponent'
import CustomSelect from '../../../components/CustomSelect'
import type { FullArticleEdit, FullSection } from '../../../types'
import {
    CaretDownOutlined,
    CaretUpOutlined,
    CloseOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import DisplayElementView from '../../../components/DisplayElementView'
import { useMutation, useQuery, UseQueryResult, useQueryClient } from 'react-query'
import { Article, Media } from '@prisma/client'
import { getImageDetail } from '../../../network/images'
import MediaModal from '@components/MediaModal'
import Head from 'next/head'

const { Title, Text } = Typography
const { TextArea } = Input

const initialValues: FullArticleEdit = {
    title: '',
    slug: '',
    published: true,
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
    const router = useRouter()
    const { pid } = router.query
    const queryClient = useQueryClient()

    const { values, /*errors,*/ handleSubmit, handleChange, setValues } =
        useFormik<FullArticleEdit>({
            initialValues,
            validate,
            onSubmit: async (values) => {
                let i = 0
                const sections: FullSection[] = []

                if (!!values.sections) {
                    for (const section of values.sections) {
                        if (!!section.type || !!section.elementId) {
                            sections.push({
                                ...section,
                                position: i,
                            })

                            i = i + 1
                        }
                    }
                }

                mutation.mutate({
                    pid: pid as string,
                    values: { ...values, sections },
                })
            },
        })

    const article: UseQueryResult<FullArticleEdit, Error> = useQuery<FullArticleEdit, Error>(
        ['articles', { id: pid }],
        () => getArticleDetails(pid as string),
        {
            refetchOnWindowFocus: false,
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: FullArticleEdit) => {
                const sections = get(data, 'sections', [])!.sort(
                    (a, b) => a.position - b.position
                )

                setValues({ ...data, sections })
            },
            onError: (err) => router.push('/admin/articles'),
        }
    )

    const cover: UseQueryResult<Media, Error> = useQuery<Media, Error>(
        ['medias', { id: values.coverId }],
        () => getImageDetail(values?.coverId!),
        {
            refetchOnWindowFocus: false,
            enabled: !!values.coverId,
        }
    )

    const mutation = useMutation(
        (data: { pid: string; values: FullArticleEdit }) =>
            data.pid === 'create'
                ? postArticle(data.values)
                : editArticle(data.pid, data.values),
        {
            onSuccess: (data: Article) => {
                message.success(`Article ${data.title} saved`)
                queryClient.invalidateQueries('images')
                router.push('/admin/articles')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the article')
                queryClient.invalidateQueries('images')
                router.push('/admin/articles')
            },
        }
    )

    const addSection = () => {
        handleChange({
            target: {
                name: 'sections',
                value: [
                    ...get(values, 'sections', [])!,
                    {
                        type: undefined,
                        position: get(values, 'sections', [])!.length,
                        content: '{}',
                    },
                ],
            },
        })
    }

    const removeSection = (index: number) => {
        let newValue = [...get(values, 'sections', [])!]
        newValue.splice(index, 1)

        handleChange({ target: { name: 'sections', value: newValue } })
    }

    const SectionUp = (index: number) => {
        let newValue = [...get(values, 'sections', [])!]
        const temp = newValue[index]
        newValue[index] = newValue[index - 1]
        newValue[index - 1] = temp

        handleChange({ target: { name: 'sections', value: newValue } })
    }

    const SectionDown = (index: number) => {
        let newValue = [...get(values, 'sections', [])!]
        const temp = newValue[index]
        newValue[index] = newValue[index + 1]
        newValue[index + 1] = temp

        handleChange({ target: { name: 'sections', value: newValue } })
    }

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (article.isLoading || !pid) {
        return (
            <div
                style={{
                    height: 'calc(100vh - 29px)',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f2f5',
                }}
            >
                <Spin size="large" tip="Loading..." />
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Admin - Articles</title>
            </Head>

            <form onSubmit={handleSubmit}>
                <Space
                    direction="vertical"
                    size="large"
                    style={{
                        width: '100%',
                        minHeight: 'calc(100vh - 29px)',
                        padding: 15,
                        backgroundColor: '#f0f2f5',
                    }}
                >
                    <Space
                        direction="vertical"
                        style={{
                            width: '100%',
                        }}
                    >
                        <Card title="Description">
                            <Space
                                direction="vertical"
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Space size="large">
                                    <Space direction="vertical">
                                        <Text>Title</Text>
                                        <Input
                                            style={{ width: 240 }}
                                            value={get(values, 'title', '')}
                                            onChange={(e) =>
                                                onHandleChange('title', e.target.value)
                                            }
                                        />
                                    </Space>

                                    <Space direction="vertical">
                                        <Text>Slug</Text>
                                        <Input
                                            style={{ width: 240 }}
                                            value={get(values, 'slug', '')}
                                            onChange={(e) =>
                                                onHandleChange('slug', e.target.value)
                                            }
                                        />
                                    </Space>

                                    <Space direction="vertical">
                                        <Text>Page list</Text>
                                        <CustomSelect.ListPages
                                            value={values.pageId}
                                            onChange={(e: string | undefined) =>
                                                onHandleChange('pageId', e)
                                            }
                                        />
                                    </Space>

                                    <Space direction="vertical">
                                        <Text>Status</Text>
                                        <Radio.Group
                                            value={values.published}
                                            onChange={(e) =>
                                                onHandleChange('published', e.target.value)
                                            }
                                        >
                                            <Radio value={true}>Published</Radio>
                                            <Radio value={false}>Unpublished</Radio>
                                        </Radio.Group>
                                    </Space>
                                </Space>
                                <Divider />
                                <Space size="large" align="start">
                                    <Space direction="vertical">
                                        <Text>Author</Text>
                                        <Input
                                            style={{ width: 240 }}
                                            value={get(values, 'author', '')!}
                                            onChange={(e) =>
                                                onHandleChange('author', e.target.value)
                                            }
                                        />
                                    </Space>

                                    <Space direction="vertical">
                                        <Text>Description</Text>
                                        <TextArea
                                            style={{ width: 240 * 2 + 24 }}
                                            value={get(values, 'description', '')!}
                                            onChange={(e) =>
                                                onHandleChange('description', e.target.value)
                                            }
                                            autoSize={{ minRows: 3, maxRows: 6 }}
                                        />
                                    </Space>

                                    <Space direction="vertical">
                                        <Text>Cover</Text>
                                        {values.coverId && !cover.isLoading && (
                                            <Image
                                                width={200}
                                                height={200}
                                                src={`${process.env.UPLOADS_IMAGES_DIR}/${
                                                    cover.data?.uri || ''
                                                }`}
                                                alt={cover.data?.alt || ''}
                                            />
                                        )}
                                        <MediaModal
                                            onMediaSelected={(e) =>
                                                onHandleChange('coverId', e?.id)
                                            }
                                        />
                                    </Space>
                                </Space>
                            </Space>
                        </Card>

                        <Divider />
                        <Title level={5} style={{ marginLeft: 45 }}>
                            Page sections
                        </Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {get(values, 'sections', [])!.map((section, idx) => (
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
                                                idx === get(values, 'sections', [])!.length - 1
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
                                            <Space>
                                                <CustomSelect.ListSections
                                                    page="page"
                                                    section={section.type || undefined}
                                                    element={section.elementId || undefined}
                                                    onSectionChange={(e) =>
                                                        onHandleChange(
                                                            `sections.${idx}.type`,
                                                            e
                                                        )
                                                    }
                                                    onElementChange={(e) =>
                                                        onHandleChange(
                                                            `sections.${idx}.elementId`,
                                                            e
                                                        )
                                                    }
                                                />
                                            </Space>
                                        }
                                        extra={
                                            <Button
                                                type="primary"
                                                onClick={() => removeSection(idx)}
                                                danger
                                                shape="circle"
                                                icon={<CloseOutlined />}
                                            />
                                        }
                                        style={{ flex: 1 }}
                                    >
                                        {!!section.type && (
                                            <GetEditComponent
                                                type={section.type}
                                                defaultValues={section.content}
                                                onChange={(e) =>
                                                    onHandleChange(
                                                        `sections.${idx}.content`,
                                                        e
                                                    )
                                                }
                                            />
                                        )}
                                        {!!section.elementId && (
                                            <DisplayElementView id={section.elementId} />
                                        )}
                                    </Card>
                                </div>
                            ))}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={<PlusOutlined />}
                                    onClick={addSection}
                                >
                                    Add section
                                </Button>
                            </div>
                        </Space>
                        <Divider />

                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Space>
                </Space>
            </form>
        </>
    )
}

Admin.requireAuth = true

export default Admin
