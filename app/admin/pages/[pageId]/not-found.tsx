import NotFoundResult from '~/components/NotFoundResult'

const NotFound = () => (
    <NotFoundResult
        subtitle="Sorry, this page does not exist."
        link="/admin/pages"
        buttonText="Go to pages"
    />
)

export const revalidate = 'force-cache'

export default NotFound
