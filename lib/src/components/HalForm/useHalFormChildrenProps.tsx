import { ChangeEvent, Children, useState } from "react";
import React, { useEffect } from "react";

import DxcDateInput from "@dxc-technology/halstack-react/date-input/DateInput";
import DxcSelect from "@dxc-technology/halstack-react/select/Select";
import useHalResource from "lib/src/hooks/useHalResource";

/**
 * State management is not Production quality
 * This is only for POC
 * If this project gets approved this will be first item to be refactored
 */

interface InputProps {
  formState: Record<string, string>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  type?: string;
  value: string;
  onBlur?: any;
}

const useHalFormChildrenProps = (
  children: React.ReactNode,
  apiEndpoint: string,
  authHeaders: any,
  selfManagedSave?: boolean
) => {
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [onlyUpdatedFields, setOnlyUpdatedFields] = useState<Record<string, any>>({});
  const [apiData, requestStatus, requestError, resourceInteractions] = useHalResource({
    url: apiEndpoint,
    headers: authHeaders,
  });

  useEffect(() => {
    const values: Record<string, any> = {};
    const extractFormValues = (children: React.ReactNode) => {
      Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const { props } = child;
          if (props.children) {
            extractFormValues(props.children);
          }
          if (!props.children && props.name) {
            values[props.name] = apiData.getProperty(props.name).value ?? null;
          }
        }
      });
    };

    requestStatus === "resolved" && extractFormValues(children);
    setFormState(values);
  }, [children, apiData, requestStatus]);

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

    switch (child.type) {
      case DxcDateInput:
        properties.onChange = async (e: any) => {
          if (selfManagedSave && resourceInteractions.update) {
            const { name } = child.props;
            const { value } = e;
            setFormState({ ...formState, [name]: value });
            await resourceInteractions.update({ [name]: value });
            setOnlyUpdatedFields({});
          }
        };
        break;
      case DxcSelect:
        {
          const schemaDataProperties: any = apiData.getSchemaProperties();
          if (schemaDataProperties) {
            const schemaOfChild: any = schemaDataProperties.find(
              (obj: any) => obj.key === child.props.name
            );
            if (schemaOfChild && schemaOfChild.oneOf) {
              properties.options = schemaOfChild.oneOf.map((one: any) => {
                return { label: one.title, value: one.enum[0] };
              });
            }
          }

          properties.onChange = async (e: any) => {
            const { name } = child.props;
            const { value } = e;
            setFormState({ ...formState, [name]: value });
            if (selfManagedSave && resourceInteractions.update) {
              await resourceInteractions.update({ [name]: value });
              setOnlyUpdatedFields({});
            }
          };
        }

        break;
      default:
        properties.onBlur = async () => {
          if (selfManagedSave && resourceInteractions.update) {
            await resourceInteractions.update(onlyUpdatedFields);
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
  return ({formState, onlyUpdatedFields, processChildren, requestStatus, requestError});
};

export default useHalFormChildrenProps;
