import { useState } from 'react'
import type { Media } from '@prisma/client'
import { Button, Space, Typography } from 'antd'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons'

import { uploadImage, uploadFavicon } from '../../network/images'

interface Props {
    value?: Media
    onDeleteValue?(): void
    onFileRecieved(file: Media): void
}

const UploadButton = ({ value, onDeleteValue, onFileRecieved }: Props) => {
    const [loading, setLoading] = useState(false)
    // const [value, setValue] = useState<File | null>(null)

    const handleFiles = async (event: any) => {
        setLoading(true)
        const file = event.target.files[0]
        if (!file) return
        // if (file.size >= fileSize * 1024 * 1024) {
        //     return
        // }

        const res: Media = await uploadImage(file)

        setLoading(false)

        if (res) onFileRecieved(res)
    }

    return (
        <Space>
            <Button
                type="primary"
                icon={<UploadOutlined />}
                style={{ position: 'relative' }}
                loading={loading}
            >
                Upload
                <input
                    style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        fontSize: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        opacity: 0,
                        zIndex: 1,
                    }}
                    type="file"
                    name="file"
                    accept=".jpg,.jpeg,.png"
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
                type="primary"
                icon={<UploadOutlined />}
                style={{ position: 'relative' }}
                loading={loading}
            >
                Upload
                <input
                    style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        fontSize: 0,
                        backgroundColor: 'transparent',
                        border: 'none',
                        opacity: 0,
                        zIndex: 1,
                    }}
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
