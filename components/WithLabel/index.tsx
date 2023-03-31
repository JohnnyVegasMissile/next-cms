import { Space, Typography } from 'antd'
import { ReactNode } from 'react'

const { Text } = Typography

interface WithLabelProps {
    label?: ReactNode
    children: ReactNode
    error?: string
}

const WithLabel = ({ label, children, error }: WithLabelProps) => {
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            {typeof label === 'string' ? <Text type="secondary">{label}</Text> : label}
            <Space direction="vertical" style={{ width: '100%' }} size={3}>
                {children}
                {!!error && (
                    <Text type="danger" style={{ fontSize: 12 }}>
                        {error}
                    </Text>
                )}
            </Space>
        </Space>
    )
}

export default WithLabel
