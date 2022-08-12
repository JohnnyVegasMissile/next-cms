import { useAuth } from '../../hooks/useAuth'
import { Affix, Button } from 'antd'
import Link from 'next/link'

interface EditPageButtonProps {
    redirectTo: string
}

const EditPageButton = ({ redirectTo }: EditPageButtonProps) => {
    const { isAuth, me } = useAuth()

    return isAuth && (me?.role === 'super-admin' || me?.role === 'admin') ? (
        <Affix offsetTop={33}>
            <Button size="small" type="primary" style={{ position: 'absolute', right: 5 }}>
                <Link href={redirectTo}>
                    <a>Edit</a>
                </Link>
            </Button>
        </Affix>
    ) : null
}

export default EditPageButton
