'use client'

import { Button, Typography } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Text } = Typography

const Homepage = () => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '25vh',
            gap: '1rem',
        }}
    >
        <HomeOutlined style={{ color: '#1677ff', fontSize: 42 }} />
        <Text>Welcome, sign in first to update the homepage</Text>
        <Link href="/sign-in">
            <Button size="small" type="primary">
                Sign in
            </Button>
        </Link>
    </div>
)

export default Homepage
