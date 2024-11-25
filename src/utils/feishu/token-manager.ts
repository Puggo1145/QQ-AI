import { getClient } from './client';

class TokenManager {
    private static instance: TokenManager;
    private tenantAccessToken: string | null = null;
    private tokenExpireTime: number = 0;
    
    private constructor() {}
    
    public static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }
    
    public async getTenantAccessToken(): Promise<string> {
        // 如果 token 存在且未过期，直接返回
        const now = Date.now();
        if (this.tenantAccessToken && this.tokenExpireTime > now) {
            return this.tenantAccessToken;
        }
        
        try {
            const res = await getClient().auth.tenantAccessToken.internal({
                data: {
                    app_id: process.env.LARK_APP_ID as string,
                    app_secret: process.env.LARK_APP_SECRET as string,
                }
            });
            
            if (res.code !== 0) {
                throw new Error(res.msg);
            }
            
            // @ts-ignore
            this.tenantAccessToken = res.tenant_access_token;
            // token 有效期为 2 小时，这里提前 5 分钟刷新
            // @ts-ignore
            this.tokenExpireTime = now + (res.expire - 5 * 60) * 1000;
            
            return this.tenantAccessToken!;
        } catch (error: any) {
            throw new Error(`Failed to get tenant access token: ${error.message}`);
        }
    }
}

export const tokenManager = TokenManager.getInstance(); 