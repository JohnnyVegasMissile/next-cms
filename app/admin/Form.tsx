'use client'

import {
    Avatar,
    Button,
    Card,
    Col,
    Input,
    InputNumber,
    List,
    Row,
    Image,
    Space,
    Typography,
    Switch,
    Select,
    message,
    ColorPicker,
    Upload,
    Tabs,
    Tooltip,
    Transfer,
    Table,
    Tag,
} from 'antd'
import {
    UploadOutlined,
    CheckOutlined,
    ReloadOutlined,
    DownloadOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import { updateSettings } from '~/network/settings'
import SettingsCreation from '~/types/settingsCreation'
import { CodeLanguage, SettingType } from '@prisma/client'
import { revalidateAll } from '~/network/api'
import { exportDB, importDB } from '~/network/db'
import { RcFile } from 'antd/es/upload'
import { ReactNode, useState } from 'react'
import languages from '~/utilities/languages'
import { TableRowSelection } from 'antd/es/table/interface'
import { TransferItem } from 'antd/es/transfer'
import difference from 'lodash/difference'

const { Text } = Typography

const validate = (_: SettingsCreation) => {
    const errors = {}

    return errors
}

interface FormProps {
    settings: SettingsCreation
}

const Settings = ({ settings }: FormProps) => {
    const formik = useFormik<SettingsCreation>({
        initialValues: settings,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const submit = useMutation(
        (values: SettingsCreation) =>
            updateSettings({
                ...values,
                [`${SettingType.LANGUAGE_LOCALES}`]: values[SettingType.LANGUAGE_LOCALES]?.join(', '),
            }),
        {
            onSuccess: () => message.success('Settings modified with success.'),
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    const revalidate = useMutation(() => revalidateAll(), {
        onSuccess: () => message.success('All pages revalidated with success.'),
        onError: () => message.error('Something went wrong, try again later.'),
    })

    const generalLeft = [
        {
            key: '1',
            title: 'App name',
            element: (
                <Input
                    size="small"
                    style={{ width: 200 }}
                    placeholder="Enter app name"
                    value={formik.values[SettingType.APP_NAME]}
                    onChange={(e) => formik.setFieldValue(SettingType.APP_NAME, e.target.value)}
                />
            ),
        },
        {
            key: '2',
            title: 'Favicon',
            element: (
                <Space>
                    <Avatar src="/storage/favicon.ico" shape="square" size="small" />
                    <Button icon={<UploadOutlined />} size="small" type="primary">
                        Upload
                    </Button>
                </Space>
            ),
        },
        {
            key: '3',
            title: 'Fallback image',
            element: (
                <Space>
                    <Image
                        alt="fallback"
                        width={22}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                    <Button icon={<UploadOutlined />} size="small" type="primary">
                        Upload
                    </Button>
                </Space>
            ),
        },
    ]
    const generalRight = [
        {
            key: '5',
            title: 'Maintenance',
            element: (
                <Switch
                    size="small"
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formik.values[SettingType.MAINTENANCE_MODE]}
                    onChange={(e) => formik.setFieldValue(SettingType.MAINTENANCE_MODE, e)}
                />
            ),
        },
        {
            key: '6',
            title: 'Indexed',
            element: (
                <Switch
                    size="small"
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                    checked={formik.values[SettingType.INDEXED]}
                    onChange={(e) => formik.setFieldValue(SettingType.INDEXED, e)}
                />
            ),
        },
        {
            key: '7',
            title: 'Site URL',
            element: (
                <Input
                    size="small"
                    style={{ width: 200 }}
                    placeholder="https://example.com"
                    value={formik.values[SettingType.SITE_URL]}
                    onChange={(e) => formik.setFieldValue(SettingType.SITE_URL, e.target.value)}
                />
            ),
        },
    ]

    const themeLeft = [
        {
            key: '1',
            title: 'Primary color',
            element: (
                <Space>
                    {formik.values[SettingType.PRIMARY_COLOR] && (
                        <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                            formik.values[SettingType.PRIMARY_COLOR]
                        }`}</Text>
                    )}
                    <ColorPicker
                        value={formik.values[SettingType.PRIMARY_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.PRIMARY_COLOR, hex)}
                    />
                </Space>
            ),
        },
        {
            key: '2',
            title: 'Secondary color',
            element: (
                <Space>
                    {formik.values[SettingType.SECONDARY_COLOR] && (
                        <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                            formik.values[SettingType.SECONDARY_COLOR]
                        }`}</Text>
                    )}
                    <ColorPicker
                        value={formik.values[SettingType.SECONDARY_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.SECONDARY_COLOR, hex)}
                    />
                </Space>
            ),
        },
        {
            key: '3',
            title: 'Background color',
            element: (
                <Space>
                    {formik.values[SettingType.BACKGROUND_COLOR] && (
                        <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                            formik.values[SettingType.BACKGROUND_COLOR]
                        }`}</Text>
                    )}
                    <ColorPicker
                        value={formik.values[SettingType.BACKGROUND_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.BACKGROUND_COLOR, hex)}
                    />
                </Space>
            ),
        },
        {
            key: '4',
            title: 'Extra color',
            element: (
                <Space>
                    {formik.values[SettingType.EXTRA_COLOR] && (
                        <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                            formik.values[SettingType.EXTRA_COLOR]
                        }`}</Text>
                    )}
                    <ColorPicker
                        value={formik.values[SettingType.EXTRA_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.EXTRA_COLOR, hex)}
                    />
                </Space>
            ),
        },
    ]

    const themeRight = [
        {
            key: '1',
            title: 'Primary text color',
            element: (
                <Space>
                    {formik.values[SettingType.PRIMARY_TEXT_COLOR] && (
                        <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                            formik.values[SettingType.PRIMARY_TEXT_COLOR]
                        }`}</Text>
                    )}
                    <ColorPicker
                        value={formik.values[SettingType.PRIMARY_TEXT_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.PRIMARY_TEXT_COLOR, hex)}
                    />
                </Space>
            ),
        },
        {
            key: '2',
            title: 'Secondary text color',
            element: (
                <Space>
                    {formik.values[SettingType.SECONDARY_TEXT_COLOR] && (
                        <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                            formik.values[SettingType.SECONDARY_TEXT_COLOR]
                        }`}</Text>
                    )}
                    <ColorPicker
                        value={formik.values[SettingType.SECONDARY_TEXT_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.SECONDARY_TEXT_COLOR, hex)}
                    />
                </Space>
            ),
        },
        {
            key: '3',
            title: 'Dark color',
            element: (
                <Space>
                    {formik.values[SettingType.DARK_COLOR] && (
                        <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                            formik.values[SettingType.DARK_COLOR]
                        }`}</Text>
                    )}
                    <ColorPicker
                        value={formik.values[SettingType.DARK_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.DARK_COLOR, hex)}
                    />
                </Space>
            ),
        },
        {
            key: '4',
            title: 'Light color',
            element: (
                <Space>
                    {formik.values[SettingType.LIGHT_COLOR] && (
                        <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                            formik.values[SettingType.LIGHT_COLOR]
                        }`}</Text>
                    )}
                    <ColorPicker
                        value={formik.values[SettingType.LIGHT_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.LIGHT_COLOR, hex)}
                    />
                </Space>
            ),
        },
    ]

    const emailLeft = [
        {
            key: '1',
            title: 'Host',
            element: <Input size="small" style={{ width: 200 }} placeholder="Enter host" />,
        },
        {
            key: '2',
            title: 'Port',
            element: (
                <InputNumber
                    min={1}
                    max={65535}
                    size="small"
                    style={{ width: 200 }}
                    placeholder="Enter port"
                />
            ),
        },
    ]
    const emailRight = [
        {
            key: '3',
            title: 'Username',
            element: <Input size="small" style={{ width: 200 }} placeholder="Enter username" />,
        },
        {
            key: '4',
            title: 'Password',
            element: <Input.Password size="small" style={{ width: 200 }} placeholder="Enter password" />,
        },
    ]

    const sidebar = [
        {
            key: '1',
            title: 'Sidebar',
            element: (
                <Switch
                    size="small"
                    unCheckedChildren="Hide"
                    checkedChildren="Show"
                    checked={formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                    onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_IS_ACTIVE, e)}
                />
            ),
        },
        {
            key: '2',
            title: 'Orientation',
            element: (
                <Select
                    disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                    value={formik.values[SettingType.SIDEBAR_POSITION]}
                    onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_POSITION, e)}
                    size="small"
                    placeholder="Position"
                    style={{ width: 200 }}
                    options={[
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                    ]}
                />
            ),
        },
        {
            key: '2',
            title: 'Width',
            element: (
                <InputNumber
                    size="small"
                    disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                    value={formik.values[SettingType.SIDEBAR_WIDTH]}
                    onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_WIDTH, e)}
                    style={{ width: 200 }}
                    addonAfter={
                        <Select
                            disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                            value={formik.values[SettingType.SIDEBAR_UNIT]}
                            onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_UNIT, e)}
                            size="small"
                            style={{ width: 65 }}
                            options={[
                                { label: '%', value: '%' },
                                { label: 'px', value: 'px' },
                                { label: 'em', value: 'em' },
                                { label: 'rem', value: 'rem' },
                                { label: 'vw', value: 'vw' },
                            ]}
                        />
                    }
                />
            ),
        },
        {
            key: '3',
            title: 'Background color',
            element: (
                <Space>
                    {formik.values[SettingType.SIDEBAR_COLOR] && (
                        <Text
                            strong
                            type="secondary"
                            style={{ textTransform: 'uppercase' }}
                            disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                        >{`${formik.values[SettingType.SIDEBAR_COLOR]}`}</Text>
                    )}
                    <ColorPicker
                        disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                        value={formik.values[SettingType.SIDEBAR_COLOR]}
                        onChange={(_, hex) => formik.setFieldValue(SettingType.SIDEBAR_COLOR, hex)}
                    />
                </Space>
            ),
        },
        {
            key: '2',
            title: 'Breakpoint',
            element: (
                <Select
                    size="small"
                    disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                    value={formik.values[SettingType.SIDEBAR_BREAKPOINT_SIZE]}
                    onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_BREAKPOINT_SIZE, e)}
                    style={{ width: 200 }}
                    options={[
                        {
                            label: (
                                <Text disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}>
                                    Extra small{' '}
                                    <Text
                                        type="secondary"
                                        disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                                    >
                                        (480px)
                                    </Text>
                                </Text>
                            ),
                            value: 'extra-small',
                        },
                        {
                            label: (
                                <Text disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}>
                                    Medium{' '}
                                    <Text
                                        type="secondary"
                                        disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                                    >
                                        (768px)
                                    </Text>{' '}
                                </Text>
                            ),
                            value: 'medium',
                        },
                        {
                            label: (
                                <Text disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}>
                                    Large{' '}
                                    <Text
                                        type="secondary"
                                        disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                                    >
                                        (1024px)
                                    </Text>
                                </Text>
                            ),
                            value: 'large',
                        },
                        {
                            label: (
                                <Text disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}>
                                    Extra large{' '}
                                    <Text
                                        type="secondary"
                                        disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                                    >
                                        (1280px)
                                    </Text>
                                </Text>
                            ),
                            value: 'extra-large',
                        },
                    ]}
                />
            ),
        },
    ]

    const dbExport = useMutation(() => exportDB())
    const dbImport = useMutation((file: RcFile) => importDB(file), {
        onSuccess: () => message.success('DB imported successfully'),
        onError: () => message.success('Error importing DB'),
    })

    const database = [
        {
            key: '1',
            title: 'Export DB',
            element: (
                <Button
                    size="small"
                    type="primary"
                    icon={<DownloadOutlined />}
                    loading={dbExport.isLoading}
                    onClick={() => dbExport.mutate()}
                >
                    Export
                </Button>
            ),
        },
        {
            key: '2',
            title: 'Import DB',
            element: (
                <Upload
                    accept=".json"
                    fileList={[]}
                    disabled={dbImport.isLoading}
                    beforeUpload={(file) => {
                        dbImport.mutate(file)

                        return false
                    }}
                >
                    <Button loading={dbImport.isLoading} size="small" icon={<UploadOutlined />}>
                        Import
                    </Button>
                </Upload>
            ),
        },
    ]

    const columns = [
        {
            title: 'Name',
            render: (record: any) => `${record?.name} (${record?.en})`,
        },
        {
            width: 75,
            title: 'Code',
            render: (record: any) => <Tag>{record.code}</Tag>,
        },
    ]

    const language = [
        {
            key: '1',
            title: 'Preferred language',
            element: (
                <Select
                    size="small"
                    disabled={!formik.values.LANGUAGE_LOCALES?.length}
                    value={formik.values[SettingType.LANGUAGE_PREFERRED]}
                    onChange={(e) => formik.setFieldValue(SettingType.LANGUAGE_PREFERRED, e)}
                    placeholder="Preferred language"
                    style={{ width: 200 }}
                    options={formik.values.LANGUAGE_LOCALES?.map((e) => ({
                        value: e,
                        label: languages[e as CodeLanguage]?.name,
                    }))}
                />
            ),
        },
        {
            key: '2',
            title: 'Allowed languages',
            element: (
                <Transfer
                    showSearch={true}
                    style={{ maxWidth: 750 }}
                    targetKeys={formik.values.LANGUAGE_LOCALES}
                    oneWay={formik.values.LANGUAGE_LOCALES?.length === 1}
                    dataSource={Object.keys(languages).map((key) => ({
                        key,
                        ...languages[key as CodeLanguage],
                        disabled: key === formik.values[SettingType.LANGUAGE_PREFERRED],
                    }))}
                    onChange={(e) => formik.setFieldValue(SettingType.LANGUAGE_LOCALES, e)}
                    filterOption={(inputValue, item) =>
                        item.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
                        item.en.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
                        item.code.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                    }
                >
                    {({
                        filteredItems,
                        onItemSelectAll,
                        onItemSelect,
                        selectedKeys: listSelectedKeys,
                        disabled: listDisabled,
                    }) => (
                        <Table
                            pagination={false}
                            scroll={{ y: 375 }}
                            rowSelection={{
                                getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
                                onSelectAll(selected, selectedRows) {
                                    const treeSelectedKeys = selectedRows
                                        .filter((item) => !item.disabled)
                                        .map(({ key }) => key)
                                    const diffKeys = selected
                                        ? difference(treeSelectedKeys, listSelectedKeys)
                                        : difference(listSelectedKeys, treeSelectedKeys)
                                    onItemSelectAll(diffKeys as string[], selected)
                                },
                                onSelect({ key }, selected) {
                                    onItemSelect(key as string, selected)
                                },
                                selectedRowKeys: listSelectedKeys,
                            }}
                            columns={columns}
                            dataSource={filteredItems}
                            size="small"
                            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
                            onRow={({ key, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) return
                                    onItemSelect(key as string, !listSelectedKeys.includes(key as string))
                                },
                            })}
                        />
                    )}
                </Transfer>
            ),
        },
    ]

    const [tabKey, setTabKey] = useState('general')

    const grpd = [
        {
            key: '1',
            title: 'Popup style',
            element: (
                <Select
                    size="small"
                    style={{ width: 200 }}
                    options={[
                        { value: 'modal', label: 'Modal' },
                        { value: 'banner', label: 'Banner' },
                    ]}
                />
            ),
        },
        {
            key: '2',
            title: 'Policy page',
            element: <></>,
        },
    ]

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Settings</Text>

                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            size="small"
                            onClick={() => revalidate.mutate()}
                            disabled={submit.isLoading}
                            loading={revalidate.isLoading}
                        >
                            Revalidate all
                        </Button>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={() => formik.handleSubmit()}
                            loading={submit.isLoading}
                        >
                            Save changes
                        </Button>
                    </Space>
                </div>
            </Card>

            <Card
                size="small"
                tabList={[
                    {
                        key: 'general',
                        tab: 'General',
                    },
                    {
                        key: 'theme',
                        tab: 'Theme',
                    },
                    {
                        key: 'sidebar',
                        tab: 'Sidebar',
                    },

                    {
                        key: 'smtp',
                        tab: 'SMTP',
                    },
                    {
                        key: 'grpd',
                        tab: 'GRPD',
                    },
                    {
                        key: 'database',
                        tab: 'Database',
                    },
                    {
                        key: 'language',
                        tab: 'Languages',
                    },
                    {
                        key: 'other',
                        tab: 'Other',
                        disabled: true,
                    },
                ]}
                activeTabKey={tabKey}
                onTabChange={(e) => setTabKey(e)}
            >
                {tabKey === 'general' && (
                    <Row gutter={[8, 8]}>
                        <CustomList list={generalLeft} />
                        <CustomList list={generalRight} />
                    </Row>
                )}
                {tabKey === 'sidebar' && (
                    <Row gutter={[8, 8]}>
                        <CustomList list={sidebar} />
                    </Row>
                )}
                {tabKey === 'theme' && (
                    <Row gutter={[8, 8]}>
                        <CustomList list={themeLeft} />
                        <CustomList list={themeRight} />
                    </Row>
                )}
                {tabKey === 'smtp' && (
                    <Row gutter={[8, 8]}>
                        <CustomList list={emailLeft} />
                        <CustomList list={emailRight} />
                    </Row>
                )}
                {tabKey === 'grpd' && (
                    <Row gutter={[8, 8]}>
                        <CustomList list={grpd} />
                    </Row>
                )}
                {tabKey === 'database' && (
                    <Row gutter={[8, 8]}>
                        <CustomList list={database} />
                    </Row>
                )}
                {tabKey === 'language' && (
                    <List
                        size="small"
                        itemLayout="horizontal"
                        dataSource={language}
                        renderItem={(item) => (
                            <List.Item key={item.key} style={{ padding: 16 }}>
                                <Text strong>{item.title} :</Text>
                                {item.element}
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </>
    )
}

export const dynamic = 'force-dynamic'

export default Settings

const CustomList = ({
    list,
}: {
    list: {
        key: string
        title: string
        element: ReactNode
    }[]
}) => (
    <Col span={12}>
        <List
            size="small"
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => (
                <List.Item key={item.key} style={{ padding: 16 }}>
                    <Text strong>{item.title} :</Text>
                    {item.element}
                </List.Item>
            )}
        />
    </Col>
)
