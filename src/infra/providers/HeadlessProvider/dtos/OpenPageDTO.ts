interface Dimensions {
  width: number;
  height: number;
}

export interface OpenPageDTO {
  dimensions?: Dimensions;
  headless?: boolean;
}
