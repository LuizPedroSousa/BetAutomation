const fillAttributes = (attributes?: { [key: string]: any }) => {
  let result = '';

  if (!attributes) {
    return result;
  }

  Object.entries(attributes).forEach(([key, value]) => {
    const keywords: any = {
      id: `#${value} `,
      className: `.${value}`,
      children: ` > ${value}`,
      element: ` ${value}`,
    };

    const keyword = keywords[key];

    if (!keyword && value !== undefined) {
      // remove last white space
      const resultFormatted = result.replace(/\s$/, '');
      const attributeFormatted = `[${key}${key !== 'disabled' ? `="${value}"` : ''}]`;

      result = `${resultFormatted}${attributeFormatted}`;
    } else if (value && keyword) {
      result += keyword;
    }
  });

  return result;
};

export { fillAttributes };
