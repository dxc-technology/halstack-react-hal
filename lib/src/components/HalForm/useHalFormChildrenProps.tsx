import { ChangeEvent, Children, useState } from "react";
import React, { useEffect } from "react";

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

type SchemaType = "date" | "select" | "text" | "number";

const useHalFormChildrenProps = (
  children: React.ReactNode,
  apiEndpoint: string,
  authHeaders: any,
  selfManagedSave?: boolean
) => {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [onlyUpdatedFields, setOnlyUpdatedFields] = useState<Record<string, any>>({});
  const [apiUpdateError, setAPIUpdateError] = useState<errorType>({});
  const [apiData, requestStatus, requestError, resourceInteractions] = useHalResource({
    url: apiEndpoint,
    headers: authHeaders,
  });

  useEffect(() => {    
    const values: Record<string, any> = {...formState, ...onlyUpdatedFields};
    const extractFormValues = (children: React.ReactNode) => {
      Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const { props } = child;
          if (props.children) {
            extractFormValues(props.children);
          }
          
          if (!props.children && props.name && apiData) {
            values[props.name] = apiData.getProperty(props.name).value ?? null;
          }
        }
      });
    };

    extractFormValues(children);
    setFormState(values);
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
    try {
      await resourceInteractions.update(payload);
      setAPIUpdateError({});
    } catch (error: any) {
      setAPIUpdateError(error);
    }
  };

  const obtainRenderProps = (child: any) => {
    const properties: any = {
      onChange: (e: any) => {
        const { name } = child.props;
        const { value } = e;
        setFormState({ ...formState, [name]: value });
        setOnlyUpdatedFields({ ...onlyUpdatedFields, [name]: value });
      },
      value: formState[child.props.name] || "",
    };

    switch (schemaType(child)) {
      case "date":
        properties.onChange = async (e: any) => {
          if (selfManagedSave && resourceInteractions.update) {
            const { name } = child.props;
            const { value } = e;
            setFormState({ ...formState, [name]: value });
            await updateHandler({ [name]: value });
            setOnlyUpdatedFields({});
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
            setFormState({ ...formState, [name]: value });
            if (selfManagedSave && resourceInteractions.update) {
              await updateHandler({ [name]: value });
              setOnlyUpdatedFields({});
            }
          };
        }

        break;
      default:
        properties.onBlur = async () => {
          if (selfManagedSave && resourceInteractions.update) {
            await updateHandler(onlyUpdatedFields);
            setOnlyUpdatedFields({});
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
    formState,
    onlyUpdatedFields,
    processChildren,
    requestStatus,
    requestError,
    apiUpdateError,
  };
};

export default useHalFormChildrenProps;
