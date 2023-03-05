'use client'

import { Affix, Button, Input } from 'antd'
import { ContainerOutlined, ReloadOutlined } from '@ant-design/icons'
import Link from 'next/link'

const QuickEditButton = () => {
    return (
        <Affix offsetTop={37} style={{ position: 'absolute', right: 5, top: 37 }}>
            <Input.Group compact>
                <Button size="small" type="primary">
                    <Link href="/">Edit</Link>
                </Button>
                <Button size="small">
                    <Link href="/" style={{ transition: 'none' }}>
                        <ContainerOutlined />
                    </Link>
                </Button>
                <Button size="small" type="primary" icon={<ReloadOutlined />} />
            </Input.Group>
        </Affix>
    )
}

export default QuickEditButton
