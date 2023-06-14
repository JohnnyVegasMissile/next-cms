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
    Spin,
    ColorPicker,
    Transfer,
    Tooltip,
} from 'antd'
import { UploadOutlined, CheckOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import { getSettings, updateSettings } from '~/network/settings'
import SettingsCreation from '~/types/settingsCreation'
import { Setting, SettingType } from '@prisma/client'
import { revalidateAll } from '~/network/api'
import { time } from 'console'

const { Text } = Typography

type codeLang = 'EN' | 'FR' | 'ES' | 'DE' | 'IT' | 'PT' | 'RU' | 'ZH' | 'JA' | 'KO' | 'AR' | 'TR'

const Locales: { [key in codeLang]: { title: string; en: string } } = {
    EN: { title: 'English', en: 'English' },
    FR: { title: 'Français', en: 'French' },
    ES: { title: 'Español', en: 'Spanish' },
    DE: { title: 'Deutsch', en: 'German' },
    IT: { title: 'Italiano', en: 'Italian' },
    PT: { title: `Português`, en: 'Portuguese' },
    RU: { title: 'Русский', en: 'Russian' },
    ZH: { title: '中文', en: 'Chinese' },
    JA: { title: '日本語', en: 'Japanese' },
    KO: { title: '한국어', en: 'Korean' },
    AR: { title: 'العربية', en: 'Arabic' },
    TR: { title: 'Türkçe', en: 'Turkish' },
}

const validate = (_: SettingsCreation) => {
    const errors = {}

    return errors
}

const cleanDetails = (settings: Setting[]): SettingsCreation => {
    const cleanValues: SettingsCreation = {}

    for (const setting of settings) {
        switch (setting.type) {
            case SettingType.MAIL_PORT:
            case SettingType.SIDEBAR_WIDTH:
                cleanValues[setting.type] = parseInt(setting.value)
                break

            case SettingType.INDEXED:
            case SettingType.SIDEBAR_IS_ACTIVE:
            case SettingType.MAINTENANCE_MODE:
                cleanValues[setting.type] = setting.value === 'true'
                break

            case SettingType.BACKGROUND_COLOR:
            case SettingType.PRIMARY_COLOR:
            case SettingType.SECONDARY_COLOR:

            case SettingType.PRIMARY_TEXT_COLOR:
            case SettingType.SECONDARY_TEXT_COLOR:
            case SettingType.DARK_COLOR:
            case SettingType.LIGHT_COLOR:
            case SettingType.EXTRA_COLOR:

            case SettingType.SIDEBAR_COLOR:
                cleanValues[setting.type] = setting.value as `#${string}`
                break

            case SettingType.SIDEBAR_POSITION:
                cleanValues[setting.type] = setting.value as 'left' | 'right'
                break

            case SettingType.LANGUAGE_LOCALES:
                cleanValues[setting.type] = setting.value.split(', ')
                break

            case SettingType.SIDEBAR_BREAKPOINT_SIZE:
                cleanValues[setting.type] = setting.value as
                    | 'extra-small'
                    | 'small'
                    | 'medium'
                    | 'large'
                    | 'extra-large'
                break

            case SettingType.SIDEBAR_UNIT:
                cleanValues[setting.type] = setting.value as '%' | 'px' | 'em' | 'rem' | 'vw'
                break

            default:
                cleanValues[setting.type] = setting.value
                break
        }
    }

    return cleanValues
}

const Settings = () => {
    const formik = useFormik<SettingsCreation>({
        initialValues: {},
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const details = useMutation(() => getSettings(), {
        onSuccess: (data) => formik.setValues(cleanDetails(data)),
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

    useEffect(() => {
        details.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const general = [
        {
            key: '1',
            title: 'Favicon',
            element: (
                <Space>
                    <Avatar shape="square" />
                    <Button icon={<UploadOutlined rev={undefined} />} size="small" type="primary">
                        Upload
                    </Button>
                </Space>
            ),
        },
        {
            key: '2',
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
            key: '4',
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
            key: '5',
            title: 'Fallback image',
            element: (
                <Space>
                    <Image
                        alt="fallback"
                        width={32}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                    <Button icon={<UploadOutlined rev={undefined} />} size="small" type="primary">
                        Upload
                    </Button>
                </Space>
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
            title: 'App name',
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

    const email = [
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
            element: (
                <></>
                // <LinkSelect />
                // <Space>
                //     {formik.values[SettingType.LIGHT_COLOR] && (
                //         <Text style={{ textTransform: 'uppercase' }} strong type="secondary">{`${
                //             formik.values[SettingType.LIGHT_COLOR]
                //         }`}</Text>
                //     )}
                //     <ColorPicker
                //         value={formik.values[SettingType.LIGHT_COLOR]}
                //         onChange={(_, hex) => formik.setFieldValue(SettingType.LIGHT_COLOR, hex)}
                //     />
                // </Space>
            ),
        },
    ]

    const language = [
        {
            key: '1',
            title: 'Allowed languages',
            element: (
                <Transfer
                    oneWay
                    dataSource={Object.keys(Locales).map((key) => ({
                        key,
                        title: Locales[key as codeLang].title || '',
                        description: Locales[key as codeLang].en || '',
                        disabled: key === formik.values[SettingType.LANGUAGE_PREFERRED],
                    }))}
                    titles={['Inactive', 'Active']}
                    targetKeys={formik.values.LANGUAGE_LOCALES}
                    onChange={(e) => formik.setFieldValue(SettingType.LANGUAGE_LOCALES, e)}
                    render={(item) => (
                        <Space>
                            <Text>{item.title}</Text>
                            <Tooltip title={item.description}>
                                <InfoCircleOutlined rev={undefined} style={{ color: '#aaa' }} />
                            </Tooltip>
                        </Space>
                    )}
                />
            ),
        },
        {
            key: '2',
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
                        label: Locales[e as codeLang]?.title,
                    }))}
                />
            ),
        },
    ]

    if (details.isLoading) return <Spin />

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Settings</Text>

                    <Space>
                        <Button
                            icon={<ReloadOutlined rev={undefined} />}
                            size="small"
                            onClick={() => revalidate.mutate()}
                            disabled={submit.isLoading}
                            loading={revalidate.isLoading}
                        >
                            Revalidate all
                        </Button>
                        <Button
                            type="primary"
                            icon={<CheckOutlined rev={undefined} />}
                            size="small"
                            onClick={() => formik.handleSubmit()}
                            loading={submit.isLoading}
                        >
                            Save changes
                        </Button>
                    </Space>
                </div>
            </Card>
            <Row gutter={[8, 8]} style={{ marginTop: -6 }}>
                <Col span={12}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card size="small" title="General">
                            <List
                                size="small"
                                itemLayout="horizontal"
                                dataSource={general}
                                renderItem={(item) => (
                                    <List.Item key={item.key} style={{ padding: 16 }}>
                                        <Text strong>{item.title} :</Text>
                                        {item.element}
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card size="small" title="SMTP">
                            <List
                                size="small"
                                itemLayout="horizontal"
                                dataSource={email}
                                renderItem={(item) => (
                                    <List.Item key={item.key} style={{ padding: 16 }}>
                                        <Text strong>{item.title} :</Text>
                                        {item.element}
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card size="small" title="GRPD">
                            <List
                                size="small"
                                itemLayout="horizontal"
                                dataSource={grpd}
                                renderItem={(item) => (
                                    <List.Item key={item.key} style={{ padding: 16 }}>
                                        <Text strong>{item.title} :</Text>
                                        {item.element}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Space>
                </Col>
                <Col span={12}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card size="small" title="Theme" bodyStyle={{ display: 'flex' }}>
                            <List
                                style={{ flex: 1, marginRight: 16 }}
                                size="small"
                                itemLayout="horizontal"
                                dataSource={themeLeft}
                                renderItem={(item) => (
                                    <List.Item key={item.key} style={{ padding: 16 }}>
                                        <Text strong>{item.title} :</Text>
                                        {item.element}
                                    </List.Item>
                                )}
                            />
                            <List
                                style={{ flex: 1 }}
                                size="small"
                                itemLayout="horizontal"
                                dataSource={themeRight}
                                renderItem={(item) => (
                                    <List.Item key={item.key} style={{ padding: 16 }}>
                                        <Text strong>{item.title} :</Text>
                                        {item.element}
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card size="small" title="Sidebar">
                            <List
                                size="small"
                                itemLayout="horizontal"
                                dataSource={sidebar}
                                renderItem={(item) => (
                                    <List.Item key={item.key} style={{ padding: 16 }}>
                                        <Text strong>{item.title} :</Text>
                                        {item.element}
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card size="small" title="Internationalization">
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
                        </Card>
                    </Space>
                </Col>
            </Row>
        </>
    )
}

export const dynamic = 'force-dynamic'

export default Settings
