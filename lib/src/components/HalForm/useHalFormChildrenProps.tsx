import { ChangeEvent, Children, useState } from "react";
import React, { useEffect } from "react";

import { HalApiCaller } from "@dxc-technology/halstack-client";
import { onOptions } from "./HalOptions";

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

  const setFormState = (newState: Record<string, any>) => {
    setFormFieldState((prevState: Record<string, any>) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    const values: Record<string, any> = { ...formFieldState, ...onlyUpdatedFields };
    HalApiCaller.get({
      url: apiEndpoint,
      headers: { ...authHeaders },
    }).then((response: any) => {     
      extractFormValues(children, response);
      setFormState(values);
    }); 
    const extractFormValues = (children: React.ReactNode, response: any) => {
      Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const { props } = child;
          if (props.children) {
            return extractFormValues(props.children, response);
          }
          if (props.name) {
            values[props.name] = response.halResource.resourceRepresentation[props.name] ?? null;
          }
        }
      });
    };   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const options: Record<string, any> = { ...apiOptions };
    HalApiCaller.options({
      url: apiEndpoint,
      headers: { ...authHeaders },
    }).then((response: any) => {
      const processedOptions = onOptions({ _options: response.halResource.resourceRepresentation });
      extractOptions(children, processedOptions);
      setAPIOptions(options);
    });
    const extractOptions = (children: React.ReactNode, processedOptions: any) => {
      Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const { props } = child;
          if (props.children) {
            return extractOptions(props.children, processedOptions);
          }
          if (props.name) {
            options[props.name] = processedOptions.getProperty(props.name) ?? null;
          }
        }
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateHandler = async (payload: any) => {
    if (selfManagedSave && payload && Object.keys(payload).length) {
      try {
        await HalApiCaller.patch({
          url: apiEndpoint,
          headers: { ...authHeaders },
          body: { ...payload },
        });
        setOnlyUpdatedFields({});
        setAPIUpdateError({});
      } catch (error: any) {
        setAPIUpdateError(error);
      }
    }
  };

  const obtainRenderProps = (child: any) => {
    if (!child?.props?.name) {
      return {};
    }
    const properties: any = {
      key: child.props.name,
      value: formFieldState?.[child.props.name] || "",
      min: apiOptions?.[child.props.name]?.min,
      max: apiOptions?.[child.props.name]?.max,
      disabled: !apiOptions?.[child.props.name]?.canPatch?.(),
      optional: !apiOptions?.[child.props.name]?.isRequired,
      minLength: apiOptions?.[child.props.name]?.minLength,
      maxLength: apiOptions?.[child.props.name]?.maxLength,
      onChange: (e: any) => {
        const { name } = child.props;
        let { value } = e;
        if (!value) {
          // this is due to inconsistent change event param
          value = e;
        }
        setFormState({ [name]: value });
        setOnlyUpdatedFields({ ...onlyUpdatedFields, [name]: value });
      },
      onBlur: async () => {
        await updateHandler(onlyUpdatedFields);
      },
    };
    if (apiOptions?.[child.props.name]?.isOneOf) {
      properties.options = apiOptions?.[child.props.name]?.getValuesOfOneOf();
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
    apiUpdateError,
  };
};

export default useHalFormChildrenProps;
