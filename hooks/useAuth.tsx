import { useState, useEffect, useContext, createContext } from 'react'
// import { useRouter } from 'next/router'
import type { AuthResponse, ContextUser } from '../types'
import { getMe, signIn as signInRequest } from '../network/auth'
import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'

interface UseProvideAuthProps {
    isAuth: boolean
    user: ContextUser | null
    setRedirect(url: string): void
    initializing: boolean
    signIn: UseMutationResult<
        AuthResponse,
        unknown,
        {
            email: string
            password: string
        },
        unknown
    > | null
    signOut(): void
}

const authContext = createContext<UseProvideAuthProps>({
    isAuth: false,
    user: null,
    setRedirect: (url: string) => {},
    initializing: true,
    signIn: null,
    signOut: () => {},
})

export const useAuth = () => {
    return useContext(authContext)
}

export const useProvideAuth = (): UseProvideAuthProps => {
    const router = useRouter()
    const [initializing, setInitializing] = useState<boolean>(true)
    const [redirect, setRedirect] = useState<string | undefined>()
    const [user, setUser] = useState<ContextUser | null>(null)
    const queryClient = useQueryClient()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!!token) {
            getMe()
                .then((res) => {
                    setUser({
                        name: res.user.name || '',
                        email: res.user.email,
                        role: res.user.role,
                        expiresAt: res.expiresAt,
                    })
                    setInitializing(false)
                })
                .catch(() => {
                    localStorage.removeItem('token')
                    setInitializing(false)
                })
            return
        }

        setInitializing(false)
    }, [])

    useEffect(() => {
        if (router.route !== '/sign-in') {
            setRedirect(undefined)
        }
    }, [router.route])

    const signIn = useMutation(
        (data: { email: string; password: string }) => signInRequest(data.email, data.password),
        {
            onSuccess: (data: AuthResponse) => {
                setUser({
                    name: data.user.name || '',
                    email: data.user.email,
                    role: data.user.role,
                    expiresAt: data.expiresAt,
                })
                localStorage.setItem('user', JSON.stringify(data.user))
                localStorage.setItem('token', data.token)

                console.log('Redirection from Auth', redirect)
                !!redirect ? router.push(redirect) : router.push('/')
            },
        }
    )

    const signOut = () => {
        setUser(null)
        queryClient.invalidateQueries()
        localStorage.clear()
    }

    return {
        isAuth: !!user,
        user,
        setRedirect,
        initializing,
        signIn,
        signOut,
    }
}

export function ProvideAuth({ children }: { children: React.ReactNode }) {
    const auth = useProvideAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
