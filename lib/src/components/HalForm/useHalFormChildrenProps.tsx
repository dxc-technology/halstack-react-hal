import { ChangeEvent, Children, useState } from "react";
import React, { useEffect } from "react";

import { onOptions } from "./useHalOptions";
import useHalResource from "../../hooks/useHalResource";

/**
 * State management is not Production quality
 * This is only for POC
 * If this project gets approved this will be first item to be refactored
 */

type InputProps = {
  formState: Record<string, string>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string;
  value: string;
  onBlur?: any;
};

type errorType = {
  status?: string;
  message?: string;
  body?: {
    _outcome?: any;
    messages?: any;
  };
};

const useHalFormChildrenProps = (
  children: React.ReactNode,
  apiEndpoint: string,
  authHeaders: any,
  selfManagedSave?: boolean
) => {
  const [formFieldState, setFormFieldState] = useState<Record<string, any>>({});
  const [onlyUpdatedFields, setOnlyUpdatedFields] = useState<Record<string, any>>({});
  const [apiUpdateError, setAPIUpdateError] = useState<errorType>({});
  const [apiOptions, setAPIOptions] = useState<Record<string, any>>({});
  const [apiData, requestStatus, requestError, resourceInteractions] = useHalResource({
    url: apiEndpoint,
    headers: authHeaders,
  });

 const setFormState = (newState: Record<string, any>) => {
    setFormFieldState((prevState: Record<string, any>) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    const values: Record<string, any> = { ...formFieldState, ...onlyUpdatedFields };
    const options: Record<string, any> = {...apiOptions };
    const extractFormValues = (children: React.ReactNode) => {
      Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const { props } = child;
          if (props.children) {
            extractFormValues(props.children);
          }

          if (!props.children && props.name && apiData) {
            values[props.name] = apiData.getProperty(props.name).value ?? null;
            options[props.name] =  onOptions(apiData.resourceRepresentation).getProperty(props.name) ?? null;            
          }
        }
      });
    };

    extractFormValues(children);
    setFormState(values);
    setAPIOptions(options);
  }, [apiData]);

  const schemaType = (child: any) => {
    const schemaDataProperties: any = apiData?.getSchemaProperties();
    if (schemaDataProperties) {
      const schemaOfChild: any = schemaDataProperties.find(
        (obj: any) => obj.key === child.props.name
      );
      if (schemaOfChild?.oneOf) {
        return "select";
      }
      if (schemaOfChild?.format === "date") {
        return "date";
      }
      if (schemaOfChild?.format === "number") {
        return "number";
      }
      if (schemaOfChild?.format === "integer") {
        return "integer";
      }
      return "text";
    }
  };

  const updateHandler = async (payload: any) => {
    if (payload && Object.keys(payload).length) {
      try {
        await resourceInteractions.update(payload);
        setOnlyUpdatedFields({});
        setAPIUpdateError({});
      } catch (error: any) {
        setAPIUpdateError(error);
      }
    }
  };

  const obtainRenderProps = (child: any) => {
    const properties: any = {
      key: child.props.name,
      value: formFieldState[child.props.name] || "",
      min: apiOptions[child.props.name]?.min,
      max: apiOptions[child.props.name]?.max,      
      disabled: !apiOptions[child.props.name]?.canPatch?.(),            
      optional: !apiOptions[child.props.name]?.isRequired,
      minLength: apiOptions[child.props.name]?.minLength,
      maxLength: apiOptions[child.props.name]?.maxLength,
      onChange: (e: any) => {
        const { name } = child.props;
        const { value } = e;
        setFormState({ [name]: value });
        setOnlyUpdatedFields({ ...onlyUpdatedFields, [name]: value });
      },
    };

    switch (schemaType(child)) {
      case "date":
        properties.onChange = async (e: any) => {
          if (selfManagedSave && resourceInteractions.update) {
            const { name } = child.props;
            const { value } = e;
            setFormState({ [name]: value });
            await updateHandler({ [name]: value });
          }
        };
        break;
      case "select":
        {
          const schemaDataProperties: any = apiData.getSchemaProperties();
          if (schemaDataProperties) {
            const schemaOfChild: any = schemaDataProperties.find(
              (obj: any) => obj.key === child.props.name
            );
            if (schemaOfChild?.oneOf) {
              properties.options = schemaOfChild.oneOf.map((one: any) => {
                return { label: one.title, value: one.enum[0] };
              });
            }
          }

          properties.onChange = async (e: any) => {
            const { name } = child.props;
            let { value } = e;
            if (!value) {
              // this is due to inconsistent change event param
              value = e;
            }
            setFormState({ [name]: value });
            if (selfManagedSave && resourceInteractions.update) {
              await updateHandler({ [name]: value });
            }
          };
        }

        break;
      default:
        properties.onBlur = async () => {
          if (selfManagedSave && resourceInteractions.update) {
            await updateHandler(onlyUpdatedFields);
          }
        };
        break;
    }

    return properties;
  };
  const processChildren = (children: React.ReactNode) => {
    return Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.props.children) {
          const processedGrandchildren: any = processChildren(child.props.children);
          return React.cloneElement(child, {}, processedGrandchildren);
        }

        const inputProps: InputProps = {
          ...obtainRenderProps(child),
        };

        return React.cloneElement(child, inputProps);
      }

      return child;
    });
  };
  return {
    formState: formFieldState,
    onlyUpdatedFields,
    processChildren,
    requestStatus,
    requestError,
    apiUpdateError,
  };
};

export default useHalFormChildrenProps;
