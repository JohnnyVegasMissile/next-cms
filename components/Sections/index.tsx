import { FloatButton, Tooltip, Typography } from 'antd'
import {
    MenuOutlined,
    CloseOutlined,
    CheckOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LoadingOutlined,
} from '@ant-design/icons'
import { CodeLanguage } from '@prisma/client'
import languages from '~/utilities/languages'

const { Text } = Typography

interface SectionsFloatButtonsProps {
    loading: boolean
    active: boolean
    open: boolean
    onOpenClick(): void
    onResetClick(): void
    onSubmit(): void
    locales: CodeLanguage[]
    preferred: CodeLanguage
    activeLocale: CodeLanguage
    onLocaleChange(code: CodeLanguage): void
}

export const SectionsFloatButtons = ({
    loading,
    active,
    open,
    onOpenClick,
    onResetClick,
    onSubmit,
    locales,
    preferred,
    activeLocale,
    onLocaleChange,
}: SectionsFloatButtonsProps) => (
    <>
        {locales.length > 1 && (
            <FloatButton.Group
                shape="square"
                trigger="click"
                type="primary"
                icon={null}
                style={{ right: 36 + 40 + 24 }}
                description={
                    <Tooltip
                        placement="left"
                        title={`${languages[activeLocale]?.name} (${languages[activeLocale]?.en})`}
                    >
                        {activeLocale}
                    </Tooltip>
                }
            >
                {locales.map((e) => (
                    <FloatButton
                        key={e}
                        type={e === activeLocale ? 'primary' : 'default'}
                        description={
                            <Tooltip placement="left" title={`${languages[e]?.name} (${languages[e]?.en})`}>
                                {e}
                                {e === preferred && <Text type="warning">*</Text>}
                            </Tooltip>
                        }
                        onClick={() => onLocaleChange(e)}
                    />
                ))}
            </FloatButton.Group>
        )}

        <FloatButton.Group
            shape="square"
            trigger="click"
            type="primary"
            style={{ right: 36 }}
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
    </>
)
