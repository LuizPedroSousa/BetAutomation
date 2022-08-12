interface Attributes {
  className: string;
  id: string;
  'aria-label': string;
  'aria-pressed': boolean;
  name: string;
  type: string;
}

interface Text {
  value: string;
  children?: string;
  element?: string;
  element_attributes?: Partial<Attributes>;
}

export interface GetElementDTO {
  attributes: Partial<Attributes>;
  max_selector_timeout?: number;
  element?: string;
  element_attributes?: Partial<Attributes>;
  target?: string;
  text?: Text;
  timeout?: number;
}
