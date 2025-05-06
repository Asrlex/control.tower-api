/**
 * Formats a template string by replacing placeholders with corresponding values from the variables object.
 * @param template - The template string containing placeholders in the format of @key.
 * @param variables - An object containing key-value pairs where the key corresponds to the placeholder in the template string.
 * @returns The formatted string with placeholders replaced by their corresponding values.
 * @example
 * const template = "Hello, @name! Welcome to @place.";
 * const variables = { name: "John", place: "Earth" };
 * const result = formatTemplateString(template, variables);
 * // console.log(result); // Output: "Hello, John! Welcome to Earth."
 */
export function formatTemplateString(
  template: string,
  variables: Record<string, any>,
): string {
  return Object.keys(variables).reduce(
    (result, key) => result.replaceAll(`@${key}`, variables[key]),
    template,
  );
}
