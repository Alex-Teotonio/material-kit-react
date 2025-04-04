import { format, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}


export function delay(ms=2000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}