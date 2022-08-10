import { Button, Space, Typography } from 'antd'
import Link from 'next/link'

const { Title } = Typography

const MissingInstall = () => {
    return (
        <Space
            direction="vertical"
            size="large"
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Title>Please install the defaults first</Title>
            <Link href="/install">
                <a>
                    <Button type="primary" size="large">
                        Go to Install
                    </Button>
                </a>
            </Link>
        </Space>
    )
}

export default MissingInstall
