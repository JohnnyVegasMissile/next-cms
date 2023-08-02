import { ReactNode, Suspense } from 'react'
import { PagesDisplays } from '~/components/PagesDisplays'

const LayoutPref = async ({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) => (
    <Suspense>
        <PagesDisplays.Layout content={children} sideContent={sidebar} />
    </Suspense>
)

export default LayoutPref
