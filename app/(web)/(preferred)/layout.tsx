import { ReactNode } from 'react'
import { PagesDisplays } from '~/components/PagesDisplays'

const LayoutPref = async ({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) => (
    <PagesDisplays.Layout content={children} sideContent={sidebar} />
)

export default LayoutPref
