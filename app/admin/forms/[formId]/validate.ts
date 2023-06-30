import { FormButtonType, FormFieldType } from '@prisma/client'
import set from 'lodash.set'
import FormCreation from '~/types/formCreation'
import { isEmail } from '~/utilities'

const validate = (values: FormCreation) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Name is required'
    }

    if (!!values.redirectMail) {
        if (!values.mailToRedirect) {
            errors.mail = 'Mail is required'
        } else if (!isEmail(values.mailToRedirect)) {
            errors.mail = 'Mail is not valid'
        }
    }

    if (!values.fields.length) {
        errors.fieldsGlobal = 'You must have at least one field'
    } else {
        if (
            values.fields.findIndex(
                (e) => e.type === FormFieldType.BUTTON && e.buttonType === FormButtonType.SUBMIT
            ) === -1
        ) {
            errors.fieldsGlobal = 'You must have at least one submit button'
        }

        for (let fieldIdx = 0; fieldIdx < values.fields.length; fieldIdx++) {
            if (!values.fields[fieldIdx]?.label) set(errors, `fields.${fieldIdx}.label`, 'Label is required')

            switch (values.fields?.[fieldIdx]?.type) {
                case FormFieldType.EMAIL:
                    if (
                        !!values.fields[fieldIdx]?.default &&
                        !isEmail(values.fields[fieldIdx]?.default as string)
                    ) {
                        set(errors, `fields.${fieldIdx}.default`, "It's not a valid email")
                    }
                    break
                case FormFieldType.OPTION:
                case FormFieldType.MULTICHECKBOX:
                case FormFieldType.RADIO:
                    if (!values.fields[fieldIdx]?.options?.length) {
                        set(errors, `fields.${fieldIdx}.options`, 'Options are required')
                    } else {
                        for (
                            let optionIdx = 0;
                            optionIdx < values.fields[fieldIdx]?.options?.length!;
                            optionIdx++
                        ) {
                            if (!values.fields[fieldIdx]?.options?.[optionIdx]?.value) {
                                set(errors, `fields.${fieldIdx}.options`, 'Values are required')
                                break
                            }

                            const foundIndex = values.fields[fieldIdx]?.options?.findIndex(
                                (e) => e.value === values.fields[fieldIdx]?.options?.[optionIdx]?.value
                            )

                            if (foundIndex !== -1 && foundIndex !== optionIdx) {
                                set(errors, `fields.${fieldIdx}.options`, 'No duplicate values')
                                break
                            }
                        }
                    }

                    if (values.fields?.[fieldIdx]?.type === FormFieldType.MULTICHECKBOX) {
                        const defaults = (values.fields[fieldIdx]?.default as string)?.split(', ')

                        for (let defaultIdx = 0; defaultIdx < defaults?.length!; defaultIdx++) {
                            const foundIndex = values.fields[fieldIdx]?.options?.findIndex(
                                (e) => e.value === defaults?.[defaultIdx]
                            )

                            if (foundIndex === -1) {
                                set(errors, `fields.${fieldIdx}.default`, 'Default value must be in options')
                                break
                            }
                        }
                    } else if (!!values.fields?.[fieldIdx]?.default) {
                        const foundIndex = values.fields?.[fieldIdx]?.options?.findIndex(
                            (e) => e.value === values.fields?.[fieldIdx]?.default
                        )

                        if (foundIndex === -1)
                            set(errors, `fields.${fieldIdx}.default`, 'Default value must be in options')
                    }
                    break
                case FormFieldType.CONTENT:
                    if (!values.fields?.[fieldIdx]?.containerId)
                        set(errors, `fields.${fieldIdx}.containerId`, 'Container is required')

                    break

                case FormFieldType.NUMBER:
                    if (typeof values.fields[fieldIdx]?.default === 'number') {
                        if (
                            typeof values.fields[fieldIdx]?.min === 'number' &&
                            (values.fields[fieldIdx]?.default as number) < values.fields[fieldIdx]?.min!
                        ) {
                            set(errors, `fields.${fieldIdx}.default`, 'Must be greater than min')
                        } else if (
                            typeof values.fields[fieldIdx]?.max === 'number' &&
                            (values.fields[fieldIdx]?.default as number) > values.fields[fieldIdx]?.max!
                        ) {
                            set(errors, `fields.${fieldIdx}.default`, 'Must be lower than max')
                        }
                    }
                    break

                case FormFieldType.BUTTON:
                    if (
                        values.fields[fieldIdx]?.buttonType === FormButtonType.LINK &&
                        !values.fields[fieldIdx]?.link?.link
                    ) {
                        set(errors, `fields.${fieldIdx}.link`, 'Link is required')
                    }
                    break

                default:
                    break
            }
        }
    }

    return errors
}

export default validate
