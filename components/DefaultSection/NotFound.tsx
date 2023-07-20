'use client'

import { CodeLanguage } from '@prisma/client'
import { Button, Result } from 'antd'
import Link from 'next/link'

const NotFound = ({ lang }: { lang?: CodeLanguage }) => {
    let subTitle = 'Sorry, the page you visited does not exist.'
    let buttonText = 'Back Home'

    switch (lang) {
        case CodeLanguage.ES:
            subTitle = 'Lo sentimos, la página que visitaste no existe.'
            buttonText = 'Volver a casa'
            break
        case CodeLanguage.FR:
            subTitle = "Désolé, la page que vous avez visitée n'existe pas."
            buttonText = 'Retour à la maison'
            break
        case CodeLanguage.ZH:
            subTitle = '抱歉，您访问的页面不存在。'
            buttonText = '回家'
            break

        default:
            break
    }

    return (
        <Result
            status="404"
            title="404"
            subTitle={subTitle}
            extra={
                <Link href="/">
                    <Button type="primary">{buttonText}</Button>
                </Link>
            }
        />
    )
}

export default NotFound
