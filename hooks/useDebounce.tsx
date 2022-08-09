import { useEffect, useRef, useState } from 'react'

function useDebounce<T>(value: T, delay?: number): T {
    const didMountRef = useRef(false)
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        if (didMountRef.current) {
            const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

            return () => {
                clearTimeout(timer)
            }
        }
        didMountRef.current = true
        return
    }, [value, delay])

    return debouncedValue
}

export default useDebounce
