export type TemplateTokens = Record<
  string,
  string | number | boolean | null | undefined
>;

const TOKEN_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

export function applyTemplate(input: string, tokens: TemplateTokens): string {
  return input.replace(TOKEN_PATTERN, (token, key) => {
    const value = tokens[key];
    if (value === undefined || value === null) {
      return token;
    }

    return String(value);
  });
}

export function applyTemplateDeep<T>(value: T, tokens: TemplateTokens): T {
  if (typeof value === "string") {
    return applyTemplate(value, tokens) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => applyTemplateDeep(item, tokens)) as T;
  }

  if (value && typeof value === "object") {
    const output: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(
      value as Record<string, unknown>,
    )) {
      output[key] = applyTemplateDeep(nestedValue, tokens);
    }

    return output as T;
  }

  return value;
}
