interface Attributes {
  className: string;
  id: string;
  'aria-label': string;
  'aria-pressed': boolean;
  name: string;
  type: string;
  placeholder: string;
}

export interface GetTextDTO {
  target?: string;
  attributes?: Partial<Attributes>;
  is_iframe?: boolean;
  element?: string;
  element_attributes?: Partial<Attributes>;
  max_selector_timeout?: number;
  timeout?: number;
}
