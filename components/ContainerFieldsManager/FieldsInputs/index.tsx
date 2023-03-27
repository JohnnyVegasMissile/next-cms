import { ContainerFieldCreation } from '~/types/containerCreation'
import ColorInputs from './ColorInputs'
import ContentInputs from './ContentInputs'
import DateInputs from './DateInputs'
import ImageInputs from './ImageInputs'
import LinkInputs from './LinkInputs'
import LocationInputs from './LocationInputs'
import NumberInputs from './NumberInputs'
import OptionInputs from './OptionInputs'
import ParagraphInputs from './ParagraphInputs'
import RichTextInputs from './RichTextInputs'
import StringInputs from './StringInputs'
import VideoInputs from './VideoInputs'
import { Dayjs } from 'dayjs'

export interface FieldInputsProps {
    field: ContainerFieldCreation<Dayjs>
    errors: any | undefined
    onChange(name: string, value: any): void
}

const FieldInputs = ({}: FieldInputsProps) => <></>

FieldInputs.STRING = StringInputs
FieldInputs.DATE = DateInputs
FieldInputs.NUMBER = NumberInputs
FieldInputs.LINK = LinkInputs
FieldInputs.PARAGRAPH = ParagraphInputs
FieldInputs.IMAGE = ImageInputs
FieldInputs.FILE = FieldInputs
FieldInputs.VIDEO = VideoInputs
FieldInputs.CONTENT = ContentInputs
FieldInputs.OPTION = OptionInputs
FieldInputs.RICHTEXT = RichTextInputs
FieldInputs.COLOR = ColorInputs
FieldInputs.LOCATION = LocationInputs

export default FieldInputs
