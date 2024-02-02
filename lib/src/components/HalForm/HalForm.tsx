import React, { ReactNode } from "react";

import useHalFormChildrenProps from "./useHalFormChildrenProps";

interface HalFormProps {
  children: ReactNode;
  apiEndpoint: string;
  authHeaders?: any;
  onSubmit?: (formState: Record<string, string>, onlyUpdatedFields: Record<string, string>) => void;
  selfManagedSave?: boolean;
}

const HalForm: React.FC<HalFormProps> = ({
  children,
  apiEndpoint,
  authHeaders,
  onSubmit,
  selfManagedSave,
}) => {
  const { processChildren, formState, onlyUpdatedFields, requestStatus: apiRequestStatus } = useHalFormChildrenProps(
    children,
    apiEndpoint,
    authHeaders,
    selfManagedSave
  );
  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * For future set up of action buttons
     */
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formState, onlyUpdatedFields);
    }
  };

  return <form onSubmit={handleSubmit}>{apiRequestStatus === 'resolved' && processChildren(children)}</form>;
};

export default HalForm;
