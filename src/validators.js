export const required = value => (value ? undefined : 'Required');
export const nonEmpty = value =>
    value.trim() !== '' ? undefined : 'Cannot be empty';
export const onlyNumbers = value => value == Number(value) ? undefined : "Tracking numbers must only contain numbers";
export const exactLength = value => value.length === 5 ? undefined : "Must only be 5 numbers long";