'use client'

import Link from 'next/link'
import { Button, Result } from 'antd'

interface NotFoundResultProps {
    subtitle: string
    link: string
    buttonText: string
}

const NotFoundResult = ({ subtitle, link, buttonText }: NotFoundResultProps) => (
    <Result
        status="404"
        title="404"
        subTitle={subtitle}
        extra={
            <Link href={link}>
                <Button type="primary">{buttonText}</Button>
            </Link>
        }
    />
)

export default NotFoundResult
