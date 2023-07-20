import { CodeLanguage } from '@prisma/client'
import OthersNotFound from '../../OthersNotFound'

const NotFoundEs = async () => <OthersNotFound lang={CodeLanguage.ES} />

export const revalidate = Infinity

export default NotFoundEs
