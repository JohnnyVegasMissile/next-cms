import { Button, Card, Dropdown, Input, Space, Tooltip, Typography } from 'antd'
import styles from './MenuLine.module.scss'
import classNames from 'classnames'
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'

const { Text } = Typography

interface MenuLineProps {
    name: string
    title: string
    label: string
    type: string
    error: any | undefined
    onLabelChange(value: any): void

    // title: React.ReactNode | undefined
    level?: number
    onClick(): void
    selected?: boolean
    addChild?(type: 'TITLE' | 'LINK' | 'CONTENT'): void
}

const MenuLine = ({
    level = 0,
    title,
    error,
    name,
    label,
    onLabelChange,
    onClick,
    selected,
    addChild,
}: MenuLineProps) => {
    const items = [
        { key: 'TITLE', label: 'Title', onClick: () => addChild!('TITLE') },
        { key: 'LINK', label: 'Link', onClick: () => addChild!('LINK') },
        { key: 'CONTENT', label: 'Content', onClick: () => addChild!('CONTENT') },
    ]

    return (
        <div className={styles['wrapper']} style={{ marginLeft: `${level * 3}rem` }}>
            <Space align="center" direction="vertical" size={1}>
                <Button size="small" type="primary" icon={<CaretUpOutlined />} />
                <Button size="small" type="primary" icon={<CaretDownOutlined />} />
            </Space>
            <Card
                size="small"
                className={classNames(styles['line'], styles['default'], {
                    [styles['selected']!]: selected,
                    [styles['error']!]: !!error?.link || !!error?.container,
                })}
                onClick={onClick}
            >
                <div className={styles['body']}>
                    <Space>
                        <Text strong type={!!error?.label ? 'danger' : undefined}>{`${title} :`}</Text>
                        <Input
                            size="small"
                            placeholder="Menu label"
                            bordered={false}
                            name={name}
                            value={label}
                            onChange={onLabelChange}
                        />
                    </Space>

                    <Space>
                        {!!addChild && (
                            <Tooltip title="Add children">
                                <Dropdown menu={{ items }} trigger={['click']}>
                                    <Button size="small" type="primary" icon={<PlusOutlined />} ghost />
                                </Dropdown>
                            </Tooltip>
                        )}
                    </Space>
                </div>
            </Card>
        </div>
    )
}

interface AddProps {
    title?: React.ReactNode | undefined
    onClick(type: 'TITLE' | 'LINK' | 'CONTENT'): void
}

const Add = ({ title = 'Add new', onClick }: AddProps) => {
    const items = [
        { key: 'TITLE', label: 'Title', onClick: () => onClick('TITLE') },
        { key: 'LINK', label: 'Link', onClick: () => onClick('LINK') },
        { key: 'CONTENT', label: 'Content', onClick: () => onClick('CONTENT') },
    ]

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <Card size="small" className={classNames(styles['line'], styles['add'])}>
                <div className={styles['body']}>
                    <Text type="secondary">
                        <PlusOutlined className={styles['icon']} />
                        {title}
                    </Text>
                </div>
            </Card>
        </Dropdown>
    )
}

MenuLine.Add = Add

export default MenuLine
