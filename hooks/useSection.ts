import { Form, Media } from '@prisma/client'
import { FormikErrors } from 'formik'
import { createContext, useContext } from 'react'
import { FormSimple } from '~/types/formCreation'
import SectionCreation from '~/types/sectionCreation'

interface UseProvideAuthProps {
    sections: SectionCreation[]
    setFieldValue(name: string, value: any): void
    errors: (FormikErrors<SectionCreation> | undefined)[]
}

export const SectionsContext = createContext<UseProvideAuthProps>({
    sections: [],
    setFieldValue: () => {},
    errors: [],
})

const useSection = (position: number) => {
    const { sections, setFieldValue } = useContext(SectionsContext)
    const section = sections[position]

    const onSetFieldValue = (name: string, value: any) => setFieldValue(`${position}.content.${name}`, value)

    const addMedia = (name: string, media: Media | undefined) => {
        if (!media) {
            setFieldValue(`${position}.content.${name}`, undefined)
        } else {
            setFieldValue(`${position}.content.${name}`, media.id)

            const newMediaSet = new Map(section?.medias)
            newMediaSet.set(media.id, media)
            setFieldValue(`${position}.medias`, newMediaSet)
        }
    }

    const addForm = (name: string, form: Form | undefined) => {
        if (!form) {
            setFieldValue(`${position}.content.${name}`, undefined)
        } else {
            setFieldValue(`${position}.content.${name}`, form.id)

            const newFormSet = new Map(section?.forms)
            newFormSet.set(form.id, form as any as FormSimple)
            setFieldValue(`${position}.forms`, newFormSet)
        }
    }

    return {
        content: section?.content,
        setFieldValue: onSetFieldValue,
        medias: section?.medias,
        addMedia,
        forms: section?.forms,
        addForm,
    }
}

export default useSection
