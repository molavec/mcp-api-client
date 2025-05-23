
export interface ApiProperty {
  name: string;
  default?: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface ApiConfig {
  name: string;
  description: string;
  url: string;
  method: string;
  content?: {
    body?: ApiProperty[];
    query?: ApiProperty[];
    headers?: ApiProperty[];
    path?: ApiProperty[];
  };
}