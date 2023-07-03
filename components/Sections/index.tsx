import { FloatButton } from 'antd'
import {
    MenuOutlined,
    CloseOutlined,
    CheckOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LoadingOutlined,
} from '@ant-design/icons'

interface SectionsFloatButtonsProps {
    loading: boolean
    active: boolean
    open: boolean
    onOpenClick(): void
    onResetClick(): void
    onSubmit(): void
}

export const SectionsFloatButtons = ({
    loading,
    active,
    open,
    onOpenClick,
    onResetClick,
    onSubmit,
}: SectionsFloatButtonsProps) => (
    <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: '2.5rem', opacity: 1 }}
        icon={loading ? <LoadingOutlined /> : <MenuOutlined />}
    >
        {!loading && (
            <>
                {active && (
                    <FloatButton
                        icon={open ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                        onClick={onOpenClick}
                    />
                )}
                <FloatButton icon={<CloseOutlined />} onClick={onResetClick} />
                <FloatButton type="primary" icon={<CheckOutlined />} onClick={onSubmit} />
            </>
        )}
    </FloatButton.Group>
)
