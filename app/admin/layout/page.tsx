'use client'

import { Button, Card, InputNumber, Select, Space, Switch, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Text } = Typography

const Settings = () => {
    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Create new page</Text>

                    <Space>
                        <Text>Sidebar :</Text>
                        <InputNumber
                            size="small"
                            addonBefore={<Switch size="small" unCheckedChildren="No" checkedChildren="Yes" />}
                            addonAfter={
                                <Select
                                    size="small"
                                    placeholder="Type"
                                    style={{ width: 75 }}
                                    allowClear
                                    options={[
                                        { label: '%', value: '%' },
                                        { label: 'px', value: 'px' },
                                        { label: 'em', value: 'em' },
                                        { label: 'rem', value: 'rem' },
                                        { label: 'wv', value: 'wv' },
                                    ]}
                                    // value={type}
                                    // onChange={(e) => setType(e)}
                                />
                            }
                        />
                        <Button type="primary" icon={<PlusOutlined />} size="small">
                            Create new
                        </Button>
                    </Space>
                </div>
            </Card>
        </>
    )
}

export default Settings
