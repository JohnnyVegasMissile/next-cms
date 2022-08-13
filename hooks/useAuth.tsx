import { useState, useEffect, useContext, createContext } from 'react'
// import { useRouter } from 'next/router'
import type { AuthResponse, ContextUser } from '../types'
import { getMe, signIn as signInRequest } from '../network/auth'
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from 'react-query'
import { useRouter } from 'next/router'
import get from 'lodash.get'

interface UseProvideAuthProps {
    isAuth: boolean
    // user: ContextUser | null
    me: ContextUser | null
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
    // user: null,
    me: null,
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
    const [token, setToken] = useState<string | undefined>()
    const [initializing, setInitializing] = useState<boolean>(true)
    const [redirect, setRedirect] = useState<string | undefined>()
    const queryClient = useQueryClient()

    const me: UseQueryResult<ContextUser, Error> = useQuery<ContextUser, Error>(['me'], () => getMe(), {
        onSettled: () => setInitializing(false),
        enabled: !!token,
    })

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            setInitializing(false)
        } else {
            setToken(token)
        }
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
                localStorage.setItem('token', data.token)
                setToken(data.token)

                console.log('Redirection from Auth', redirect)
                !!redirect ? router.push(redirect) : router.push('/')
            },
        }
    )

    const signOut = () => {
        setToken(undefined)
        queryClient.invalidateQueries()
        localStorage.removeItem('token')
    }

    return {
        isAuth: !!token,
        me: get(me, 'data', null),
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
