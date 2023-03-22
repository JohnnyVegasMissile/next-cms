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
            {children}
            {!!error && <Text type="danger">Name is required</Text>}
        </Space>
    )
}

export default WithLabel
