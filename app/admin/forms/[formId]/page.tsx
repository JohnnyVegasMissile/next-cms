import FormCreation from '~/types/formCreation'
import { Form, FormField } from '@prisma/client'
import { prisma } from '~/utilities/prisma'
import FormCreate from './Form'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const generateMetadata = async ({ params }: any): Promise<Metadata> => ({
    title: `${params.formId === 'create' ? 'Create' : 'Edit'} form`,
})

const initialValues: FormCreation = {
    name: '',

    redirectMail: false,
    mailToRedirect: '',

    successMessage: '',
    errorMessage: '',

    extraData: [],
    fields: [],
}

const formToFormCreation = (form: Form & { fields: FormField[] }): FormCreation => {
    return form as FormCreation
}

const getForm = async (formId: string) => {
    if (formId === 'create') return { isUpdate: false }

    const form = await prisma.form.findUnique({
        where: { id: formId },
        include: { fields: true },
    })

    if (!form) return { isUpdate: true }

    return {
        isUpdate: true,
        form: formToFormCreation(form),
    }
}

const CreateForm = async ({ params }: any) => {
    const { isUpdate, form } = await getForm(params.formId)

    if (!form && isUpdate) notFound()

    return <FormCreate formId={params.formId} isUpdate={isUpdate} form={form || initialValues} />
}

export default CreateForm
