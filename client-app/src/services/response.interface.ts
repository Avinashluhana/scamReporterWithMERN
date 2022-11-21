
export interface ApiError {
  error: any;
  message: string;
  statusCode: string;
};

export interface ApiResponse<E> {
  data: E,
  statusCode: string;
}
