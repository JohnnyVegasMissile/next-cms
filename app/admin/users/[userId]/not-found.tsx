import NotFoundResult from '~/components/NotFoundResult'

const NotFound = () => (
    <NotFoundResult
        subtitle="Sorry, this user does not exist."
        link="/admin/users"
        buttonText="Go to users"
    />
)

export const revalidate = 'force-cache'

export default NotFound
