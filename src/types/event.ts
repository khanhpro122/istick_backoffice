interface IEvent {
  id: number;
  slug: string;
  bannerUrl: string;
  title: string;
  host: string;
  types: Array<string>;
  cost: number;
  registrationDeadline: string | Date | any;
  startDate: string | Date | any;
  endDate: string | Date | any;
  description: string;
  location: string;
  mapLocation: string;
  livestreamUrl: string;
  recap: string;
  eventQuestions?: TQuestion[]
}

type ListEvent = IEvent[];

type TAnswer = {
  content: string,
  id: string,
  key: string,
  isNew?: boolean,
}

type TQuestion = {
  content: string,
  questionType: string,
  id: string,
  required: boolean,
  choices: TAnswer[],
  isNew?: boolean
}

export type { IEvent, ListEvent, TQuestion };
