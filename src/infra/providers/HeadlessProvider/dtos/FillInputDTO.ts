interface Attributes {
  className: string;
  id: string;
  'aria-label': string;
  'aria-pressed': boolean;
  name: string;
  type: string;
  placeholder: string;
}

export interface FillInputDTO {
  target?: string;
  text: string;
  attributes?: Partial<Attributes>;
  element?: string;
  element_attributes?: Partial<Attributes>;
  element_text_content?: string;
  timeout?: number;
  max_selector_timeout?: number;
  is_iframe: boolean;
}
