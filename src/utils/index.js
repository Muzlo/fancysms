import { resetRouter } from '@/router'

export function resetTokenAndClearUser() {
    // 退出登陆 清除用户资料
    localStorage.removeItem('userLoginInfo');
    localStorage.removeItem('fancysmsToken');
    localStorage.removeItem('userLoginChecked');
    // 重设路由
    resetRouter();
}

export const defaultDocumentTitle = '注册码系统'
export function getDocumentTitle(pageTitle) {
    if (pageTitle) return `${defaultDocumentTitle} - ${pageTitle}`
    return `${defaultDocumentTitle}`
}