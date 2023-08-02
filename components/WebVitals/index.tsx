'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { sendMetrics } from '~/network/metrics'

const WebVitals = () => {
    useReportWebVitals((metric) => {
        sendMetrics({
            name: metric.name,
            value: metric.value,
            url: window.location.pathname,
        })
    })

    return <></>
}

export default WebVitals
