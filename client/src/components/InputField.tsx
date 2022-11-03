import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';
import React, { InputHTMLAttributes } from 'react';
import { useField } from 'formik';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  name: string;
  label: string;
  placeholder?: string;
  textarea?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, textarea, size: _, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={props.name}>{label}</FormLabel>
      {textarea ? <Textarea {...field} {...props} id={field.name} placeholder={props.placeholder} />
        : <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
      }
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}