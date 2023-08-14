import { Button, FloatButton, Popover, Space, Tooltip, Typography } from 'antd'
import {
    CopyOutlined,
    MenuOutlined,
    CloseOutlined,
    CheckOutlined,
    LoadingOutlined,
    WarningOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons'
import { CodeLanguage } from '@prisma/client'
import languages from '~/utilities/languages'
import { useMemo, useState } from 'react'

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
    const [isOpen, setIsOpen] = useState({ lang: false, setting: false })
    const hasErrors = useMemo(() => {
        const withErrors: CodeLanguage[] = []

        Object.keys(errors || {}).forEach((key) => {
            Object.keys(errors[key]!).forEach((locale) => {
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
                    open={isOpen.lang}
                    onOpenChange={(x) => setIsOpen((e) => ({ setting: e.setting, lang: x }))}
                    shape="square"
                    trigger="click"
                    type="primary"
                    icon={null}
                    style={{ right: 36 + 40 + 24 }}
                    description={
                        !isOpen.lang && (
                            <Tooltip
                                placement="left"
                                title={`${languages[activeLocale]?.name} (${languages[activeLocale]?.en})`}
                            >
                                {!!hasErrors.length ? (
                                    <WarningOutlined style={{ color: '#f5222d', fontSize: '1.5rem' }} />
                                ) : (
                                    <>
                                        {languages[activeLocale]?.code.toLocaleUpperCase()}
                                        {preferred === activeLocale && <Text type="warning">*</Text>}
                                    </>
                                )}
                            </Tooltip>
                        )
                    }
                >
                    {locales.map((locale) => {
                        return (
                            <FloatButton
                                key={locale}
                                badge={{ count: hasErrors.includes(locale) ? '!' : 0 }}
                                type={locale === activeLocale ? 'primary' : 'default'}
                                description={
                                    <Popover
                                        overlayInnerStyle={{ padding: 8 }}
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
                                        {preferred === locale && <Text type="warning">*</Text>}
                                    </Popover>
                                }
                                onClick={() => onLocaleChange(locale)}
                            />
                        )
                    })}
                </FloatButton.Group>
            )}

            <FloatButton.Group
                key={'setting'}
                open={isOpen.setting}
                onClick={(e) => console.log('kkkk onClick', e)}
                onOpenChange={(x) => {
                    console.log('kkkk onOpenChange', x)
                    setIsOpen((e) => ({ lang: e.lang, setting: x }))
                }}
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
