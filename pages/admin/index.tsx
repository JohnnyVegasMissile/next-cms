import UploadButton from '../../components/UploadButton'
import { Space, Avatar, InputNumber } from 'antd'
import { useQuery /*, UseQueryResult*/ } from 'react-query'
import { Media, Setting } from '@prisma/client'
import { useEffect, useState } from 'react'
import { getSettings, editSetting } from '../../network/settings'
import get from 'lodash.get'
import useDebounce from '../../hooks/useDebounce'
import MediaModal from '../../components/MediaModal'
import LinkInput from '@components/LinkInput'
import Head from 'next/head'

const Admin = () => {
    const [settings, setSettings] = useState<any>()
    const [values, setValues] = useState('')
    const [picture, setPicture] = useState<Media | undefined>()
    /*const setting: UseQueryResult<Setting[], Error> =*/ useQuery<Setting[], Error>(
        ['setting'],
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

    const debouncedValue = useDebounce<string>(settings?.revalidate, 1500)

    useEffect(() => {
        const update = async () => editSetting('revalidate', settings?.revalidate.toString())

        if (settings?.revalidate) update()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue])

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
                <Space>
                    <Avatar src="/favicon.ico" shape="square" size="large" />
                    <UploadButton.Favicon />
                </Space>
                <InputNumber
                    value={get(settings, 'revalidate', undefined)}
                    onChange={(e) => setSettings((prev: any) => ({ ...prev, revalidate: e }))}
                />
                <MediaModal value={picture} onMediaSelected={setPicture} />
                <LinkInput value={values} onChange={setValues} />
            </Space>
        </>
    )
}

Admin.requireAuth = true

export default Admin
