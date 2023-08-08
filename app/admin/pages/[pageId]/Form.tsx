'use client'

import {
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Input,
    Modal,
    Popconfirm,
    Radio,
    Row,
    Space,
    Spin,
    Typography,
    message,
    Tooltip,
    DatePicker,
    Segmented,
} from 'antd'
import { PicCenterOutlined, CheckOutlined, LineChartOutlined, QuestionOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CodeLanguage, PageType, Metric, MetricName } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import set from 'lodash.set'

import { postPages, updatePage } from '~/network/pages'
import MetadatasList from '~/components/MetadatasList'
import PageCreation from '~/types/pageCreation'
import SlugEdit from '~/components/SlugEdit'
import WithLabel from '~/components/WithLabel'
import languages from '~/utilities/languages'
import { useMemo, useRef, useState } from 'react'
import { getPageMetrics } from '~/network/metrics'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartToolTip,
    ReferenceLine,
} from 'recharts'
import dayjs, { Dayjs } from 'dayjs'

const { Text } = Typography

const validate = (values: PageCreation) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    if (values.type === PageType.PAGE) {
        for (let i = 0; i < values.slug.length; i++) {
            if (!values.slug[i]) set(errors, `slug.${i}`, 'Required')
        }
    }

    // for (let i = 0; i < values.metadatas?.length; i++) {
    //     for (let j = 0; j < (values.metadatas[i]?.values?.length || 0); j++) {
    //         if (values.metadatas[i]?.values[j] === undefined || values.metadatas[i]?.values[j] === '') {
    //             set(errors, `metadatas.${i}`, 'Required')
    //             continue
    //         }
    //     }
    // }

    return errors
}

interface FormPageProps {
    pageId: string
    isUpdate: boolean
    page: PageCreation
    type: PageType | undefined
    locales: CodeLanguage[]
    preferred: CodeLanguage
}

