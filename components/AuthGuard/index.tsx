import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spin } from 'antd'

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, initializing /*, setRedirect*/ } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!initializing) {
            //auth is initialized and there is no user
            if (!user) {
                // remember the page that user tried to access
                // setRedirect(router.route)
                // redirect
                router.push('/signin')
            }
        }
    }, [/* setRedirect,*/ initializing, router, user])

    /* show loading indicator while the auth provider is still initializing */
    if (initializing) {
        return (
            <div
                style={{
                    height: '100vh',
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
