import { useState, useEffect } from "react";
import { HalApiCaller } from "@dxc-technology/halstack-client";

const useHalResource = ({ url, headers }) => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [resource, setResource] = useState(null);
  const [interactions, setInteractions] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      setStatus("fetching");
      try {
        const response = await HalApiCaller.get({
          url,
          headers
        });
        if (response.containsHalResource) {
          setStatus("resolved");
          setResource(response.halResource);
          setInteractions(getInteractions(response.halResource));
        } else {
          setStatus("rejected");
          setResource(null);
          setError("Response doesnt contain a valid HAL resource");
        }
      } catch (err) {
        setStatus("rejected");
        setResource(null);
        setError("Error fetching HAL resource");
      }
    };

    const getInteractions = halResource => {
      return halResource
        .getInteractions()
        .map(interaction => ({
          rel: interaction.rel,
          handler: getInteractionHandler(interaction.method)
        }))
        .reduce(
          (obj, interaction) => ({
            ...obj,
            [interaction.rel]: interaction.handler
          }),
          {}
        );
    };

    const getInteractionHandler = method => {
      const apiCallerFunctionName =
        method === "GET"
          ? "get"
          : method === "POST"
          ? "post"
          : method === "DELETE"
          ? "del"
          : method === "PATCH"
          ? "patch"
          : null;
      return async body => {
        setStatus("interaction");
        return HalApiCaller[apiCallerFunctionName]({
          url,
          body,
          headers
        })
          .then(response => {
            if (response.containsHalResource) {
              setStatus("resolved");
              setResource(response.halResource);
            } else {
              setStatus("resolved");
            }
          })
          .catch(err => {
            setStatus("resolved");
            throw err;
          });
      };
    };
    if (url) {
      fetchResource();
    }
  }, [url, headers]);

  return [resource, status, error, interactions];
};

export default useHalResource;
