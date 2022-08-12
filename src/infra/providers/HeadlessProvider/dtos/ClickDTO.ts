interface Attributes {
  className: string;
  id: string;
  'aria-label': string;
  'aria-pressed': boolean;
  name: string;
}

interface Text {
  value: string;
  children?: string;
  element?: string;
  elementAttributes?: Partial<Attributes>;
}

export interface ClickDTO {
  attributes?: Partial<Attributes>;
  max_selector_timeout?: number;
  element?: string;
  element_attributes?: Partial<Attributes>;
  target?: string;
  text?: Text;
  is_iframe?: boolean;
  timeout?: number;
}
