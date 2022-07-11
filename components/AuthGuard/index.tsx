import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spin } from 'antd'

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuth, user, initializing, setRedirect } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!initializing) {
            //auth is initialized and there is no user
            if (!isAuth) {
                // remember the page that user tried to access
                setRedirect(router.route)
                // redirect
                router.push('/signin')
            } else if (isAuth && user?.type !== 'super-admin' && user?.type !== 'admin') {
                router.push('/')
                // user?.type !== 'super-admin' && user?.type !== 'admin'
            }
        }
    }, [setRedirect, initializing, router, user])

    /* show loading indicator while the auth provider is still initializing */
    if (initializing) {
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
    if (user) {
        return <>{children}</>
    }

    /* otherwise don't return anything, will do a redirect from useEffect */
    return null
}

export default AuthGuard
