import { useState, useEffect, useContext, createContext } from 'react'
// import { useRouter } from 'next/router'
import type { ContextUser } from '../types'
import { useQueryClient } from 'react-query'

interface UseProvideAuthProps {
    isAuth: boolean
    user: ContextUser | null
    loading: boolean
    initializing: boolean
    signIn: () => void
    signOut: () => void
}

const authContext = createContext<UseProvideAuthProps>({
    isAuth: false,
    user: null,
    loading: false,
    initializing: true,
    signIn: () => {},
    signOut: () => {},
})

export const useAuth = () => {
    return useContext(authContext)
}

export const useProvideAuth = (): UseProvideAuthProps => {
    // const router = useRouter()
    const [initializing, setInitializing] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useState<ContextUser | null>(null)
    const queryClient = useQueryClient()

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) setUser(JSON.parse(user))

        setInitializing(false)
    }, [])

    const signIn = () => {
        const user = { name: 'alex', type: 'admin', email: '' }
        setLoading(true)
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
        // router.push('/')
        setLoading(false)
    }

    const signOut = () => {
        setUser(null)
        queryClient.invalidateQueries()
        localStorage.clear()
    }

    return {
        isAuth: !!user,
        user,
        loading,
        initializing,
        signIn,
        signOut,
    }
}

export function ProvideAuth({ children }: { children: React.ReactNode }) {
    const auth = useProvideAuth()
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
