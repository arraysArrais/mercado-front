import dayjs from 'dayjs';

export function dateConverter(
  data: string | Date,
  template:
    | 'YYYYMMDD'
    | 'DDMMYYYY'
    | 'MMYYYY'
    | 'DD/MM/YYYY'
    | 'DD/MM/YY'
    | 'YYYY-MM-DD'
    | 'MM/YYYY'
    | 'YYYYMM'
    | 'HHmmss'
    | 'HH:mm:ss'
    | 'HH:mm'
    | 'MM'
    | 'YYYY'
    | 'YY'
    | 'MMMYYYY'
    | 'DD'
    | 'YYYY-MM'
    | 'DD/MM/YYYY HH:mm:ss'
    | 'DD/MM/YYYY HH:mm',
  isLocal = false,
): string {
  return isLocal ? dayjs(data).format(template) : dayjs(data).locale('pt-br').format(template);
}