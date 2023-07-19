import { ReactNode } from 'react'

const LayoutPref = async ({ children }: { children: ReactNode }) => {
    return (
        <>
            <p>Layout - Pref</p>
            {children}
        </>
    )
}

export default LayoutPref
