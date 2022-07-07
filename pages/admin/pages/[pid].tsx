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
    Cascader,
    Modal,
    Spin,
    message,
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
import { editPage, getPageDetails, postPage } from '../../../network/pages'
import type { FullPageEdit, FullSection } from '../../../types'
import Blocks from '../../../blocks'
import GetEditComponent from '../../../components/GetEditComponent'
import { useMutation, useQuery, UseQueryResult } from 'react-query'
import { getElementDetails, getElements } from '../../../network/elements'
import type { Element, Page } from '@prisma/client'
import CustomSelect from '../../../components/CustomSelect'

const { Title, Text } = Typography

const forbidenSlugs = ['new', 'edit', 'delete', 'api', 'admin', 'not-found']

const initialValues: FullPageEdit = {
    title: '',
    slug: '',
    sections: [],
    metadatas: [],
    published: true,
    // headerId: '',
    // footerId: '',
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
    // const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { pid } = router.query

    const { values, errors, handleChange, handleSubmit, setValues } = useFormik<FullPageEdit>({
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

            mutation.mutate({ pid: pid as string, values: { ...values, sections } })
        },
    })

    const page: UseQueryResult<FullPageEdit, Error> = useQuery<FullPageEdit, Error>(
        ['pages', { id: pid }],
        () => getPageDetails(pid as string),
        {
            refetchOnWindowFocus: false,
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: FullPageEdit) => {
                const sections = get(data, 'sections', []).sort(
                    (a, b) => a.position - b.position
                )

                setValues({ ...data, sections })
            },
            onError: (err) => router.push('/admin/pages'),
        }
    )

    const mutation = useMutation(
        (data: { pid: string; values: FullPageEdit }) =>
            data.pid === 'create' ? postPage(data.values) : editPage(data.pid, data.values),
        {
            onSuccess: (data: Page) => {
                message.success(`Page ${data.title} saved`)
                router.push('/admin/pages')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the page')
                router.push('/admin/pages')
            },
        }
    )

    const isLockedPage = values.type === 'error' || values.type === 'home'

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

    if (page.isLoading || !pid) {
        return (
            <div
                style={{
                    height: '50vh',
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
            <form onSubmit={handleSubmit}>
                <Space
                    direction="vertical"
                    size="large"
                    style={{
                        width: '100%',
                        padding: 15,
                        backgroundColor: '#f0f2f5',
                    }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card title="Description">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Space size="large">
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text>Title</Text>
                                        <Input
                                            style={{ width: 240 }}
                                            value={get(values, 'title', '')}
                                            onChange={(e) => {
                                                onHandleChange('title', e.target.value)

                                                if (pid === 'create') {
                                                    let newValue = [
                                                        ...get(values, 'slug', '')!.split('/'),
                                                    ]
                                                    newValue[lastSlugIndex] = kebabcase(
                                                        e.target.value
                                                    )

                                                    onHandleChange('slug', newValue.join('/'))
                                                }
                                            }}
                                        />
                                    </Space>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text>Type</Text>
                                        <Radio.Group value={values.type} buttonStyle="solid">
                                            <Radio.Button
                                                value="page"
                                                disabled={values.type !== 'page'}
                                            >
                                                Page
                                            </Radio.Button>
                                            <Radio.Button
                                                value="list"
                                                disabled={values.type !== 'list'}
                                            >
                                                List
                                            </Radio.Button>
                                            <Radio.Button
                                                value="error"
                                                disabled={values.type !== 'error'}
                                            >
                                                Not found
                                            </Radio.Button>
                                            <Radio.Button
                                                value="home"
                                                disabled={values.type !== 'home'}
                                            >
                                                Homepage
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Space>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text>Status</Text>
                                        <Radio.Group
                                            value={values.published}
                                            onChange={(e) =>
                                                onHandleChange('published', e.target.value)
                                            }
                                            disabled={pid !== 'create' && isLockedPage}
                                        >
                                            <Radio value={true}>Published</Radio>
                                            <Radio value={false}>Unpublished</Radio>
                                        </Radio.Group>
                                    </Space>
                                </Space>
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
                                                                        )!.split('/').length <
                                                                        2
                                                                    }
                                                                    icon={<MinusOutlined />}
                                                                />
                                                                <Button
                                                                    onClick={addSlug}
                                                                    disabled={
                                                                        get(
                                                                            values,
                                                                            'slug',
                                                                            ''
                                                                        )!.split('/').length >
                                                                        5
                                                                    }
                                                                    type="primary"
                                                                    shape="circle"
                                                                    icon={<PlusOutlined />}
                                                                />
                                                            </>
                                                        )}
                                                        <Input
                                                            style={{
                                                                minWidth: 200,
                                                            }}
                                                            value={slug}
                                                            onChange={(e) =>
                                                                editSlug(idx, e.target.value)
                                                            }
                                                            status={
                                                                errors.slug
                                                                    ? 'error'
                                                                    : undefined
                                                            }
                                                        />
                                                        {lastSlugIndex !== idx && '/'}
                                                    </Fragment>
                                                ))}
                                        </Space>
                                    </>
                                )}
                            </Space>
                        </Card>

                        <Card title="Metadata">
                            <Space direction="vertical">
                                {get(values, 'metadatas', []).map(
                                    (metadata: any, index: number) => (
                                        <Space key={index}>
                                            <Select
                                                style={{ width: 240 }}
                                                value={metadata.name}
                                                onChange={(e) =>
                                                    onHandleChange(
                                                        `metadatas.${index}.name`,
                                                        e
                                                    )
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
                                                style={{ width: 240 }}
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
                        </Card>

                        <Card
                            title={
                                <Space>
                                    <Title style={{ marginBottom: '0.1rem' }} level={5}>
                                        Header
                                    </Title>
                                    <CustomSelect.ListElements
                                        value={values.headerId}
                                        onChange={(e) => onHandleChange('headerId', e)}
                                    />
                                </Space>
                            }
                            bodyStyle={{ padding: 0 }}
                        >
                            {values.headerId && <DisplayElementView id={values.headerId} />}
                        </Card>
                        <Divider />
                        <Title level={5} style={{ marginLeft: 45 }}>
                            Page sections
                        </Title>
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
                                            <Space>
                                                <SectionCascader
                                                    page={values.type}
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
                                    // size="small"
                                >
                                    Add section
                                </Button>
                            </div>
                        </Space>
                        <Divider />

                        <Card
                            title={
                                <Space>
                                    <Title style={{ marginBottom: '0.1rem' }} level={5}>
                                        Footer
                                    </Title>
                                    <CustomSelect.ListElements
                                        value={values.footerId}
                                        onChange={(e) => onHandleChange('footerId', e)}
                                    />
                                </Space>
                            }
                            bodyStyle={{ padding: 0 }}
                        >
                            {values.footerId && <DisplayElementView id={values.footerId} />}
                        </Card>

                        <Divider />
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Space>
                </Space>
            </form>
            <PageTypeModal
                visible={!page.isLoading && !values.type}
                onSelect={(e) => onHandleChange('type', e)}
            />
        </>
    )
}

const PageTypeModal = ({
    visible,
    onSelect,
}: {
    visible: boolean
    onSelect(e: 'page' | 'list'): void
}) => {
    const router = useRouter()
    const [type, setType] = useState<'page' | 'list' | undefined>()

    return (
        <Modal
            title="Page type"
            closable={false}
            visible={visible}
            onOk={() => onSelect(type!)}
            onCancel={() => router.push('/admin/pages')}
            okButtonProps={{ disabled: !type }}
            cancelText={null}
        >
            <Radio.Group
                value={type}
                onChange={(e) => setType(e.target.value)}
                buttonStyle="solid"
            >
                <Radio.Button value="page">Page</Radio.Button>
                <Radio.Button value="list">List</Radio.Button>
            </Radio.Group>
        </Modal>
    )
}

const DisplayElementView = ({ id }: { id: string }) => {
    const element: UseQueryResult<Element, Error> = useQuery<Element, Error>(
        ['elements', { id }],
        () => getElementDetails(id),
        {
            refetchOnWindowFocus: false,
        }
    )

    if (element.isLoading) {
        return <Text>Loading...</Text>
    }

    if (element.isError || element.data === undefined) {
        return <Text>Error</Text>
    }

    const Component = get(Blocks, element.data.type, () => null)

    return <Component.View defaultValues={element.data.content} />
}

interface SectionCascaderProps {
    page?: string
    section?: string
    element?: string
    onSectionChange(type: string | undefined): void
    onElementChange(type: string | undefined): void
}

const SectionCascader = ({
    page,
    section,
    element,
    onSectionChange,
    onElementChange,
}: SectionCascaderProps) => {
    const elements: UseQueryResult<Element[], Error> = useQuery<Element[], Error>(
        ['elements'],
        () => getElements(),
        {
            refetchOnWindowFocus: false,
        }
    )

    return (
        <Cascader
            placeholder="Please select"
            value={!!section ? [section] : !!element ? ['', element] : []}
            displayRender={(labels: string[]) => {
                if (labels.length === 1) {
                    return labels[0]
                }
                if (labels.length === 2) {
                    return (
                        <Text>
                            {labels[1]}
                            <Text type="secondary"> (Element)</Text>
                        </Text>
                    )
                }
                return
            }}
            style={{ width: 240, fontWeight: 'normal' }}
            options={[
                {
                    value: '',
                    label: 'Elements:',
                    loading: elements.isLoading,
                    disabled: !get(elements, 'data', []).length && !elements.isLoading,
                    children: get(elements, 'data', []).map((e) => ({
                        value: e.id,
                        label: e.title,
                    })),
                },
                ...Object.keys(Blocks).map((key) => ({
                    value: key,
                    label: get(Blocks, `${key}.name`, ''),
                    disabled: !get(Blocks, `${key}.pages`, []).includes(page),
                })),
            ]}
            onChange={(e) => {
                if (e?.length === 1) {
                    onSectionChange(`${e[0]}`)
                    onElementChange(undefined)
                } else if (e?.length === 2) {
                    onSectionChange(undefined)
                    onElementChange(`${e[1]}`)
                } else {
                    onSectionChange(undefined)
                    onElementChange(undefined)
                }
            }}
        />
    )
}

Admin.requireAuth = true

export default Admin
