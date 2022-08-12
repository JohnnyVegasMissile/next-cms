import UploadButton from '../../components/UploadButton'
import { Space, Avatar, InputNumber, Input, Button, Typography, Popover, Slider } from 'antd'
import { useQuery /*, UseQueryResult*/ } from 'react-query'
import { Setting } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getSettings, editSetting } from '../../network/settings'
import get from 'lodash.get'
import useDebounce from '../../hooks/useDebounce'
import Head from 'next/head'
import { SketchPicker, ChromePicker } from 'react-color'
import { BgColorsOutlined } from '@ant-design/icons'

const { Text } = Typography

const Admin = () => {
    const [settings, setSettings] = useState<any>()
    /*const setting: UseQueryResult<Setting[], Error> =*/ useQuery<Setting[], Error>(
        ['settings'],
        () => getSettings(),
        {
            onSuccess: (data: Setting[]) => {
                const newSettings: any = {}
                for (const sett of data) {
                    newSettings[sett.name] = sett.value
                }
                setSettings(newSettings)
            },
        }
    )

    const debouncedRevalidate = useDebounce<string>(settings?.revalidate, 1500)
    const debouncedAppName = useDebounce<string>(settings?.app_name, 1500)

    const debouncedBgColor = useDebounce<string>(settings?.background_color, 1500)
    const debouncedPrColor = useDebounce<string>(settings?.primary_color, 1500)
    const debouncedScColor = useDebounce<string>(settings?.secondary_color, 1500)

    useEffect(() => {
        const update = async () => editSetting('revalidate', settings?.revalidate.toString())

        if (settings?.revalidate) update()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedRevalidate])

    useEffect(() => {
        const update = async () => editSetting('app_name', settings?.app_name.toString())

        if (settings?.app_name) update()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedAppName])

    useEffect(() => {
        const update = async () => editSetting('background_color', settings?.background_color.toString())

        if (settings?.background_color) update()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedBgColor])

    useEffect(() => {
        const update = async () => editSetting('primary_color', settings?.primary_color.toString())

        if (settings?.primary_color) update()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedPrColor])

    useEffect(() => {
        const update = async () => editSetting('secondary_color', settings?.secondary_color.toString())

        if (settings?.secondary_color) update()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedScColor])

    return (
        <>
            <Head>
                <title>Admin - Settings</title>
            </Head>

            <Space
                direction="vertical"
                size="large"
                style={{
                    width: '100%',
                    padding: 15,
                    backgroundColor: '#f0f2f5',
                    minHeight: 'calc(100vh - 29px)',
                }}
            >
                <Space direction="vertical">
                    <Text>Fav Icon: </Text>
                    <Space>
                        <Avatar src="api/uploads/favicon.ico" shape="square" size="large" />
                        <UploadButton.Favicon />
                    </Space>
                </Space>
                <Space direction="vertical">
                    <Text>Validation page time (in sec): </Text>
                    <Space>
                        <Slider
                            style={{ width: 240 }}
                            min={1}
                            max={86400 * 365}
                            onChange={(e) => setSettings((prev: any) => ({ ...prev, revalidate: e }))}
                            value={get(settings, 'revalidate', undefined)}
                            trackStyle={{ backgroundColor: '#1890ff' }}
                            handleStyle={{ borderColor: '#1890ff' }}
                        />
                        <InputNumber
                            min={1}
                            max={86400 * 365}
                            style={{ width: 190 }}
                            value={get(settings, 'revalidate', undefined)}
                            onChange={(e) => setSettings((prev: any) => ({ ...prev, revalidate: e }))}
                            addonAfter="Seconds"
                        />
                    </Space>
                </Space>

                <Space direction="vertical">
                    <Text>App Name: </Text>
                    <Input
                        style={{ width: 240 }}
                        value={get(settings, 'app_name', undefined)}
                        onChange={(e) => setSettings((prev: any) => ({ ...prev, app_name: e.target.value }))}
                    />
                </Space>

                <Space direction="vertical">
                    <Space className="color-picker">
                        <Text>Background color: </Text>
                        <Popover
                            placement="right"
                            trigger="click"
                            content={
                                <ChromePicker
                                    color={get(settings, 'background_color', undefined)}
                                    onChange={(e) =>
                                        setSettings((prev: any) => ({ ...prev, background_color: e.hex }))
                                    }
                                />
                            }
                        >
                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: get(settings, 'background_color', undefined),
                                    borderColor: '#000',
                                }}
                                icon={<BgColorsOutlined />}
                            />
                        </Popover>
                    </Space>
                    <Space>
                        <Text>Primary color: </Text>
                        <Popover
                            placement="right"
                            trigger="click"
                            content={
                                <ChromePicker
                                    color={get(settings, 'primary_color', undefined)}
                                    onChange={(e) =>
                                        setSettings((prev: any) => ({ ...prev, primary_color: e.hex }))
                                    }
                                />
                            }
                        >
                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: get(settings, 'primary_color', undefined),
                                    borderColor: '#000',
                                }}
                                icon={<BgColorsOutlined />}
                            />
                        </Popover>
                    </Space>
                    <Space>
                        <Text>Secondary color: </Text>
                        <Popover
                            placement="right"
                            trigger="click"
                            content={
                                <ChromePicker
                                    color={get(settings, 'secondary_color', undefined)}
                                    onChange={(e) =>
                                        setSettings((prev: any) => ({ ...prev, secondary_color: e.hex }))
                                    }
                                />
                            }
                        >
                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: get(settings, 'secondary_color', undefined),
                                    borderColor: '#000',
                                }}
                                icon={<BgColorsOutlined />}
                            />
                        </Popover>
                    </Space>
                </Space>
            </Space>
        </>
    )
}

Admin.requireAuth = true

export default Admin
