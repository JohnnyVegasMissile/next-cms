import { useState, Fragment } from 'react'
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
    Typography,
    Checkbox,
    Row,
    Col,
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
import type { Page, Role } from '@prisma/client'
import { useMutation, useQuery, UseQueryResult, useQueryClient } from 'react-query'
// import { Prisma } from '@prisma/client'
// import type { Page } from '@prisma/client'
import CustomSelect from '../../../components/CustomSelect'
import type { FullPageEdit, FullSection } from '../../../types'
import GetEditComponent from '../../../components/GetEditComponent'
import DisplayElementView from '../../../components/DisplayElementView'
import { editPage, getPageDetails, postPage } from '../../../network/pages'
import Head from 'next/head'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { getRoles } from '../../../network/roles'

const { Title, Text } = Typography

// const forbidenSlugs = ['new', 'edit', 'delete', 'api', 'admin', 'not-found', 'signin']

const initialValues: FullPageEdit = {
    title: '',
    // slug: '',
    slugEdit: [''],
    sections: [],
    metadatas: [],
    accesses: [],
    published: true,
}

const validate = (values: FullPageEdit) => {
    let errors: any = {}

    if (!values.title) {
        errors.title = 'Required'
    }

    // const splittedSlug = values.slug!.split('/')
    // for (const slug of splittedSlug) {
    //     if (!slug) {
    //         errors.slug = 'Forbiden slug'
    //         break
    //     }
    // }

    // if (values.type === 'page' || values.type === 'list') {
    //     if (!values.slug) {
    //         errors.slugEdit = 'Required'
    //     }

    //     if (forbidenSlugs.includes(get(values, 'slugEdit.0', ''))) {
    //         errors.slugEdit = 'Forbiden slug'
    //     }
    // }

    return errors
}

