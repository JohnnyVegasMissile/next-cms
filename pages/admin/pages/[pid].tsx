import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import {
    Spin,
    Card,
    Radio,
    Modal,
    Input,
    Space,
    Button,
    Divider,
    Select,
    message,
    Cascader,
    // Select,
    Typography,
    // Breadcrumb,
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
import type { Element, Page } from '@prisma/client'
import { useMutation, useQuery, UseQueryResult } from 'react-query'
// import { Prisma } from '@prisma/client'
// import type { Page } from '@prisma/client'
import Blocks from '../../../blocks'
import CustomSelect from '../../../components/CustomSelect'
import type { FullPageEdit, FullSection } from '../../../types'
import GetEditComponent from '../../../components/GetEditComponent'
import DisplayElementView from '../../../components/DisplayElementView'
import { getElementDetails, getElements } from '../../../network/elements'
import { editPage, getPageDetails, postPage } from '../../../network/pages'

const { Title, Text } = Typography

const forbidenSlugs = ['new', 'edit', 'delete', 'api', 'admin', 'not-found']

const initialValues: FullPageEdit = {
    title: '',
    slug: '',
    sections: [],
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
    // const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { pid } = router.query

    const { values, errors, handleChange, handleSubmit, setValues } =
        useFormik<FullPageEdit>({
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
            data.pid === 'create'
                ? postPage(data.values)
                : editPage(data.pid, data.values),
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
                                    <Space direction="vertical">
                                        <Text>Title</Text>
                                        <Input
                                            style={{ width: 240 }}
                                            value={get(values, 'title', '')}
                                            onChange={(e) => {
                                                onHandleChange('title', e.target.value)

                                                if (pid === 'create') {
                                                    let newValue = [
                                                        ...get(values, 'slug', '')!.split(
                                                            '/'
                                                        ),
                                                    ]
                                                    newValue[lastSlugIndex] = kebabcase(
                                                        e.target.value
                                                    )

                                                    onHandleChange(
                                                        'slug',
                                                        newValue.join('/')
                                                    )
                                                }
                                            }}
                                        />
                                    </Space>
                                    <Space direction="vertical">
                                        <Text>Type</Text>
                                        <Radio.Group
                                            value={values.type}
                                            buttonStyle="solid"
                                        >
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
                                    <Space direction="vertical">
                                        <Text>Status</Text>
                                        <Radio.Group
                                            value={values.published}
                                            onChange={(e) =>
                                                onHandleChange(
                                                    'published',
                                                    e.target.value
                                                )
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
                                                                        )!.split('/')
                                                                            .length < 2
                                                                    }
                                                                    icon={
                                                                        <MinusOutlined />
                                                                    }
                                                                />
                                                                <Button
                                                                    onClick={addSlug}
                                                                    disabled={
                                                                        get(
                                                                            values,
                                                                            'slug',
                                                                            ''
                                                                        )!.split('/')
                                                                            .length > 5
                                                                    }
                                                                    type="primary"
                                                                    shape="circle"
                                                                    icon={
                                                                        <PlusOutlined />
                                                                    }
                                                                />
                                                            </>
                                                        )}
                                                        <Input
                                                            style={{
                                                                minWidth: 200,
                                                            }}
                                                            value={slug}
                                                            onChange={(e) =>
                                                                editSlug(
                                                                    idx,
                                                                    e.target.value
                                                                )
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
                            {values.headerId && (
                                <DisplayElementView id={values.headerId} />
                            )}
                        </Card>
                        <Divider />
                        <Title level={5} style={{ marginLeft: 55 }}>
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
                                                idx ===
                                                get(values, 'sections', []).length - 1
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
                                                    page={values.type}
                                                    section={section.type || undefined}
                                                    element={
                                                        section.elementId || undefined
                                                    }
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
                                    onClick={addSection}
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
                            {values.footerId && (
                                <DisplayElementView id={values.footerId} />
                            )}
                        </Card>

                        <Divider />
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Space>
                </Space>
            </form>
            <PageTypeModal
                visible={!page.isLoading && !values.type && pid === 'create'}
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

Admin.requireAuth = true

export default Admin
