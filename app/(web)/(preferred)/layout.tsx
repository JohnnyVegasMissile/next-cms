import { ReactNode } from 'react'
import { PagesDisplays } from '~/components/PagesDisplays'

const LayoutPref = async ({ children }: { children: ReactNode }) => (
    <PagesDisplays.Layout content={children} />
)

export default LayoutPref
