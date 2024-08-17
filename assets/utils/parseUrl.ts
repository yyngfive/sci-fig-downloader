
export function parseQueryParameters(url: string): { [key: string]: string } {
    // 创建一个URL对象
    const urlObj = new URL(url);
    // 使用URLSearchParams解析查询字符串
    const queryParams = new URLSearchParams(urlObj.search);
    
    // 将查询参数转换为键值对对象
    const params: { [key: string]: string } = {};
    queryParams.forEach((value, key) => {
        params[key] = value;
    });
    
    return params;
}