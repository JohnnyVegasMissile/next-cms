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
    Slider,
    Image,
    Space,
    Typography,
    Switch,
    Select,
    message,
    Spin,
} from 'antd'
import { UploadOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons'
import ColorPicker from '~/components/ColorPicker'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useMutation } from '@tanstack/react-query'
import { getSettings, updateSettings } from '~/network/settings'
import SettingsCreation from '~/types/settingsCreation'
import { Setting, SettingType } from '@prisma/client'

const { Text } = Typography

const validate = (values: SettingsCreation) => {
    const errors = {}

    return errors
}

const cleanDetails = (settings: Setting[]): SettingsCreation => {
    const cleanValues: SettingsCreation = {}

    for (const setting of settings) {
        switch (setting.type) {
            case SettingType.REVALIDATE_DELAY:
            case SettingType.MAIL_PORT:
            case SettingType.SIDEBAR_WIDTH:
                cleanValues[setting.type] = parseInt(setting.value)
                break

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
                cleanValues[setting.type] = setting.value as `#${string}`
                break

            case SettingType.SIDEBAR_POSITION:
                cleanValues[setting.type] = setting.value as 'left' | 'right'
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
    const submit = useMutation((values: SettingsCreation) => updateSettings(values), {
        onSuccess: () => message.success(`Settings modified with success.`),
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
                    <Button icon={<UploadOutlined />} size="small" type="primary">
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
                    <Button icon={<UploadOutlined />} size="small" type="primary">
                        Upload
                    </Button>
                </Space>
            ),
        },
        {
            key: '6',
            title: 'Sidebar',
            element: (
                <Space>
                    <Switch
                        size="small"
                        unCheckedChildren="Hide"
                        checkedChildren="Show"
                        checked={formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                        onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_IS_ACTIVE, e)}
                    />
                    <InputNumber
                        size="small"
                        disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                        value={formik.values[SettingType.SIDEBAR_WIDTH]}
                        onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_WIDTH, e)}
                        addonBefore={
                            <Select
                                disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                                value={formik.values[SettingType.SIDEBAR_POSITION]}
                                onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_POSITION, e)}
                                size="small"
                                placeholder="Position"
                                style={{ width: 75 }}
                                options={[
                                    { label: 'Left', value: 'left' },
                                    { label: 'Right', value: 'right' },
                                ]}
                            />
                        }
                        addonAfter={
                            <Select
                                disabled={!formik.values[SettingType.SIDEBAR_IS_ACTIVE]}
                                value={formik.values[SettingType.SIDEBAR_UNIT]}
                                onChange={(e) => formik.setFieldValue(SettingType.SIDEBAR_UNIT, e)}
                                size="small"
                                placeholder="Type"
                                style={{ width: 75 }}
                                options={[
                                    { label: '%', value: '%' },
                                    { label: 'px', value: 'px' },
                                    { label: 'em', value: 'em' },
                                    { label: 'rem', value: 'rem' },
                                    { label: 'wv', value: 'wv' },
                                ]}
                            />
                        }
                    />
                </Space>
            ),
        },
    ]

    const theme = [
        {
            key: '1',
            title: 'Primary color',
            element: (
                <ColorPicker
                    value={formik.values[SettingType.PRIMARY_COLOR]}
                    onChange={(e) => formik.setFieldValue(SettingType.PRIMARY_COLOR, e)}
                />
            ),
        },
        {
            key: '2',
            title: 'Secondary color',
            element: (
                <ColorPicker
                    value={formik.values[SettingType.SECONDARY_COLOR]}
                    onChange={(e) => formik.setFieldValue(SettingType.SECONDARY_COLOR, e)}
                />
            ),
        },
        {
            key: '3',
            title: 'Background color',
            element: (
                <ColorPicker
                    value={formik.values[SettingType.BACKGROUND_COLOR]}
                    onChange={(e) => formik.setFieldValue(SettingType.BACKGROUND_COLOR, e)}
                />
            ),
        },
        //
        {
            key: '4',
            title: 'Primary text color',
            element: (
                <ColorPicker
                    value={formik.values[SettingType.PRIMARY_TEXT_COLOR]}
                    onChange={(e) => formik.setFieldValue(SettingType.PRIMARY_TEXT_COLOR, e)}
                />
            ),
        },
        {
            key: '5',
            title: 'Secondary text color',
            element: (
                <ColorPicker
                    value={formik.values[SettingType.SECONDARY_TEXT_COLOR]}
                    onChange={(e) => formik.setFieldValue(SettingType.SECONDARY_TEXT_COLOR, e)}
                />
            ),
        },
        {
            key: '6',
            title: 'Dark color',
            element: (
                <ColorPicker
                    value={formik.values[SettingType.DARK_COLOR]}
                    onChange={(e) => formik.setFieldValue(SettingType.DARK_COLOR, e)}
                />
            ),
        },
        {
            key: '7',
            title: 'Light color',
            element: (
                <ColorPicker
                    value={formik.values[SettingType.LIGHT_COLOR]}
                    onChange={(e) => formik.setFieldValue(SettingType.LIGHT_COLOR, e)}
                />
            ),
        },
        {
            key: '8',
            title: 'Extra color',
            element: (
                <ColorPicker
                    value={formik.values[SettingType.EXTRA_COLOR]}
                    onChange={(e) => formik.setFieldValue(SettingType.EXTRA_COLOR, e)}
                />
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

    if (details.isLoading) {
        return <Spin />
    }

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Settings</Text>

                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            size="small"
                            // onClick={() => formik.handleSubmit()}
                            disabled={submit.isLoading}
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
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card size="small" title="General" bordered={false}>
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
                </Col>

                <Col span={12}>
                    <Card size="small" title="Theme" bordered={false}>
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={theme}
                            renderItem={(item) => (
                                <List.Item key={item.key} style={{ padding: 16 }}>
                                    <Text strong>{item.title} :</Text>
                                    {item.element}
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card size="small" title="SMTP" bordered={false}>
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
                </Col>

                {/* <Col span={12}>
          <Card></Card>
        </Col> */}
            </Row>
        </>
    )
}

function secondsToDhms(seconds: number | undefined) {
    if (!seconds) return 'Unlimited'

    seconds = Number(seconds)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor((seconds % (3600 * 24)) / 3600)

    const res = []
    if (d > 0) {
        res.push(d + (d == 1 ? ' day, ' : ' days '))
    }

    if (h > 0) {
        res.push(h + (h == 1 ? ' hour' : ' hours'))
    }

    return d === 365 ? '1 Year.' : `${res.join(', ')}.`
}

const RevalidateSlider = () => {
    const [value, setValue] = useState(0)

    // const val = secondsToDhms(value);

    return (
        <Space direction="vertical" align="end">
            {/* {val} */}
            <Slider
                tooltip={{ formatter: (e) => secondsToDhms(e) }}
                value={value}
                onChange={setValue}
                style={{ width: 200 }}
                min={0}
                max={31536000}
                step={3600}
            />
        </Space>
    )
}

export default Settings
