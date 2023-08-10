import { Button, FloatButton, Popover, Space, Tooltip, Typography } from 'antd'
import {
    MenuOutlined,
    CloseOutlined,
    CheckOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LoadingOutlined,
    CopyOutlined,
} from '@ant-design/icons'
import { CodeLanguage } from '@prisma/client'
import languages from '~/utilities/languages'
import { useMemo } from 'react'

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
    onCopy(code: CodeLanguage): void
    errors: { [key in string]: { [key in CodeLanguage]?: any } }
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
    onCopy,
    errors,
}: SectionsFloatButtonsProps) => {
    const hasErrors = useMemo(() => {
        const withErrors: CodeLanguage[] = []

        Object.keys(errors).forEach((key) => {
            console.log('errr 0', errors[key])

            Object.keys(errors[key]!).forEach((locale) => {
                console.log(
                    'errr 1',
                    errors[key]![locale as CodeLanguage],
                    !errors[key]![locale as CodeLanguage]
                )

                if (!!errors[key]![locale as CodeLanguage]) {
                    withErrors.push(locale as CodeLanguage)
                }
            })
        })

        return withErrors
    }, [errors])

    return (
        <>
            {locales.length > 1 && (
                <FloatButton.Group
                    shape="square"
                    trigger="click"
                    type="primary"
                    icon={null}
                    style={{
                        right: 36 + 40 + 24,
                        outline: !!hasErrors.length ? '2px solid #ff4d4f' : undefined,
                    }}
                    description={
                        <Tooltip
                            placement="left"
                            title={`${languages[activeLocale]?.name} (${languages[activeLocale]?.en})`}
                        >
                            {languages[activeLocale]?.code.toLocaleUpperCase()}
                        </Tooltip>
                    }
                >
                    {locales.map((locale) => {
                        return (
                            <FloatButton
                                key={locale}
                                type={locale === activeLocale ? 'primary' : 'default'}
                                style={{
                                    outline: hasErrors.includes(locale) ? '2px solid #ff4d4f' : undefined,
                                }}
                                description={
                                    <Popover
                                        overlayInnerStyle={{
                                            padding: 8,
                                        }}
                                        placement="left"
                                        content={
                                            <Space>
                                                <Text>{`${languages[locale]?.name} (${languages[locale]?.en})`}</Text>
                                                {activeLocale !== locale && (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            onCopy(locale)
                                                        }}
                                                        type="primary"
                                                        size="small"
                                                        icon={<CopyOutlined />}
                                                    />
                                                )}
                                            </Space>
                                        }
                                    >
                                        {languages[locale]?.code.toLocaleUpperCase()}
                                        {locale === preferred && <Text type="warning">*</Text>}
                                    </Popover>
                                }
                                onClick={() => onLocaleChange(locale)}
                            />
                        )
                    })}
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
}
