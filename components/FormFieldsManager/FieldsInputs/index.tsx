import { FormFieldCreation } from '~/types/formCreation'
import TitleInputs from './TitleInputs'
import TextInputs from './TextInputs'
import NumberInputs from './NumberInputs'
import EmailInputs from './EmailInputs'
import PasswordInputs from './PasswordInputs'
import ParagraphInputs from './ParagraphInputs'
import OptionInputs from './OptionInputs'
import CheckboxInputs from './CheckboxInputs'
import MultiCheckboxInputs from './MultiCheckboxInputs'
import RadioInputs from './RadioInputs'
import ButtonInputs from './ButtonInputs'
import ContentInputs from './ContentInputs'

export interface FieldInputsProps {
    field: FormFieldCreation
    errors: any | undefined
    onChange(name: string, value: any): void
}

const FieldInputs = ({}: FieldInputsProps) => <></>

FieldInputs.TITLE = TitleInputs
FieldInputs.TEXT = TextInputs
FieldInputs.NUMBER = NumberInputs
FieldInputs.EMAIL = EmailInputs
FieldInputs.PASSWORD = PasswordInputs
FieldInputs.PARAGRAPH = ParagraphInputs
FieldInputs.OPTION = OptionInputs
FieldInputs.CHECKBOX = CheckboxInputs
FieldInputs.MULTICHECKBOX = MultiCheckboxInputs
FieldInputs.RADIO = RadioInputs
FieldInputs.BUTTON = ButtonInputs
FieldInputs.CONTENT = ContentInputs

export default FieldInputs
