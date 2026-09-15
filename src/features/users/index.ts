/**
 * Public interface of the users feature.
 * 只公開其他層（app/router）真正需要的東西：頁面元件。
 * API、Query、型別、業務規則都是這個 Feature 的內部細節，不對外公開。
 */
export { UserListPage } from './pages/UserListPage';
export { CreateUserPage } from './pages/CreateUserPage';
export { UserDetailPage } from './pages/UserDetailPage';
