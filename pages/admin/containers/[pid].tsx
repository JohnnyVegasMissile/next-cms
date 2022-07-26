import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import {
    Input,
    Space,
    Button,
    Typography,
    Card,
    Select,
    message,
    Spin,
    Tabs,
    Radio,
    Divider,
    Checkbox,
    Row,
    Col,
} from 'antd'
import { AndroidOutlined, AppleOutlined } from '@ant-design/icons'
import get from 'lodash.get'
import { editElement, getElementDetails, postElement } from '../../../network/elements'
import { Prisma, Element, Role } from '@prisma/client'
import Blocks from '../../../blocks'
import GetEditComponent from '../../../components/GetEditComponent'
import { useMutation, useQuery, UseQueryResult, useQueryClient } from 'react-query'
import {
    PlusOutlined,
    MinusOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    CloseOutlined,
} from '@ant-design/icons'
import Head from 'next/head'
import { FullSection, FullSectionEdit } from '../../../types'
import CustomSelect from '../../../components/CustomSelect'
import DisplayElementView from '../../../components/DisplayElementView'
import { editPage, getPageDetails, postPage } from '../../../network/pages'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import { getRoles } from '../../../network/roles'
import set from 'lodash.set'
import { Fragment } from 'react'

const { Text, Title } = Typography
const { TabPane } = Tabs

type MyType = any

const initialValues: MyType = { slugEdit: [''] }

