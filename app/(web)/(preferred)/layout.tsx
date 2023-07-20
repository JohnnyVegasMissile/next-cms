import { ReactNode } from 'react'
import OthersLayout from '../OthersLayout'

const LayoutPref = async ({ children }: { children: ReactNode }) => <OthersLayout content={children} />

export default LayoutPref
