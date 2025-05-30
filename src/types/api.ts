
export interface ApiBodyProperty {
  name: string;
  default?: string | number | boolean | null;
  type: string;
  required: boolean;
  description?: string;
  value?: string | number | boolean | null;
}

export interface ApiConfig {
  name: string;
  description: string;
  url: string;
  method: string;
  options?: {
    body?: ApiBodyProperty[];
    query?: ApiBodyProperty[];
    headers?: ApiBodyProperty[];
    path?: ApiBodyProperty[];
  };
}