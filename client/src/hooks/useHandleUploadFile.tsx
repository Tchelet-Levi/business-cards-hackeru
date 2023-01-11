import React from "react";
import useFetchBasic from "./useFetchBasic";

export default function useHandleUploadFile() {
  const fetchWithToken = useFetchBasic();

  /**
   *
   * @param e The change event of the
   * ```html
   * <input type="file"/>
   * ```
   * @returns the data object
   * ``` ts
   * const data = {success: boolean, message: any};
   * ```
   * from the api call to 'api/image/upload'.
   *
   * Input element must contain the following attributes:
   * ```html
   * <input type="file" name="image" accept=".png,.jpg,.jpeg"/>
   * ```
   */
  async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = Array.from(e.target.files)[0];

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetchWithToken("api/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const { success, message } = data;

      return data;
    }
  }

  return React.useCallback(handleUploadFile, []);
}