const Form = ({ pageId, isUpdate, page, type, locales, preferred }: FormPageProps) => {
    const [showStats, setShowStats] = useState(false)
    const [metaTab, setMetaTab] = useState<CodeLanguage | 'ALL'>('ALL')
    const router = useRouter()
    const queryClient = useQueryClient()
    const formik = useFormik({
        initialValues: page,
        validate,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false,
        onSubmit: (values) => submit.mutate(values),
    })

    const submit = useMutation(
        (values: PageCreation) => (isUpdate ? updatePage(pageId, values) : postPages(values)),
        {
            onSuccess: () => {
                message.success(`Page ${isUpdate ? 'modified' : 'created'} with success.`)
                queryClient.invalidateQueries({ queryKey: ['pages'] })
                router.push('/admin/pages')
            },
            onError: () => message.error('Something went wrong, try again later.'),
        }
    )

    return (
        <>
            <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{isUpdate ? 'Update' : 'Create new'} page</Text>

                    <Space>
                        {isUpdate && (
                            <>
                                <Button
                                    size="small"
                                    type="primary"
                                    icon={<LineChartOutlined />}
                                    onClick={() => setShowStats(true)}
                                />
                                <Popconfirm
                                    title="Continue without saving?"
                                    description="Make sure to save your changes."
                                    onConfirm={() => router.push(`/admin/pages/${pageId}/sections`)}
                                    okText="Continue"
                                >
                                    <Button
                                        icon={<PicCenterOutlined />}
                                        size="small"
                                        type="dashed"
                                        disabled={submit.isLoading}
                                    >
                                        Custom sections
                                    </Button>
                                </Popconfirm>
                            </>
                        )}

                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={() => formik.handleSubmit()}
                            loading={submit.isLoading}
                        >
                            {isUpdate ? 'Update page' : 'Create new'}
                        </Button>
                    </Space>
                </div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col span={16}>
                    <Card size="small" title="Information">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <WithLabel label="Name :" error={formik.errors.name}>
                                    <Input
                                        size="small"
                                        status={!!formik.errors.name ? 'error' : undefined}
                                        style={{ width: '100%' }}
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        disabled={!!type && type !== PageType.PAGE}
                                    />
                                </WithLabel>
                            </Col>

                            {type === PageType.PAGE && (
                                <Col span={12}>
                                    <WithLabel label="Published :">
                                        <Radio.Group
                                            name="published"
                                            value={formik.values.published}
                                            onChange={formik.handleChange}
                                            options={[
                                                { label: 'Published', value: true },
                                                { label: 'Unpublished', value: false },
                                            ]}
                                        />
                                    </WithLabel>
                                </Col>
                            )}
                        </Row>

                        {type !== PageType.HOMEPAGE && (
                            <>
                                <Divider style={{ margin: '1rem' }} />

                                <WithLabel
                                    label="URL :"
                                    error={(formik.errors.slug as string[])?.find((e) => !!e)}
                                >
                                    <SlugEdit
                                        value={formik.values.slug}
                                        onChange={(e) => formik.setFieldValue('slug', e)}
                                        errors={formik.errors.slug as string[]}
                                        paramsId={isUpdate ? { pageId } : undefined}
                                    />
                                </WithLabel>
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        size="small"
                        title="Metadatas"
                        style={{ minHeight: '100%' }}
                        tabList={[
                            {
                                key: 'ALL',
                                tab: 'All',
                            },
                            ...(locales?.map((locale) => ({
                                key: locale,
                                tab: (
                                    <Tooltip title={languages[locale].name}>
                                        <Text>
                                            {languages[locale].en}
                                            {locale === preferred && <Text type="warning"> *</Text>}
                                        </Text>
                                    </Tooltip>
                                ),
                            })) || []),
                        ]}
                        activeTabKey={metaTab}
                        onTabChange={(e: any) => setMetaTab(e)}
                    >
                        <MetadatasList
                            name={`metadatas.${metaTab}`}
                            value={formik.values.metadatas[metaTab] || []}
                            onChange={formik.handleChange}
                            errors={formik.errors.metadatas as string[]}
                            locales={locales}
                            preferred={preferred}
                        />
                    </Card>
                </Col>
            </Row>

            <MetricsModal pageId={pageId} showStats={showStats} onShowStatsChange={setShowStats} locales={locales} preferred={preferred} />
        </>
    )
}

export default Form

interface MetricsModalProps {
    pageId: string
    showStats: boolean
    onShowStatsChange: (value: boolean) => void
    locales: CodeLanguage[]
    preferred: CodeLanguage
}

const MetricsModal = ({ pageId, showStats, onShowStatsChange, locales, preferred }: MetricsModalProps) => {
    const [filters, setFilters] = useState<{ from: Dayjs | undefined; to: Dayjs | undefined; language: CodeLanguage }>({
        from: undefined,
        to: undefined,
        language: preferred
    })

    const metrics = useQuery(
        ['page-metrics', { id: pageId, ...filters }],
        () => getPageMetrics(pageId, filters),
        {
            enabled: showStats,
        }
    )

    const filteredMetrics = useMemo(() => {
        let data: { [key in MetricName]: (Metric & { date?: string | undefined; Value?: number })[] } = {
            TTFB: [],
            FCP: [],
            LCP: [],
            FID: [],
            CLS: [],
            INP: [],
        }

        for (const metric of metrics.data || []) {
            data[metric.name].push({
                ...metric,
                Value: Math.round(metric.value),
                date: dayjs(metric.day).format('DD MMM YYYY'),
            })
        }

        return data
    }, [metrics.data])

    return (
        <Modal
            centered
            open={showStats}
            footer={null}
            onCancel={() => {
                onShowStatsChange(false)
                setFilters({
                    from: undefined,
                    to: undefined,
                    language: preferred
                })
            } }
            width={'90vw'}
            bodyStyle={{ height: '80vh' }}
            title={
                <>
                    <Space size="middle">
                        <DatePicker
                            style={{ width: 150 }}
                            format={'DD MMM YYYY'}
                            value={filters.from}
                            onChange={(from) =>
                                setFilters((e) => ({
                                    ...e,
                                    from:
                                        from
                                            ?.set('hour', 0)
                                            .set('minute', 0)
                                            .set('second', 0)
                                            .set('millisecond', 0) || undefined,
                                }))
                            }
                            size="small"
                            placeholder="From"
                        />
                        <DatePicker
                            style={{ width: 150 }}
                            format={'DD MMM YYYY'}
                            value={filters.to}
                            onChange={(to) =>
                                setFilters((e) => ({
                                    ...e,
                                    to:
                                        to
                                            ?.set('hour', 0)
                                            .set('minute', 0)
                                            .set('second', 0)
                                            .set('millisecond', 0) || undefined,
                                }))
                            }
                            size="small"
                            placeholder="To"
                        />
                        <Radio.Group
                            buttonStyle="solid"
                            value={filters.language}
                            onChange={(e) => setFilters(f => ({ ...f, language: e.target.value }))}
                            size="small">
                            {locales.map(key => <Radio.Button key={key} value={key}><Tooltip title={languages[key].name}>{languages[key].en}{key === preferred && <Text type="warning"> *</Text>}</Tooltip></Radio.Button>)}
                        </Radio.Group>
                    </Space>
                    <Divider style={{ marginTop: 8, marginBottom: 0 }} />
                </>
            }
        >
            {metrics.isFetching ? (
                <div
                    style={{
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                    }}
                >
                    <Spin />
                </div>
            ) : (
                <div style={{ overflowY: 'scroll', height: '100%', overflowX: 'hidden' }}>
                    <Row>
                        {[
                            { label: 'Time to First Byte', name: 'TTFB', min: 200, max: 500 },
                            { label: 'First Contentful Paint', name: 'FCP', min: 1.8, max: 3 },
                            { label: 'Largest Contentful Paint', name: 'LCP', min: 2.5, max: 4 },
                            { label: 'First Input Delay', name: 'FID', min: 100, max: 300 },
                            { label: 'Cumulative Layout Shift', name: 'CLS', min: 0.1, max: 0.25 },
                            { label: 'Input Performance', name: 'INP', min: 200, max: 500 },
                        ].map((e) => (
                            <Col key={e.name} span={12}>
                                <Space direction="vertical" style={{ width: '100%' }} size="large">
                                    <Text strong>
                                        {e.label}
                                        <Text type="secondary"> ({e.name})</Text>
                                    </Text>

                                    {!filteredMetrics[e.name as MetricName]?.length ? (
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    ) : (
                                        <LineChart
                                            width={600}
                                            height={300}
                                            data={filteredMetrics[e.name as MetricName]}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <ReferenceLine y={e.min} stroke="#52c41a" />
                                            <ReferenceLine y={e.max} stroke="#ff4d4f" />

                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" padding={{ left: 15, right: 15 }} />
                                            <YAxis />
                                            <ChartToolTip />
                                            <Line type="monotone" dataKey="Value" stroke="#1677ff" />
                                        </LineChart>
                                    )}
                                </Space>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </Modal>
    )
}