const validate = (values: MyType) => {
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

    const { values, errors, handleSubmit, handleChange, setValues } = useFormik<MyType>({
        initialValues,
        validate,
        onSubmit: async (values) => mutation.mutate({ pid: pid as string, values }),
    })

    const element: UseQueryResult<MyType, Error> = useQuery<MyType, Error>(
        ['elements', { id: pid }],
        () => getElementDetails(pid as string),
        {
            enabled: !!pid && pid !== 'create',
            onSuccess: (data: MyType) => setValues(data),
            onError: (err) => router.push('/admin/articles'),
        }
    )

    const mutation = useMutation(
        (data: { pid: string; values: MyType }) =>
            data.pid === 'create' ? postElement(data.values) : editElement(data.pid, data.values),
        {
            onSuccess: (data: Element) => {
                message.success(`Element ${data.title} saved`)
                queryClient.invalidateQueries('elements')
                router.push('/admin/elements')
            },
            onError: (err) => {
                message.error('An error occured, while creating or updating the element')
                queryClient.invalidateQueries('elements')
                router.push('/admin/elements')
            },
        }
    )

    const addField = () => {
        handleChange({
            target: {
                name: 'fields',
                value: [...get(values, 'fields', []), { name: '', content: '' }],
            },
        })
    }

    const removeField = (index: number) => {
        let newValue = [...get(values, 'fields', [])]
        newValue.splice(index, 1)

        handleChange({ target: { name: 'fields', value: newValue } })
    }

    const lastSlugIndex = get(values, 'slugEdit', []).length - 1

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

    const onHandleChange = (name: string, value: any) => {
        handleChange({ target: { name, value } })
    }

    if (element.isLoading || !pid) {
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
                <title>Admin - Elements</title>
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
                    <div className="admin-card-container">
                        <Tabs type="card">
                            <TabPane tab="Container" key="1">
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
                                                    <Text>Status</Text>
                                                    <Radio.Group
                                                        id="status"
                                                        value={values.published}
                                                        onChange={(e) =>
                                                            onHandleChange('published', e.target.value)
                                                        }
                                                    >
                                                        <Radio value={true}>Published</Radio>
                                                        <Radio value={false}>Unpublished</Radio>
                                                    </Radio.Group>
                                                </Space>

                                                <Space direction="vertical">
                                                    <Text>Access</Text>
                                                    <PageAccessCheckboxes
                                                        value={values.accesses || []}
                                                        onChange={(e) => onHandleChange('accesses', e)}
                                                    />
                                                </Space>
                                            </Space>

                                            <Divider />
                                            <Title level={5}>Page URL</Title>
                                            <Space style={{ width: '100%' }}>
                                                {get(values, 'slugEdit', []).map(
                                                    (slug: string, idx: number) => (
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
                                                                            get(values, 'slugEdit', [])
                                                                                .length < 2
                                                                        }
                                                                        icon={<MinusOutlined />}
                                                                    />
                                                                    <Button
                                                                        id="slug-plus"
                                                                        onClick={addSlug}
                                                                        disabled={
                                                                            get(values, 'slugEdit', [])
                                                                                .length > 5
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
                                                    )
                                                )}
                                            </Space>
                                        </Space>
                                    </Card>

                                    <Card title="Fields">
                                        <Space direction="vertical">
                                            {get(values, 'fields', []).map((field: any, idx: number) => (
                                                <Space key={idx} align="end">
                                                    <Space direction="vertical">
                                                        <Text>Name</Text>
                                                        <Input
                                                            id={`field-name-${idx}`}
                                                            style={{ width: 240 }}
                                                            value={field.name}
                                                            onChange={(e) =>
                                                                onHandleChange(
                                                                    `fields.${idx}.name`,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </Space>

                                                    <Space direction="vertical">
                                                        <Text>Type</Text>
                                                        <Select
                                                            id={`field-type-${idx}`}
                                                            style={{ width: 240 }}
                                                            value={field.type}
                                                            onChange={(e) =>
                                                                onHandleChange(`fields.${idx}.type`, e)
                                                            }
                                                        >
                                                            <Select.Option value="string">Text</Select.Option>
                                                            <Select.Option value="text">
                                                                Paragraph
                                                            </Select.Option>
                                                            <Select.Option value="int">Number</Select.Option>
                                                            <Select.Option value="boolean">
                                                                Boolean
                                                            </Select.Option>
                                                            <Select.Option value="date">Date</Select.Option>
                                                            <Select.Option value="image">Image</Select.Option>
                                                            <Select.Option value="file" disabled>
                                                                File
                                                            </Select.Option>
                                                            <Select.Option value="link">Link</Select.Option>
                                                            <Select.Option value="wysiwyg" disabled>
                                                                Wysiwyg
                                                            </Select.Option>
                                                            <Select.Option value="list" disabled>
                                                                List
                                                            </Select.Option>
                                                        </Select>
                                                    </Space>

                                                    <Space direction="vertical">
                                                        <Text>Content</Text>
                                                        <Input
                                                            id={`field-content-${idx}`}
                                                            style={{ width: 240 }}
                                                            value={field.content}
                                                            onChange={(e) =>
                                                                onHandleChange(
                                                                    `fields.${idx}.content`,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </Space>

                                                    <Space direction="vertical">
                                                        <Text>Required</Text>
                                                        <Radio.Group
                                                            style={{
                                                                height: 32,
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                            }}
                                                            id={`required-${idx}`}
                                                            value={field.required}
                                                            onChange={(e) =>
                                                                onHandleChange(
                                                                    `fields.${idx}.required`,
                                                                    e.target.value
                                                                )
                                                            }
                                                        >
                                                            <Radio value={true}>Published</Radio>
                                                            <Radio value={false}>Unpublished</Radio>
                                                        </Radio.Group>
                                                    </Space>
                                                    <Button
                                                        id={`field-minus-${idx}`}
                                                        onClick={() => removeField(idx)}
                                                        type="primary"
                                                        // shape="circle"
                                                        danger
                                                        icon={<MinusOutlined />}
                                                    />
                                                </Space>
                                            ))}
                                            <Button
                                                id={'field-plus'}
                                                onClick={addField}
                                                type="primary"
                                                // shape="circle"
                                                icon={<PlusOutlined />}
                                            />
                                        </Space>
                                    </Card>
                                    <Divider orientation="left">Layout</Divider>
                                    <SectionManager
                                        values={get(values, 'sections', []) as FullSectionEdit[]}
                                        onChange={(e) => onHandleChange('sections', e)}
                                    />
                                </Space>
                            </TabPane>
                            <TabPane tab="Contents" key="2">
                                <div style={{ height: 15 }} />
                                <SectionManager
                                    values={get(values, 'childsSections', []) as FullSectionEdit[]}
                                    onChange={(e) => onHandleChange('childsSections', e)}
                                />
                            </TabPane>
                        </Tabs>
                    </div>

                    <Button loading={mutation.isLoading} type="primary" htmlType="submit">
                        Save
                    </Button>
                </Space>
            </form>
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

interface SectionManagerProps {
    values: FullSectionEdit[]
    onChange(value: FullSectionEdit[]): void
}

const SectionManager = ({ values, onChange }: SectionManagerProps) => {
    const addSection = () => {
        onChange([
            ...values,
            {
                type: null,
                position: values.length,
                content: '{}',
            },
        ])
    }

    const removeSection = (index: number) => {
        let newValue = [...values]
        newValue.splice(index, 1)

        onChange(newValue)
    }

    const SectionUp = (index: number) => {
        let newValue = [...values]
        const temp = newValue[index]
        newValue[index] = newValue[index - 1]
        newValue[index - 1] = temp

        onChange(newValue)
    }

    const SectionDown = (index: number) => {
        let newValue = [...values]
        const temp = newValue[index]
        newValue[index] = newValue[index + 1]
        newValue[index + 1] = temp

        onChange(newValue)
    }

    const onHandleChange = (name: string, value: any) => {
        let newValue = [...values]
        set(newValue, name, value)

        onChange(newValue)
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {values.map((section, idx) => (
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
                                    section={section.type || undefined}
                                    element={section.elementId || undefined}
                                    onSectionChange={(e) => onHandleChange(`${idx}.type`, e)}
                                    onElementChange={(e) => onHandleChange(`${idx}.elementId`, e)}
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
                                    onChange={(e) => onHandleChange(`${idx}.formId`, e)}
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
    )
}

Admin.requireAuth = true

export default Admin
function kebabcase(value: string): any {
    throw new Error('Function not implemented.')
}
