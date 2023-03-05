'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import styles from './layout.module.scss'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <div className={styles['content-wrap']}>{children}</div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

const queryClient = new QueryClient()
