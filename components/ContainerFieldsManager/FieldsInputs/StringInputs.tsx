import { Col, Divider, Input, InputNumber, Row, Select, Space, Switch, Typography } from 'antd'
import WithLabel from '~/components/WithLabel'
import { FieldInputsProps } from '.'
import { useEffect } from 'react'

const { Text } = Typography

const StringInputs = ({ field, onChange }: FieldInputsProps) => {
    useEffect(() => {
        if (field.multiple) {
            if (field.defaultTextValue) onChange('defaultMultipleTextValue', [field.defaultTextValue])
        } else {
            if (!!field.defaultMultipleTextValue?.length)
                onChange('defaultTextValue', field.defaultMultipleTextValue[0])
        }
    }, [field.multiple])

    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <WithLabel
                    label={
                        <Space>
                            <Text type="secondary">Name :</Text>

                            <Switch
                                size="small"
                                checked={field.required}
                                onChange={(e) => onChange('required', e)}
                                checkedChildren="Required"
                                unCheckedChildren="Optional"
                            />
                        </Space>
                    }
                    error="Name is required"
                >
                    <Input
                        size="small"
                        status="error"
                        style={{ width: '100%' }}
                        value={field.name}
                        onChange={(e) => onChange('name', e.target.value)}
                    />
                </WithLabel>
            </Col>
            <Col span={12}>
                <WithLabel label="Default :">
                    {field.multiple ? (
                        <Select
                            mode="tags"
                            size="small"
                            options={field.defaultMultipleTextValue?.map((e) => ({ value: e }))}
                            style={{ width: '100%' }}
                            value={field.defaultMultipleTextValue}
                            onChange={(e) => onChange('defaultMultipleTextValue', e)}
                        />
                    ) : (
                        <Input
                            size="small"
                            style={{ width: '100%' }}
                            value={field.defaultTextValue}
                            onChange={(e) => onChange('defaultTextValue', e.target.value)}
                        />
                    )}
                </WithLabel>
            </Col>

            <Col span={12}>
                <WithLabel label="Metadata :">
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        allowClear
                        size="small"
                        style={{ width: '100%' }}
                        value={field.metadatas}
                        onChange={(e) => onChange('metadatas', e)}
                        options={[
                            //https://gist.github.com/lancejpollard/1978404
                            // Basic
                            { value: 'keywords', label: 'Keywords' },
                            { value: 'description', label: 'Description' },
                            { value: 'subject', label: 'Subject' },
                            { value: 'copyright', label: 'Copyright' },
                            { value: 'language', label: 'Language' },
                            { value: 'robots', label: 'Robots' },
                            { value: 'revised', label: 'Revised' },
                            { value: 'abstract', label: 'Abstract' },
                            { value: 'topic', label: 'Topic' },
                            { value: 'summary', label: 'Summary' },
                            { value: 'Classification', label: 'Classification' },
                            { value: 'author', label: 'Author' },
                            { value: 'designer', label: 'Designer' },
                            { value: 'copyright', label: 'Copyright' },
                            { value: 'reply-to', label: 'Reply to' },
                            { value: 'owner', label: 'Owner' },
                            { value: 'url', label: 'Url' },
                            { value: 'identifier-URL', label: 'Identifier URL' },
                            { value: 'directory', label: 'Directory' },
                            { value: 'category', label: 'Category' },
                            { value: 'coverage', label: 'Coverage' },
                            { value: 'distribution', label: 'Distribution' },
                            { value: 'rating', label: 'Rating' },
                            // Open graph
                            { value: 'og:title', label: 'Title (Open graph)' },
                            { value: 'og:type', label: 'Type (Open graph)' },
                            { value: 'og:url', label: 'URL (Open graph)' },
                            { value: 'og:image', label: 'Image (Open graph)' },
                            { value: 'og:site_name', label: 'Site name (Open graph)' },
                            { value: 'og:description', label: 'Description (Open graph)' },
                            { value: 'fb:page_id', label: 'Page ID (Facebook)' },
                            { value: 'og:email', label: 'Email (Open graph)' },
                            { value: 'og:phone_number', label: 'Phone number (Open graph)' },
                            { value: 'og:fax_number', label: 'Fax number (Open graph)' },
                            { value: 'og:latitude', label: 'Latitude (Open graph)' },
                            { value: 'og:longitude', label: 'Longitude (Open graph)' },
                            { value: 'og:street-address', label: 'Street address (Open graph)' },
                            { value: 'og:locality', label: 'Locality (Open graph)' },
                            { value: 'og:region', label: 'Region (Open graph)' },
                            { value: 'og:postal-code', label: 'Postal code (Open graph)' },
                            { value: 'og:country-name', label: 'Country name (Open graph)' },
                            { value: 'og:type', label: 'Type (Open graph)' },
                            { value: 'og:points', label: 'Points (Open graph)' },
                            { value: 'og:video', label: 'Video (Open graph)' },
                            { value: 'og:video:height', label: 'Video height (Open graph)' },
                            { value: 'og:video:width', label: 'Video width (Open graph)' },
                            { value: 'og:video:type', label: 'Video type (Open graph)' },
                            { value: 'og:audio', label: 'Audio (Open graph)' },
                            { value: 'og:audio:title', label: 'Audio title (Open graph)' },
                            { value: 'og:audio:artist', label: 'Audio artist (Open graph)' },
                            { value: 'og:audio:album', label: 'Audio album (Open graph)' },
                            { value: 'og:audio:type', label: 'Audio type (Open graph)' },
                            // Apple
                            { value: 'apple-mobile-web-app-capable', label: 'Capable (Apple)' },
                            {
                                value: 'apple-mobile-web-app-status-bar-style',
                                label: 'Status bar style (Apple)',
                            },
                            { value: 'format-detection', label: 'Format detection (Apple)' },
                            { value: 'apple-touch-icon', label: 'Icon (Apple)' },
                            { value: 'apple-touch-startup-image', label: 'Startup image (Apple)' },
                            // Links
                            { value: 'alternate', label: 'Alternate (Link)' },
                            { value: 'shortcut icon', label: 'Shortcut icon (Link)' },
                            { value: 'fluid-icon', label: 'Fluid icon (Link)' },
                            { value: 'me', label: 'Me (Link)' },
                            { value: 'shortlink', label: 'Shortlink (Link)' },
                            { value: 'archives', label: 'Archives (Link)' },
                            { value: 'index', label: 'Index (Link)' },
                            { value: 'start', label: 'Start (Link)' },
                            { value: 'prev', label: 'Prev (Link)' },
                            { value: 'next', label: 'Next (Link)' },
                            { value: 'search', label: 'Search (Link)' },
                            { value: 'self', label: 'Self (Link)' },
                            { value: 'first', label: 'First (Link)' },
                            { value: 'previous', label: 'Previous (Link)' },
                            { value: 'last', label: 'Last (Link)' },
                            { value: 'shortlink', label: 'Shortlink (Link)' },
                            { value: 'canonical', label: 'Canonical (Link)' },
                            { value: 'EditURI', label: 'Edit URI (Link)' },
                            { value: 'pingback', label: 'Pingback (Link)' },
                        ]}
                    />
                </WithLabel>
            </Col>

            {field.multiple && (
                <>
                    <Col span={24}>
                        <Divider style={{ margin: 0, marginBottom: -10 }}>
                            <Text type="secondary">Multiple selection</Text>
                        </Divider>
                    </Col>
                    <Col span={12}>
                        <WithLabel
                            label={
                                <div style={{ display: 'flex' }}>
                                    <Text type="secondary" style={{ flex: 1 }}>
                                        Min :
                                    </Text>
                                    <Text type="secondary" style={{ flex: 1 }}>
                                        Max :
                                    </Text>
                                </div>
                            }
                        >
                            <Input.Group compact>
                                <InputNumber
                                    min={field.required ? 1 : undefined}
                                    max={field.max}
                                    size="small"
                                    style={{ width: '50%' }}
                                    value={field.min}
                                    onChange={(e) => onChange('min', e)}
                                />
                                <InputNumber
                                    min={field.min}
                                    size="small"
                                    style={{ width: '50%' }}
                                    value={field.max}
                                    onChange={(e) => onChange('max', e)}
                                />
                            </Input.Group>
                        </WithLabel>
                    </Col>
                    <Col span={12} />
                </>
            )}
        </Row>
    )
}

export default StringInputs
