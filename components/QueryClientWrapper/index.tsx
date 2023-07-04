'use client'

import { ReactNode } from 'react'
// import { App } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, refetchOnMount: false, networkMode: 'always' },
    },
})

const QueryClientWrapper = ({ children }: { children: ReactNode }) => {
    return (
        // <App>
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        // </App>
    )
}

export default QueryClientWrapper
