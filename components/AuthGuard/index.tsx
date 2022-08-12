import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Spin } from 'antd'
import { Access } from '@prisma/client'
import useSsr from '../../hooks/useSsr'

interface Props {
    children: React.ReactNode
    accesses?: Access[]
    requireAuth: boolean
}

function AuthGuard({ children, accesses, requireAuth }: Props) {
    const { isBrowser } = useSsr()
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(false)
    const { isAuth, me, initializing, setRedirect } = useAuth()

    const hasAccess = useMemo(() => {
        const index = accesses?.findIndex((e) => e.roleId === me?.role)

        return index !== -1
    }, [accesses, me?.role])

    useEffect(() => {
        setIsChecking(true)
        if (!initializing && isBrowser && (requireAuth || !!accesses?.length)) {
            const isAdmin = me?.role === 'super-admin' || me?.role === 'admin'

            //auth is initialized and there is no user
            if (!isAuth) {
                // remember the page that user tried to access
                setRedirect(router.route)
                // redirect
                router.push('/sign-in')
                return
            } else if (!isAdmin && !hasAccess) {
                console.log('Redirection from Auth Guard')
                router.push('/not-found')
                return
            }
        }
        setIsChecking(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setRedirect, initializing, router, me?.role, accesses, requireAuth])

    /* show loading indicator while the auth provider is still initializing */
    if (initializing && (accesses?.length || requireAuth)) {
        return (
            <div
                style={{
                    height: 'calc(100vh - 29px)',
                    width: '100vw',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Spin size="large" tip="Initializing..." />
            </div>
        )
    }

    // if auth initialized with a valid user show protected page
    if (!isChecking) {
        return <>{children}</>
    }

    /* otherwise don't return anything, will do a redirect from useEffect */
    return null
}

export default AuthGuard
