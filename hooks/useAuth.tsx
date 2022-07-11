import { useState, useEffect, useContext, createContext } from 'react'
// import { useRouter } from 'next/router'
import type { AuthResponse, ContextUser } from '../types'
import { signIn as signInRequest } from '../network/auth'
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
        const user = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if (!!user && token) setUser(JSON.parse(user))

        setInitializing(false)
    }, [])

    useEffect(() => {
        setRedirect(undefined)
    }, [router.route])

    const signIn = useMutation(
        (data: { email: string; password: string }) =>
            signInRequest(data.email, data.password),
        {
            onSuccess: (data: AuthResponse) => {
                setUser({
                    name: data.user.name || '',
                    email: data.user.email,
                    type: data.user.type,
                    expiresAt: data.expiresAt,
                })
                localStorage.setItem('user', JSON.stringify(data.user))
                localStorage.setItem('token', data.token)

                if (!!redirect) router.push(redirect)
            },
        }
    )

    // const signIn = () => {
    //     const user = { name: 'alex', type: 'admin', email: '' }
    //     setLoading(true)
    //     setUser(user)
    //     localStorage.setItem('user', JSON.stringify(user))
    //     // router.push('/')
    //     setLoading(false)
    // }

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
