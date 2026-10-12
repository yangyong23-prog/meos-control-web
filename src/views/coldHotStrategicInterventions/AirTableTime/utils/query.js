export const queryString = (value, fallback = '') => {
    const target = Array.isArray(value) ? value[0] : value;
    return typeof target === 'string' && target ? target : fallback;
};

export const parseJsonQuery = (value, fallback) => {
    const rawValue = queryString(value);
    if (!rawValue) {
        return fallback;
    }

    try {
        const parsedValue = JSON.parse(rawValue);
        if (Array.isArray(fallback)) {
            return Array.isArray(parsedValue) ? parsedValue : fallback;
        }
        return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue) ? parsedValue : fallback;
    } catch {
        return fallback;
    }
};

export const parseStringListQuery = value => {
    if (Array.isArray(value)) {
        return [...new Set(value.flatMap(item => parseStringListQuery(item)))];
    }

    const rawValue = queryString(value);
    if (!rawValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(rawValue);
        if (Array.isArray(parsedValue)) {
            return [...new Set(parsedValue.filter(item => typeof item === 'string' && item))];
        }
    } catch {
        // 非 JSON 参数继续按逗号分隔解析
    }

    return [
        ...new Set(
            rawValue
                .split(',')
                .map(item => item.trim())
                .filter(Boolean)
        )
    ];
};
