import { ObjectId } from ".";

type FormCreation = {
  name: string;
  redirectMail: boolean;
  mailToRedirect?: string;
  hasExtraData: boolean;
  extraData?: any;
  fields: {
    id?: ObjectId;
    tempId?: string;

    line: number;
    position: number;

    label: string;
    type: string;
    required: boolean;
  }[];
};

export default FormCreation;
