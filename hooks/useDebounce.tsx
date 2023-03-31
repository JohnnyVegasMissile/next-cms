import { useEffect, useRef, useState } from 'react'

function useDebounce<T>(value: T, delay?: number): T {
    const didMountRef = useRef(false)
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        if (!didMountRef.current) {
            didMountRef.current = true
            return
        }
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

export default useDebounce
