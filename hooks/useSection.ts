import { Form, Media, Menu, MenuChild } from '@prisma/client'
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

const useSection = <T>(position: number) => {
    const { sections, setFieldValue, errors } = useContext(SectionsContext)
    const section = sections[position]
    const sectionErrors = errors?.[position]

    const onSetFieldValue = (name: string, value: any) => setFieldValue(`${position}.value.${name}`, value)

    const addMedia = (name: string, media: Media | undefined) => {
        if (!media) {
            setFieldValue(`${position}.value.${name}`, undefined)
        } else {
            setFieldValue(`${position}.value.${name}`, media.id)

            const newMediaSet = new Map(section?.medias)
            newMediaSet.set(media.id, media)
            setFieldValue(`${position}.medias`, newMediaSet)
        }
    }

    const addForm = (name: string, form: Form | undefined) => {
        if (!form) {
            setFieldValue(`${position}.value.${name}`, undefined)
        } else {
            setFieldValue(`${position}.value.${name}`, form.id)

            const newFormSet = new Map(section?.forms)
            newFormSet.set(form.id, form as any as FormSimple)
            setFieldValue(`${position}.forms`, newFormSet)
        }
    }

    const addMenu = (name: string, menu: (Menu & { childs: MenuChild[] }) | undefined) => {
        if (!menu) {
            setFieldValue(`${position}.value.${name}`, undefined)
        } else {
            setFieldValue(`${position}.value.${name}`, menu.id)

            const newMenuSet = new Map(section?.menus)
            newMenuSet.set(menu.id, menu)
            setFieldValue(`${position}.menus`, newMenuSet)
        }
    }

    return {
        value: section?.value as T,
        setFieldValue: onSetFieldValue,
        medias: section?.medias,
        addMedia,
        forms: section?.forms,
        addForm,
        menus: section?.menus,
        addMenu,
        errors: sectionErrors as any,
    }
}

export default useSection
