import { /*useMemo,*/ useMemo, useState } from 'react'
import { Media, MediaType } from '@prisma/client'
import { Button, Space, Typography, message } from 'antd'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons'
import styles from './UploadButton.module.scss'

import { uploadMedia, uploadFavicon } from '../../network/medias'

interface Props {
    value?: Media
    onDeleteValue?(): void
    onFileRecieved(file: Media): void
    type?: MediaType
    children?: string
}

const UploadButton = ({
    value,
    onDeleteValue,
    onFileRecieved,
    type = MediaType.IMAGE,
    children = 'Upload',
}: Props) => {
    const [loading, setLoading] = useState(false)

    const handleFiles = async (event: any) => {
        setLoading(true)
        const file = event.target.files[0]
        if (!file) return message.error('Missing file')
        // if (file.size >= fileSize * 1024 * 1024) {
        //     return
        // }

        const res: Media = await uploadMedia(file)

        setLoading(false)

        if (res) onFileRecieved(res)
    }

    const accept = useMemo(() => {
        switch (type) {
            case MediaType.IMAGE:
                return 'image/*'
            case MediaType.VIDEO:
                return 'video/*'
            case MediaType.FILE:
                return '.pdf,.xlsx,.xls,.csv,.doc,.docx,.txt'
        }
    }, [type])

    return (
        <Space>
            <Button
                size="small"
                type="primary"
                icon={<UploadOutlined />}
                style={{ position: 'relative' }}
                loading={loading}
            >
                {children}
                <input
                    className={styles['hidden-input']}
                    type="file"
                    name="file"
                    accept={accept}
                    onChange={handleFiles}
                    onClick={(event: any) => {
                        event.target.value = null
                    }}
                />
            </Button>
            {value && (
                <>
                    <Typography.Text underline>{value?.name}</Typography.Text>
                    <Button onClick={onDeleteValue} shape="circle" icon={<CloseOutlined />} />
                </>
            )}
        </Space>
    )
}

const Favicon = () => {
    const [loading, setLoading] = useState(false)
    // const [value, setValue] = useState<File | null>(null)

    const handleFiles = async (event: any) => {
        setLoading(true)
        const file = event.target.files[0]
        if (!file) return
        // if (file.size >= fileSize * 1024 * 1024) {
        //     return
        // }

        await uploadFavicon(file)
        setLoading(false)
    }

    return (
        <Space>
            <Button
                size="small"
                type="primary"
                icon={<UploadOutlined />}
                style={{ position: 'relative' }}
                loading={loading}
            >
                Upload
                <input
                    className={styles['hidden-input']}
                    type="file"
                    name="file"
                    accept=".ico"
                    onChange={handleFiles}
                    // onChange={(e) => {
                    //     toggleModal()
                    //     handleFiles(e)
                    // }}
                    onClick={(event: any) => {
                        event.target.value = null
                    }}
                />
            </Button>
        </Space>
    )
}

UploadButton.Favicon = Favicon

export default UploadButton
