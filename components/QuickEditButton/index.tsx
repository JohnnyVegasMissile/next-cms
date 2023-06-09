'use client'

import { Affix, Button, Space } from 'antd'
import { ContainerOutlined, ReloadOutlined } from '@ant-design/icons'
import Link from 'next/link'

const QuickEditButton = () => {
    return (
        <Affix offsetTop={37} style={{ position: 'absolute', right: 5, top: 37 }}>
            <Space.Compact size="small" style={{ width: '100%' }}>
                <Button size="small" type="primary">
                    <Link href="/">Edit</Link>
                </Button>
                <Button size="small">
                    <Link href="/" style={{ transition: 'none' }}>
                        <ContainerOutlined rev={undefined} />
                    </Link>
                </Button>
                <Button size="small" type="primary" icon={<ReloadOutlined rev={undefined} />} />
            </Space.Compact>
        </Affix>
    )
}

export default QuickEditButton
