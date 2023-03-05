import type { ContainerFieldType } from "@prisma/client";
import { ObjectId, Options } from ".";
import { Dayjs } from "dayjs";

type ContainerCreation = {
  name: string;
  published: boolean;
  slug: string[];
  metadatas: Metadata[];
  contentsMetadatas: Metadata[];
  fields: ContainerField[];
};

type Metadata = {
  name: "description" | "keywords" | "author" | "viewport";
  content: string | string[];
};

type ContainerField = {
  id?: ObjectId;
  tempId?: string;
  name: string;
  required: boolean;
  type: ContainerFieldType;
  multiple: boolean;

  min?: number;
  max?: number;
  containerId?: ObjectId;

  startDate?: Dayjs;
  endDate?: Dayjs;

  default: string | string[];

  options: Options<string>;
  metadata?: string;
};

export default ContainerCreation;
