export type TemplateParams = Record<string, string>;

/** 把字符串里的 {{key}} 替换成 params 对应值；找不到就保留原样 */
export function substituteParams(text: string, params: TemplateParams) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) =>
    k in params ? params[k] : `{{${k}}}`,
  );
}
