'use client'

import { Button, Card, Input, Radio, Space } from 'antd'
import {
    PictureOutlined,
    VideoCameraOutlined,
    FilePdfOutlined,
    SearchOutlined,
    UploadOutlined,
} from '@ant-design/icons'
import UploadButton from '~/components/UploadButton'

const Settings = () => {
    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        <Input size="small" suffix={<SearchOutlined />} />
                        <Radio.Group buttonStyle="solid" size="small">
                            <Radio.Button value="image">
                                <Space align="center">
                                    <PictureOutlined />
                                    Images
                                </Space>
                            </Radio.Button>
                            <Radio.Button value="video">
                                <Space align="center">
                                    <VideoCameraOutlined />
                                    Videos
                                </Space>
                            </Radio.Button>
                            <Radio.Button value="file">
                                <Space align="center">
                                    <FilePdfOutlined />
                                    Files
                                </Space>
                            </Radio.Button>
                        </Radio.Group>
                    </Space>

                    <UploadButton onFileRecieved={() => {}} />
                </div>
            </Card>
            <Card size="small" style={{ flex: 1 }}></Card>
        </>
    )
}

export default Settings
