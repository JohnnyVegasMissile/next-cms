'use client'

import { Input, Radio, Space } from 'antd'
import { PictureOutlined, VideoCameraOutlined, FilePdfOutlined, SearchOutlined } from '@ant-design/icons'

const Settings = () => {
    return (
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
    )
}

export default Settings
