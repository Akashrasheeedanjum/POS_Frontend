export function deepTrimObject(obj: any): any {
  if (typeof obj === "string") {
    return obj.trim();
  }

  if (Array.isArray(obj)) {
    return obj.map(deepTrimObject);
  }

  if (typeof obj === "object" && obj !== null) {
    const trimmed: any = {};
    for (const key in obj) {
      trimmed[key] = deepTrimObject(obj[key]);
    }
    return trimmed;
  }

  return obj;
}
