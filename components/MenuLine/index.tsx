import { Button, Card, Space, Tooltip, Typography } from 'antd'
import styles from './MenuLine.module.scss'
import classNames from 'classnames'
import { PlusOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'

const { Text } = Typography

interface MenuLineProps {
    title: React.ReactNode | undefined
    level?: number
    onClick(): void
    selected?: boolean
    addChild?(): void
}

const MenuLine = ({ title = 'New item', level = 0, onClick, selected, addChild }: MenuLineProps) => (
    <div
        className={styles['wrapper']}
        style={{
            marginLeft: `${level * 3}rem`,
        }}
    >
        <Space align="center" direction="vertical" size={1}>
            <Button size="small" type="primary" icon={<CaretUpOutlined />} />
            <Button size="small" type="primary" icon={<CaretDownOutlined />} />
        </Space>
        <Card
            size="small"
            className={classNames(styles['line'], styles['default'], {
                [styles['selected']!]: selected,
            })}
            onClick={onClick}
        >
            <div className={styles['body']}>
                <Text>{title}</Text>

                <Space>
                    {!!addChild && (
                        <Tooltip title="Add children">
                            <Button
                                size="small"
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={addChild}
                                ghost
                            />
                        </Tooltip>
                    )}
                </Space>
            </div>
        </Card>
    </div>
)

interface AddProps {
    title?: React.ReactNode | undefined
    onClick(): void
}

const Add = ({ title = 'Add new', onClick }: AddProps) => (
    <Card size="small" className={classNames(styles['line'], styles['add'])} onClick={onClick}>
        <div className={styles['body']}>
            <Text type="secondary">
                <PlusOutlined className={styles['icon']} />
                {title}
            </Text>
        </div>
    </Card>
)

MenuLine.Add = Add

export default MenuLine
