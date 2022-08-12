type Attribute = 'class' | 'placeholder';

export interface GetAttributeDTO {
  target: string;
  attribute_name: Attribute;
  is_iframe: boolean;
  max_selector_timeout: number;
}