const Admin = () => {
    const router = useRouter()
    const { pid } = router.query
    const queryClient = useQueryClient()

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

            const slug = get(values, 'slugEdit', []).join('/')

            mutation.mutate({
                pid: pid as string,
                values: { ...values, sections, slug, slugEdit: undefined },
            })
        },
    })

    const page: UseQueryResult<FullPageEdit, Error> = useQuery<FullPageEdit, Error>(
        ['pages', { id: pid }],
        () => getPageDetails(pid as string),
        {
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: FullPageEdit) => {
                const sections = get(data, 'sections', []).sort((a, b) => a.position - b.position)

                const accesses = get(data, 'accesses', []).map((access) => get(access, 'roleId', ''))

                const slugEdit = get(data, 'slug', '')!.split('/')

                setValues({ ...data, sections, accesses, slugEdit })
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
                queryClient.invalidateQueries('pages')
                router.push('/admin/pages')
            },
            onError: () => {
                message.error('An error occured, while creating or updating the page')
                queryClient.invalidateQueries('pages')
                router.push('/admin/pages')
            },
        }
    )

    const isLockedPage = values.type !== 'page' && values.type !== 'list'

    const lastSlugIndex = get(values, 'slugEdit', []).length - 1

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    const addSlug = () => {
        let newValue = [...get(values, 'slugEdit', [])]
        newValue.splice(lastSlugIndex, 0, '')

        onHandleChange('slugEdit', newValue)
    }

    const removeSlug = () => {
        let newValue = [...get(values, 'slugEdit', [])]
        newValue.splice(lastSlugIndex - 1, 1)

        onHandleChange('slugEdit', newValue)
    }

    // const editSlug = (index: number, value: string) => {
    //     let newValue = [...get(values, 'slug', '')]
    //     newValue[index] = value

    //     onHandleChange('slug', newValue.join('/'))
    // }

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
                <title>Admin - Pages</title>
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
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card title="Description">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Space size="large">
                                    <Space direction="vertical">
                                        <Text>Title :</Text>
                                        <Input
                                            id="title"
                                            style={{ width: 240 }}
                                            value={get(values, 'title', '')}
                                            onChange={(e) => {
                                                onHandleChange('title', e.target.value)

                                                if (pid === 'create') {
                                                    onHandleChange(
                                                        `slugEdit.${lastSlugIndex}`,
                                                        kebabcase(e.target.value)
                                                    )
                                                }
                                            }}
                                        />
                                    </Space>
                                    <Space direction="vertical">
                                        <Text>Type</Text>
                                        <Radio.Group id="type" value={values.type} buttonStyle="solid">
                                            <Radio.Button value="page" disabled={values.type !== 'page'}>
                                                Page
                                            </Radio.Button>
                                            <Radio.Button value="list" disabled={values.type !== 'list'}>
                                                List
                                            </Radio.Button>
                                            <Radio.Button value="error" disabled={values.type !== 'error'}>
                                                Not found
                                            </Radio.Button>
                                            <Radio.Button value="home" disabled={values.type !== 'home'}>
                                                Homepage
                                            </Radio.Button>
                                            <Radio.Button value="signin" disabled={values.type !== 'signin'}>
                                                Sign In
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Space>
                                    <Space direction="vertical">
                                        <Text>Status</Text>
                                        <Radio.Group
                                            id="status"
                                            value={values.published}
                                            onChange={(e) => onHandleChange('published', e.target.value)}
                                            disabled={pid !== 'create' && isLockedPage}
                                        >
                                            <Radio value={true}>Published</Radio>
                                            <Radio value={false}>Unpublished</Radio>
                                        </Radio.Group>
                                    </Space>

                                    {!isLockedPage && (
                                        <Space direction="vertical">
                                            <Text>Access</Text>
                                            <PageAccessCheckboxes
                                                value={values.accesses || []}
                                                onChange={(e) => onHandleChange('accesses', e)}
                                            />
                                        </Space>
                                    )}
                                </Space>

                                {!isLockedPage && (
                                    <>
                                        <Divider />
                                        <Title level={5}>Page URL</Title>
                                        <Space style={{ width: '100%' }}>
                                            {get(values, 'slugEdit', []).map((slug, idx) => (
                                                <Fragment key={idx}>
                                                    {idx === lastSlugIndex && (
                                                        <>
                                                            <Button
                                                                id="slug-minus"
                                                                onClick={removeSlug}
                                                                type="primary"
                                                                // shape="circle"
                                                                danger
                                                                disabled={
                                                                    get(values, 'slugEdit', []).length < 2
                                                                }
                                                                icon={<MinusOutlined />}
                                                            />
                                                            <Button
                                                                id="slug-plus"
                                                                onClick={addSlug}
                                                                disabled={
                                                                    get(values, 'slugEdit', []).length > 5
                                                                }
                                                                type="primary"
                                                                // shape="circle"
                                                                icon={<PlusOutlined />}
                                                            />
                                                        </>
                                                    )}
                                                    <Input
                                                        id={`slug-${idx}`}
                                                        style={{
                                                            minWidth: 200,
                                                        }}
                                                        value={slug}
                                                        onChange={(e) =>
                                                            onHandleChange(
                                                                `slugEdit.${idx}`,
                                                                kebabcase(e.target.value)
                                                            )
                                                        }
                                                        status={errors.slug ? 'error' : undefined}
                                                    />
                                                    {lastSlugIndex !== idx && '/'}
                                                </Fragment>
                                            ))}
                                        </Space>
                                    </>
                                )}
                            </Space>
                        </Card>

                        <Card title="Metadatas">
                            <Space direction="vertical">
                                {get(values, 'metadatas', []).map((metadata: any, idx: number) => (
                                    <Space key={idx} align="end">
                                        <Space direction="vertical">
                                            <Text>Name</Text>
                                            <Select
                                                id={`meta-name-${idx}`}
                                                style={{ width: 240 }}
                                                value={metadata.name}
                                                onChange={(e) => onHandleChange(`metadatas.${idx}.name`, e)}
                                            >
                                                <Select.Option value="application-name">
                                                    Application name
                                                </Select.Option>
                                                <Select.Option value="author">Author</Select.Option>
                                                <Select.Option value="description">Description</Select.Option>
                                                <Select.Option value="generator">Generator</Select.Option>
                                                <Select.Option value="keywords">Keywords</Select.Option>
                                                <Select.Option value="viewport">Viewport</Select.Option>
                                            </Select>
                                        </Space>

                                        <Space direction="vertical">
                                            <Text>Content</Text>
                                            <Input
                                                id={`meta-content-${idx}`}
                                                style={{ width: 240 }}
                                                value={metadata.content}
                                                onChange={(e) =>
                                                    onHandleChange(`metadatas.${idx}.content`, e.target.value)
                                                }
                                            />
                                        </Space>
                                        <Button
                                            id={`meta-minus-${idx}`}
                                            onClick={() => removeMetadata(idx)}
                                            type="primary"
                                            // shape="circle"
                                            danger
                                            icon={<MinusOutlined />}
                                        />
                                    </Space>
                                ))}
                                <Button
                                    id={'meta-plus'}
                                    onClick={addMetadata}
                                    type="primary"
                                    // shape="circle"
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
                                        id="header"
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
                        <Title level={5} style={{ marginLeft: 55 }}>
                            Page sections
                        </Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {get(values, 'sections', []).map((section, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 8 }}>
                                    <Space direction="vertical" size={1}>
                                        <Button
                                            disabled={idx === 0}
                                            onClick={() => SectionUp(idx)}
                                            type="primary"
                                            // shape="circle"
                                            icon={<CaretUpOutlined />}
                                        />
                                        <Button
                                            disabled={idx === get(values, 'sections', []).length - 1}
                                            onClick={() => SectionDown(idx)}
                                            type="primary"
                                            // shape="circle"
                                            icon={<CaretDownOutlined />}
                                        />
                                    </Space>
                                    <Card
                                        bodyStyle={{ padding: 0 }}
                                        title={
                                            <Space>
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 'normal',
                                                    }}
                                                >
                                                    Block:
                                                </Text>
                                                <CustomSelect.ListSections
                                                    // page={values.type}
                                                    section={section.type || undefined}
                                                    element={section.elementId || undefined}
                                                    onSectionChange={(e) =>
                                                        onHandleChange(`sections.${idx}.type`, e)
                                                    }
                                                    onElementChange={(e) =>
                                                        onHandleChange(`sections.${idx}.elementId`, e)
                                                    }
                                                />
                                                <Divider type="vertical" />
                                                <Text
                                                    style={{
                                                        fontSize: 14,
                                                        fontWeight: 'normal',
                                                    }}
                                                >
                                                    Form:
                                                </Text>
                                                <CustomSelect.ListForms
                                                    value={section.formId}
                                                    onChange={(e) =>
                                                        onHandleChange(`sections.${idx}.formId`, e)
                                                    }
                                                />
                                            </Space>
                                        }
                                        extra={
                                            <Button
                                                type="primary"
                                                onClick={() => removeSection(idx)}
                                                danger
                                                // shape="circle"
                                                icon={<CloseOutlined />}
                                            />
                                        }
                                        style={{ flex: 1 }}
                                    >
                                        {!!section.type && (
                                            <GetEditComponent
                                                type={section.type}
                                                defaultValues={section.content}
                                                onChange={(e) => onHandleChange(`sections.${idx}.content`, e)}
                                            />
                                        )}
                                        {!!section.elementId && <DisplayElementView id={section.elementId} />}
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
                                    // shape="round"
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
                                        id="footer"
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
                        <Button loading={mutation.isLoading} type="primary" htmlType="submit">
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

const PageAccessCheckboxes = ({
    value,
    onChange,
}: {
    value: string[]
    onChange(e: CheckboxValueType[]): void
}) => {
    const roles: UseQueryResult<Role[], Error> = useQuery<Role[], Error>(['roles', {}], () => getRoles())

    return (
        <Checkbox.Group value={value} style={{ width: 350 }} onChange={onChange}>
            <Row>
                {roles?.data
                    ?.filter((e) => e.id !== 'super-admin')
                    ?.map((role) => (
                        <Col key={role.id} span={8}>
                            <Checkbox value={role.id}>{role.name}</Checkbox>
                        </Col>
                    ))}
            </Row>
        </Checkbox.Group>
    )
}

const PageTypeModal = ({ visible, onSelect }: { visible: boolean; onSelect(e: 'page' | 'list'): void }) => {
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
                id="access"
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
