import { Button } from 'antd'
import { useAuth } from '../../hooks/useAuth'

const SignIn = () => {
    const { signIn } = useAuth()

    return <Button onClick={signIn}>Sign in</Button>
}

export default SignIn
