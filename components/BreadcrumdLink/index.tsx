import Link from 'next/link'
import { Breadcrumb, Popover, QRCode } from 'antd'
import { LinkOutlined } from '@ant-design/icons'

const BreadcrumdLink = ({ url }: { url: string }) => {
    return (
        <Link href={encodeURI(`/${url}`)} prefetch={false} style={{ textDecoration: 'none' }}>
            <Breadcrumb
                items={[
                    {
                        title: (
                            <Popover
                                overlayInnerStyle={{ padding: 0 }}
                                content={
                                    <QRCode value={`${window.location.origin}/${url}`} bordered={false} />
                                }
                            >
                                <LinkOutlined />
                            </Popover>
                        ),
                    },
                    ...(url.split('/').map((word: string) => ({
                        title: word,
                    })) || []),
                ]}
            />
        </Link>
    )
}

export default BreadcrumdLink
