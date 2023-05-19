'use client'

import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Tooltip,
    Typography,
} from 'antd'
import { CheckOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useFormik } from 'formik'
import { RightType } from '@prisma/client'
import RoleCreation from '~/types/roleCreation'
import WithLabel from '~/components/WithLabel'

const { Text } = Typography

const initialValues: RoleCreation = {
    name: '',
    limitUpload: undefined,
    rights: new Set([
        RightType.VIEW_ALL_PAGE,
        RightType.VIEW_ALL_CONTAINER,
        RightType.VIEW_ALL_CONTENT,
        RightType.VIEW_ALL_MEDIA,
        RightType.VIEW_ALL_FORM,
        RightType.VIEW_MESSAGE,
        RightType.VIEW_USER,
        RightType.VIEW_ALL_ROLE,
        RightType.VIEW_LAYOUT,
        RightType.VIEW_SETTING,
        RightType.REVALIDATE,
    ]),
}

const validate = (values: RoleCreation) => {
    const errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    return errors
}

const Settings = ({ params }: any) => {
    const { roleId } = params
    const isUpdate = roleId !== 'create'
    const formik = useFormik<RoleCreation>({
        initialValues,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2))
        },
    })

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{isUpdate ? 'Update' : 'Create new'} menu</Text>

                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        size="small"
                        onClick={() => formik.handleSubmit()}
                        // loading={submit.isLoading}
                    >
                        {isUpdate ? 'Update role' : 'Create new'}
                    </Button>
                </div>
            </Card>

            <Card title="Details" size="small">
                <Row gutter={[16, 16]} style={{ flex: 1 }}>
                    <Col span={8}>
                        <WithLabel label="Name :" error={formik.errors.name}>
                            <Input
                                size="small"
                                status={!!formik.errors.name ? 'error' : undefined}
                                style={{ width: '100%' }}
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                        </WithLabel>
                    </Col>
                </Row>
            </Card>

            <Card title="Rights" size="small">
                <Row gutter={[16, 16]} style={{ flex: 1 }}>
                    <Col span={6}>
                        <Card title="Pages" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <RightSelect
                                    allValue={RightType.VIEW_ALL_PAGE}
                                    myValue={RightType.VIEW_MY_PAGE}
                                    rightsValue={formik.values.rights}
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    action="View"
                                    element="pages"
                                    releated={[
                                        { all: RightType.UPDATE_ALL_PAGE, my: RightType.UPDATE_MY_PAGE },
                                        { all: RightType.DELETE_ALL_PAGE, my: RightType.DELETE_MY_PAGE },
                                        {
                                            all: RightType.UPDATE_ALL_PAGE_SECTION,
                                            my: RightType.UPDATE_MY_PAGE_SECTION,
                                        },
                                    ]}
                                    otherReleated={[RightType.CREATE_PAGE]}
                                    defaultChecked={[RightType.CREATE_PAGE, RightType.UPDATE_ALL_PAGE]}
                                />

                                {(formik.values.rights.has(RightType.VIEW_MY_PAGE) ||
                                    formik.values.rights.has(RightType.VIEW_ALL_PAGE)) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />

                                        <SimpleRightSelect
                                            right={RightType.CREATE_PAGE}
                                            rights={formik.values.rights}
                                            label="Create new pages"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_PAGE}
                                            myValue={RightType.UPDATE_MY_PAGE}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="pages"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_PAGE)}
                                        />
                                        <RightSelect
                                            allValue={RightType.DELETE_ALL_PAGE}
                                            myValue={RightType.DELETE_MY_PAGE}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Delete"
                                            element="pages"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_PAGE)}
                                        />

                                        <Divider style={{ margin: 0 }} />

                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_PAGE_SECTION}
                                            myValue={RightType.UPDATE_MY_PAGE_SECTION}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="pages sections"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_PAGE)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Containers" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <RightSelect
                                    allValue={RightType.VIEW_ALL_CONTAINER}
                                    myValue={RightType.VIEW_MY_CONTAINER}
                                    rightsValue={formik.values.rights}
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    action="View"
                                    element="containers"
                                    releated={[
                                        {
                                            all: RightType.UPDATE_ALL_CONTAINER,
                                            my: RightType.UPDATE_MY_CONTAINER,
                                        },
                                        {
                                            all: RightType.DELETE_ALL_CONTAINER,
                                            my: RightType.DELETE_MY_CONTAINER,
                                        },
                                        {
                                            all: RightType.UPDATE_ALL_CONTAINER_SECTION,
                                            my: RightType.UPDATE_MY_CONTAINER_SECTION,
                                        },
                                        {
                                            all: RightType.UPDATE_ALL_CONTAINER_TEMPLATE_SECTION,
                                            my: RightType.UPDATE_MY_CONTAINER_TEMPLATE_SECTION,
                                        },
                                    ]}
                                    otherReleated={[RightType.CREATE_CONTAINER]}
                                />

                                {(formik.values.rights.has(RightType.VIEW_MY_CONTAINER) ||
                                    formik.values.rights.has(RightType.VIEW_ALL_CONTAINER)) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />

                                        <SimpleRightSelect
                                            right={RightType.CREATE_CONTAINER}
                                            rights={formik.values.rights}
                                            label="Create new containers"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_CONTAINER}
                                            myValue={RightType.UPDATE_MY_CONTAINER}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="containers"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_CONTAINER)}
                                        />
                                        <RightSelect
                                            allValue={RightType.DELETE_ALL_CONTAINER}
                                            myValue={RightType.DELETE_MY_CONTAINER}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Delete"
                                            element="containers"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_CONTAINER)}
                                        />

                                        <Divider style={{ margin: 0 }} />

                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_CONTAINER_SECTION}
                                            myValue={RightType.UPDATE_MY_CONTAINER_SECTION}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="containers sections"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_CONTAINER)}
                                        />
                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_CONTAINER_TEMPLATE_SECTION}
                                            myValue={RightType.UPDATE_MY_CONTAINER_TEMPLATE_SECTION}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="containers template sections"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_CONTAINER)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Contents" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <RightSelect
                                    allValue={RightType.VIEW_ALL_CONTENT}
                                    myValue={RightType.VIEW_MY_CONTENT}
                                    rightsValue={formik.values.rights}
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    action="View"
                                    element="contents"
                                    releated={[
                                        {
                                            all: RightType.UPDATE_ALL_CONTENT,
                                            my: RightType.UPDATE_MY_CONTENT,
                                        },
                                        {
                                            all: RightType.DELETE_ALL_CONTENT,
                                            my: RightType.DELETE_MY_CONTENT,
                                        },
                                        {
                                            all: RightType.UPDATE_ALL_CONTENT_SECTION,
                                            my: RightType.UPDATE_MY_CONTENT_SECTION,
                                        },
                                    ]}
                                    otherReleated={[RightType.CREATE_CONTENT]}
                                />

                                {(formik.values.rights.has(RightType.VIEW_MY_CONTENT) ||
                                    formik.values.rights.has(RightType.VIEW_ALL_CONTENT)) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />

                                        <SimpleRightSelect
                                            right={RightType.CREATE_CONTENT}
                                            rights={formik.values.rights}
                                            label="Create new contents"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_CONTENT}
                                            myValue={RightType.UPDATE_MY_CONTENT}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="contents"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_CONTENT)}
                                        />
                                        <RightSelect
                                            allValue={RightType.DELETE_ALL_CONTENT}
                                            myValue={RightType.DELETE_MY_CONTENT}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Delete"
                                            element="contents"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_CONTENT)}
                                        />

                                        <Divider style={{ margin: 0 }} />

                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_CONTENT_SECTION}
                                            myValue={RightType.UPDATE_MY_CONTENT_SECTION}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="contents sections"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_CONTENT)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Medias" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <RightSelect
                                    allValue={RightType.VIEW_ALL_MEDIA}
                                    myValue={RightType.VIEW_MY_MEDIA}
                                    rightsValue={formik.values.rights}
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    action="View"
                                    element="medias"
                                    releated={[
                                        {
                                            all: RightType.UPDATE_ALL_MEDIA,
                                            my: RightType.UPDATE_MY_MEDIA,
                                        },
                                        {
                                            all: RightType.DELETE_ALL_MEDIA,
                                            my: RightType.DELETE_MY_MEDIA,
                                        },
                                    ]}
                                    otherReleated={[RightType.UPLOAD_MEDIA]}
                                />

                                {(formik.values.rights.has(RightType.VIEW_MY_MEDIA) ||
                                    formik.values.rights.has(RightType.VIEW_ALL_MEDIA)) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />

                                        <SimpleRightSelect
                                            right={RightType.UPLOAD_MEDIA}
                                            rights={formik.values.rights}
                                            label="Upload medias"
                                            onChange={(e) => {
                                                formik.setFieldValue('rights', e)

                                                if (!e.has(RightType.UPLOAD_MEDIA)) {
                                                    formik.setFieldValue('limitUpload', undefined)
                                                }
                                            }}
                                        />

                                        {formik.values.rights.has(RightType.UPLOAD_MEDIA) && (
                                            <Space>
                                                <Text>Max upload</Text>
                                                <InputNumber
                                                    style={{ width: 150 }}
                                                    size="small"
                                                    addonAfter="MB"
                                                    min={0}
                                                    value={formik.values.limitUpload}
                                                    onChange={(e) => formik.setFieldValue('limitUpload', e)}
                                                />
                                            </Space>
                                        )}

                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_MEDIA}
                                            myValue={RightType.UPDATE_MY_MEDIA}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="medias"
                                            info="Modify the ALT of the pictures"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_MEDIA)}
                                        />
                                        <RightSelect
                                            allValue={RightType.DELETE_ALL_MEDIA}
                                            myValue={RightType.DELETE_MY_MEDIA}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Delete"
                                            element="medias"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_MEDIA)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Forms" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <RightSelect
                                    allValue={RightType.VIEW_ALL_FORM}
                                    myValue={RightType.VIEW_MY_FORM}
                                    rightsValue={formik.values.rights}
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    action="View"
                                    element="forms"
                                    releated={[
                                        {
                                            all: RightType.UPDATE_ALL_FORM,
                                            my: RightType.UPDATE_MY_FORM,
                                        },
                                        {
                                            all: RightType.DELETE_ALL_FORM,
                                            my: RightType.DELETE_MY_FORM,
                                        },
                                    ]}
                                    otherReleated={[RightType.CREATE_FORM]}
                                />

                                {(formik.values.rights.has(RightType.VIEW_MY_FORM) ||
                                    formik.values.rights.has(RightType.VIEW_ALL_FORM)) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />

                                        <SimpleRightSelect
                                            right={RightType.CREATE_FORM}
                                            rights={formik.values.rights}
                                            label="Create new forms"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_FORM}
                                            myValue={RightType.UPDATE_MY_FORM}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="forms"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_FORM)}
                                        />
                                        <RightSelect
                                            allValue={RightType.DELETE_ALL_FORM}
                                            myValue={RightType.DELETE_MY_FORM}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Delete"
                                            element="forms"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_FORM)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Messages" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <SimpleRightSelect
                                    right={RightType.VIEW_MESSAGE}
                                    rights={formik.values.rights}
                                    label="View messages"
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    releated={[RightType.READ_MESSAGE, RightType.DELETE_MESSAGE]}
                                />

                                {formik.values.rights.has(RightType.VIEW_MESSAGE) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />

                                        <SimpleRightSelect
                                            right={RightType.READ_MESSAGE}
                                            rights={formik.values.rights}
                                            label="Read messages"
                                            info="Messages will be marked as read by the user"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <SimpleRightSelect
                                            right={RightType.DELETE_MESSAGE}
                                            rights={formik.values.rights}
                                            label="Delete messages"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Users" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <SimpleRightSelect
                                    right={RightType.VIEW_USER}
                                    rights={formik.values.rights}
                                    label="View users"
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    releated={[
                                        RightType.CREATE_USER,
                                        RightType.UPDATE_USER,
                                        RightType.DELETE_USER,
                                    ]}
                                />

                                {formik.values.rights.has(RightType.VIEW_USER) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />

                                        <SimpleRightSelect
                                            right={RightType.CREATE_USER}
                                            rights={formik.values.rights}
                                            label="Create new users"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <SimpleRightSelect
                                            right={RightType.UPDATE_USER}
                                            rights={formik.values.rights}
                                            label="Update users"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <SimpleRightSelect
                                            right={RightType.DELETE_USER}
                                            rights={formik.values.rights}
                                            label="Delete users"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Roles" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <RightSelect
                                    allValue={RightType.VIEW_ALL_ROLE}
                                    myValue={RightType.VIEW_MY_ROLE}
                                    rightsValue={formik.values.rights}
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    action="View"
                                    element="roles"
                                    releated={[
                                        {
                                            all: RightType.UPDATE_ALL_ROLE,
                                            my: RightType.UPDATE_MY_ROLE,
                                        },
                                        {
                                            all: RightType.DELETE_ALL_ROLE,
                                            my: RightType.DELETE_MY_ROLE,
                                        },
                                    ]}
                                    otherReleated={[RightType.CREATE_ROLE]}
                                />

                                {(formik.values.rights.has(RightType.VIEW_MY_ROLE) ||
                                    formik.values.rights.has(RightType.VIEW_ALL_ROLE)) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />

                                        <SimpleRightSelect
                                            right={RightType.CREATE_ROLE}
                                            rights={formik.values.rights}
                                            label="Create new roles"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <RightSelect
                                            allValue={RightType.UPDATE_ALL_ROLE}
                                            myValue={RightType.UPDATE_MY_ROLE}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Update"
                                            element="roles"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_ROLE)}
                                        />
                                        <RightSelect
                                            allValue={RightType.DELETE_ALL_ROLE}
                                            myValue={RightType.DELETE_MY_ROLE}
                                            rightsValue={formik.values.rights}
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                            action="Delete"
                                            element="roles"
                                            cantAll={!formik.values.rights.has(RightType.VIEW_ALL_ROLE)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Layout" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <SimpleRightSelect
                                    right={RightType.VIEW_LAYOUT}
                                    rights={formik.values.rights}
                                    label="View layout"
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                />
                                <SimpleRightSelect
                                    right={RightType.UPDATE_LAYOUT}
                                    rights={formik.values.rights}
                                    label="Update layout"
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                />
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Settings" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <SimpleRightSelect
                                    right={RightType.VIEW_SETTING}
                                    rights={formik.values.rights}
                                    label="View settings"
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                    releated={[
                                        RightType.UPDATE_GENERAL,
                                        RightType.UPDATE_THEME,
                                        RightType.UPDATE_SMTP,
                                    ]}
                                />

                                {formik.values.rights.has(RightType.VIEW_SETTING) && (
                                    <>
                                        <Divider style={{ margin: 0 }} />
                                        <SimpleRightSelect
                                            right={RightType.UPDATE_GENERAL}
                                            rights={formik.values.rights}
                                            label="Create new users"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <SimpleRightSelect
                                            right={RightType.UPDATE_THEME}
                                            rights={formik.values.rights}
                                            label="Update theme"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <SimpleRightSelect
                                            right={RightType.UPDATE_SIDEBAR}
                                            rights={formik.values.rights}
                                            label="Update sidebar"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                        <SimpleRightSelect
                                            right={RightType.UPDATE_SMTP}
                                            rights={formik.values.rights}
                                            label="Update SMTP"
                                            onChange={(e) => formik.setFieldValue('rights', e)}
                                        />
                                    </>
                                )}
                            </Space>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="Others" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <SimpleRightSelect
                                    right={RightType.REVALIDATE}
                                    rights={formik.values.rights}
                                    label="Revalidate"
                                    onChange={(e) => formik.setFieldValue('rights', e)}
                                />
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default Settings

interface RightSelectProps {
    allValue: RightType
    myValue: RightType
    rightsValue: Set<RightType>
    onChange(value: Set<RightType>): void
    action: string
    element: string
    cantAll?: boolean
    releated?: { all: RightType; my: RightType }[]
    otherReleated?: RightType[]
    info?: string
    defaultChecked?: RightType[]
}

const RightSelect = ({
    allValue,
    myValue,
    rightsValue,
    onChange,
    action,
    element,
    cantAll,
    releated,
    otherReleated,
    info,
    defaultChecked,
}: RightSelectProps) => {
    const onCheckChange = (checked: boolean) => {
        const copy = new Set(rightsValue)
        if (checked) {
            if (cantAll) {
                copy.add(myValue)
            } else {
                copy.add(allValue)
            }

            if (!!defaultChecked) defaultChecked.forEach((r) => copy.add(r))
        } else {
            copy.delete(allValue)
            copy.delete(myValue)

            if (!!releated) {
                releated.forEach((r) => {
                    if (copy.has(r.all)) copy.delete(r.all)
                    if (copy.has(r.my)) copy.delete(r.my)
                })
            }
            if (!!otherReleated) {
                otherReleated.forEach((r) => {
                    if (copy.has(r)) copy.delete(r)
                })
            }
        }
        onChange(copy)
    }

    const disabled = !rightsValue.has(myValue) && !rightsValue.has(allValue)

    return (
        <Space>
            <Checkbox
                checked={rightsValue.has(allValue) || rightsValue.has(myValue)}
                onChange={(e) => onCheckChange(e.target.checked)}
            />
            <Space size={0}>
                <Text>{action}</Text>
                <Select
                    style={{ width: 57 }}
                    size="small"
                    bordered={false}
                    value={rightsValue.has(myValue) || cantAll ? 'my' : 'all'}
                    onChange={(e) => {
                        const copy = new Set(rightsValue)
                        if (e === 'all') {
                            copy.delete(myValue)
                            copy.add(allValue)
                        } else {
                            copy.delete(allValue)
                            copy.add(myValue)

                            if (!!releated) {
                                releated.forEach((r) => {
                                    if (copy.has(r.all)) {
                                        copy.delete(r.all)
                                        copy.add(r.my)
                                    }
                                })
                            }
                        }

                        onChange(copy)
                    }}
                    options={[{ value: 'all', disabled: cantAll }, { value: 'my' }]}
                    disabled={disabled}
                />
                <Text>{element}</Text>
            </Space>
            {info && (
                <Tooltip title={info}>
                    <InfoCircleOutlined rev="" style={{ color: '#aaa' }} />
                </Tooltip>
            )}
        </Space>
    )
}

interface SimpleRightSelectProps {
    right: RightType
    rights: Set<RightType>
    label: string
    onChange(value: Set<RightType>): void
    info?: string
    releated?: RightType[]
    defaultChecked?: RightType[]
}

const SimpleRightSelect = ({
    right,
    rights,
    label,
    onChange,
    info,
    releated,
    defaultChecked,
}: SimpleRightSelectProps) => (
    <Space>
        <Checkbox
            checked={rights.has(right)}
            onChange={(e) => {
                const copy = new Set(rights)
                if (e.target.checked) {
                    copy.add(right)

                    if (!!defaultChecked) defaultChecked.forEach((r) => copy.add(r))
                } else {
                    copy.delete(right)

                    if (!!releated) releated.forEach((r) => copy.delete(r))
                }
                onChange(copy)
            }}
        />
        <Text>{label}</Text>
        {info && (
            <Tooltip title={info}>
                <InfoCircleOutlined rev="" style={{ color: '#aaa' }} />
            </Tooltip>
        )}
    </Space>
)
