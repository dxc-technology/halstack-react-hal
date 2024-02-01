import React, { ChangeEvent, Children, ReactNode, useEffect, useState } from 'react';

import useHalResource from './../../hooks/useHalResource';

interface HalFormProps {
  children: ReactNode;
  apiEndpoint: string;
  authHeaders?: any;
  onSubmit?: (formState: Record<string, string>) => void;
  selfManagedSave?: boolean;
}

interface InputProps {
  formState: Record<string, string>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string;
  value: string;
  onBlur?: any;
}

const HalForm: React.FC<HalFormProps> = ({
  children,
  apiEndpoint,
  authHeaders,
  onSubmit,
  selfManagedSave,
}) => {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [updatedFormState, setUpdatedFormState] = useState<Record<string, any>>({});
  const [apiData, requestStatus, requestError, resourceInteractions] = useHalResource({
    url: apiEndpoint,
    headers: authHeaders,
  });

  useEffect(() => {
    const values: Record<string, any> = {}; 
    const extractFormValues = (children: React.ReactNode) => {           
      Children.forEach(children, (child, index) => {
        if (React.isValidElement(child)) {
          const { props } = child;
          if (props.children){
            extractFormValues(props.children);
          }
          if (!props.children && props.name) {
            values[props.name] = apiData.getProperty(props.name).value ?? null;
          }
        }
      });      
    };

    requestStatus === 'resolved' && extractFormValues(children);
    setFormState(values);;
  }, [children, apiData, requestStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * For future set up of action buttons
     */
    e.preventDefault();
    if (onSubmit) {
      onSubmit(updatedFormState);
    }
  };

  const obtainProps = (child: any) => {
    /**
     * POC quality, this will be driven by native DXC Assure CDK Types and Data Schema Types
     * 
     * 
     * 
     * Type checking is not the right implementation as type is an intrinsic property of html input element
     * it must not be overwritten
     * 
     * we need to find a better way finding out about the CDK Component type
     */
    const properties: any = {};
    if (child.props.type === 'DxcTextInput') {
      properties.onBlur = async () => {
        if (selfManagedSave && resourceInteractions.update) {
          await resourceInteractions.update(updatedFormState);
          setUpdatedFormState({});
        }
      };
    }
    if (child.props.type === 'DxcDateInput') {
      properties.onChange = async (e: any) => {
        if (selfManagedSave && resourceInteractions.update) {
          const { name } = child.props;
          const { value } = e;
          setFormState({ ...formState, [name]: value });
          await resourceInteractions.update({ [name]: value });
          setUpdatedFormState({});
        }
      };
    }
    if (child.props.type === 'DxcSelect') {
      properties.onChange = async (e: any) => {
        const { name } = child.props;
        const { value } = e;
        setFormState({ ...formState, [name]: value });
        if (selfManagedSave && resourceInteractions.update) {
          await resourceInteractions.update({ [name]: value });
          setUpdatedFormState({});
        }
      };
      const schemaDataProperties: any = apiData.getSchemaProperties();
      const schemaOfChild =
        schemaDataProperties &&
        schemaDataProperties.find((obj: any) => obj.key === child.props.name);
      properties.options =
        schemaOfChild &&
        schemaOfChild.oneOf &&
        schemaOfChild.oneOf.map((one: any) => {
          return { label: one.title, value: one.enum[0] };
        });
    }
    return properties;
  };

  const processChildren = (children: React.ReactNode) => {
    return Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        let processedChild;
        if (child.props.name) {
          const inputProps: InputProps = {
            onChange: (e: any) => {
              const { name } = child.props;
              const { value } = e;
              setFormState({ ...formState, [name]: value });
              setUpdatedFormState({ ...updatedFormState, [name]: value });
            },
            name: child.props.name,
            type: child.props.type,
            value: formState[child.props.name] || '',
            ...obtainProps(child),
          };
          processedChild = React.cloneElement(child, inputProps);
        }

        if (child.props.children) {
          const processedGrandchildren: any = processChildren(child.props.children);
          return React.cloneElement(child, {}, processedGrandchildren);
        }

        return processedChild;
      }

      return child;
    });
  };

  return (
    <>
      {requestStatus === 'resolved' && (
        <form onSubmit={handleSubmit}>{processChildren(children)}</form>
      )}{' '}
    </>
  );
};

export default HalForm;
