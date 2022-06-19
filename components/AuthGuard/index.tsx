import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, initializing /*, setRedirect*/ } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!initializing) {
            //auth is initialized and there is no user
            if (!user) {
                // remember the page that user tried to access
                // setRedirect(router.route)
                // redirect
                router.push('/admin/signin')
            }
        }
    }, [/* setRedirect,*/ initializing, router, user])

    /* show loading indicator while the auth provider is still initializing */
    if (initializing) {
        return <h1>Application Loading</h1>
    }

    // if auth initialized with a valid user show protected page
    if (user) {
        return <>{children}</>
    }

    /* otherwise don't return anything, will do a redirect from useEffect */
    return null
}
