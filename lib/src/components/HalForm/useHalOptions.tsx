/* eslint-disable no-prototype-builtins */

// on GET, we have _options, on OPTIONS, we got the option detail directly on response
const getOptionFromResponse: (response: any) => { links: any[]; title: string; properties: any; required: string[] } = (
    response
) => (response?.hasOwnProperty('_options') ? response['_options'] : response);

type MethodType = 'GET' | 'PATCH' | 'DELETE' | 'POST' | string;

interface MethodInterface {
    href: string;
    mediaType: string;
    method: MethodType;
    schema?: any;
    rel: string;
    title: string;
}

type PropertyType =
| string
| string[]
| number
| number[]
| boolean
| undefined
| null;

interface OptionsProperty {

    /**
     *
     * Return true if the property is patchable
     */
    canPatch: () => boolean;
    visible: boolean;
    minLength: number;
    maxLength: number;
    min: number;
    max: number;

    type: string;

    /**
     *
     */
    isRequired: boolean;

    /**
     * If the property is a complex list
     */
    isOneOf: boolean;

    /**
     * Return the list of values of the oneOf property
     */
    getValuesOfOneOf: <T = { value: string; label: string }>() => T[];

    /**
     * Return the label for a given value
     * @param value - value of the property
     * @returns -
     */
    getLabelOfOneOf: (value: PropertyType) => string;
};

export interface OnOptionsReturn {

    /**
     * Check if the method is allow
     * @param method - method type
     * @returns true if its allowed
     */
    canMethod: (method: MethodType) => boolean;

    /**
     * Check if the POST method is allow
     * @returns true if its allowed
     */
    canPost: () => boolean;

    /**
     * Check if the DELETE method is allow
     * @returns true if its allowed
     */
    canDelete: () => boolean;

    /**
     * Check if the PATCH method is allow
     * @returns true if its allowed
     */
    canPatch: () => boolean;

    /**
     *  Get the method detail of a rel
     * @param rel - rel to check, most of the time it's the inquery
     * @returns method detail
     */
    getMethodByRel: (rel: string) => MethodInterface;

    /**
     * Get the options for a property or a sub property of a complexlist
     * @param property - property name
     * @param subProperty - sub property name for complexlist only
     * @returns property options
     */
    getProperty: (property: string, subProperty?: string) => OptionsProperty;
}

export const onOptions = (response: any, forCollection = false): OnOptionsReturn => {
    const options = getOptionFromResponse(response);

    const getMethod = (method: MethodType): MethodInterface => options['links']?.find((item: any) => item.method === method);
    const getMethodByRel = (rel: string): MethodInterface => options['links']?.find((item: any) => item.rel === rel);
    const getMethodSchema = (method: MethodType): any => getMethod(method)?.schema;
    const canMethod = (method: MethodType): boolean => !!getMethod(method);
    const canPost = () => canMethod('POST');
    const canPatch = () => canMethod('PATCH');
    const canDelete = () => canMethod('DELETE');

    const getProperty = (property: string, subProperty?: string): OptionsProperty => {
        // subProperty in case of complex list
        const targetProperty = subProperty ?? property;

        // return the property object depends if the property is a complex list or not
        // base can be schema or options
        const getOptionOrSchemaProperties = (base: any) => {

            /**
             * For Normal/Root properties
             */
            if (!subProperty) {
                return base.properties;
            }

            /**
             * For ComplexList or SimpleList properties
             */

            if (!forCollection) {
                return base.properties?.[property]?.items.items ?? {};
            }

            /**
             * For Collection properties
             */
            const baseProperties = base?.properties?._links?.properties?.item?.properties?.[property].properties;
            return baseProperties?.oneOf?.[0] ?? baseProperties;
        };

        const propertiesOptions = getOptionOrSchemaProperties(options);

        // complexList attributes are in [property].items.items
        const canPatchProperty = () => {
            if (!canPatch()) {
                return false;
            }

            const schema = getMethodSchema('PATCH');
            // Check is the property can be patchable
            return schema ? getOptionOrSchemaProperties(schema).hasOwnProperty(targetProperty) : false;
        };

        const isRequired = !!(options?.required?.indexOf(property) >= 0);
        const isVisible = propertiesOptions.hasOwnProperty(targetProperty);

        // If it's not visible, that means this property doesn't exist, so we return an empty object
        const propertyOption = isVisible ? propertiesOptions[targetProperty] : {};

        const isOneOf: boolean = propertyOption.hasOwnProperty('oneOf') || propertyOption.enum?.length > 0;
        const { minLength, maxLength, minimum, maximum, type } = propertyOption;
        const getValuesOfOneOf = () => {
            if (!isOneOf) {
                return [];
            }

            if (propertyOption?.['oneOf']) {
                return propertyOption?.['oneOf'].map(({ enum: [value], title }: { enum: any[]; title: string }) => ({
                    value,
                    label: title
                }));
            }
            else {
                return propertyOption?.['enum'].map((enumItem: any) => ({
                    value: enumItem,
                    label: enumItem.toString()
                }));
            }
        };

        // Get the label of a oneOf, if the value doesn't exist, it will return undefined
        const getLabelOfOneOf = (givenValue: any) => getValuesOfOneOf().find(({ value }: { value: any }) => value === givenValue)?.label;

        return {
            canPatch: canPatchProperty,
            visible: isVisible,
            minLength,
            maxLength,
            min: minimum,
            max: maximum,
            type,
            isRequired,
            isOneOf,
            getValuesOfOneOf,
            getLabelOfOneOf
        };
    };

    return {
        canMethod,
        canPost,
        canDelete,
        canPatch,
        getMethodByRel,
        getProperty
    };
};
